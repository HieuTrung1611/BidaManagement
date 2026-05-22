package com.mhbilliards.billiards_management.service.sessionEquipment;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mhbilliards.billiards_management.dto.sessionEquipment.CreateSessionEquipmentDTO;
import com.mhbilliards.billiards_management.dto.sessionEquipment.SessionEquipmentResponseDTO;
import com.mhbilliards.billiards_management.entity.BilliardSession;
import com.mhbilliards.billiards_management.entity.Equipment;
import com.mhbilliards.billiards_management.entity.SessionEquipment;
import com.mhbilliards.billiards_management.mapper.SessionEquipmentMapper;
import com.mhbilliards.billiards_management.repository.BilliardSessionRepository;
import com.mhbilliards.billiards_management.repository.EquipmentRepository;
import com.mhbilliards.billiards_management.repository.SessionEquipmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SessionEquipmentServiceImpl implements SessionEquipmentService {

    private final SessionEquipmentRepository sessionEquipmentRepository;
    private final BilliardSessionRepository billiardSessionRepository;
    private final EquipmentRepository equipmentRepository;
    private final SessionEquipmentMapper sessionEquipmentMapper;

    @Override
    @Transactional
    public SessionEquipmentResponseDTO rentEquipmentForSession(CreateSessionEquipmentDTO request) {
        BilliardSession session = billiardSessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session không tồn tại"));

        Equipment equipment = equipmentRepository.findById(request.getEquipmentId())
                .orElseThrow(() -> new RuntimeException("Thiết bị không tồn tại"));

        // Check availability
        if (equipment.getAvailableQuantity() < request.getQuantity()) {
            throw new RuntimeException("Số lượng thiết bị available không đủ");
        }

        // Deduct available quantity
        equipment.setAvailableQuantity(equipment.getAvailableQuantity() - request.getQuantity());
        equipmentRepository.save(equipment);

        // Charge equipment for 1 hour upfront (no rounding)
        LocalDateTime now = LocalDateTime.now();
        Double totalAmount = equipment.getRentalPricePerHour() * 1.0 * request.getQuantity();

        SessionEquipment sessionEquipment = SessionEquipment.builder()
                .session(session)
                .equipment(equipment)
                .quantity(request.getQuantity())
                .startTime(now)
                .endTime(now) // Mark as charged
                .hourlyRate(equipment.getRentalPricePerHour())
                .totalAmount(totalAmount) // Charged for 1 hour
                .build();

        SessionEquipment savedSessionEquipment = sessionEquipmentRepository.save(sessionEquipment);
        return sessionEquipmentMapper.toResponseDTO(savedSessionEquipment);
    }

    @Override
    @Transactional
    public SessionEquipmentResponseDTO returnEquipment(Long id) {
        SessionEquipment sessionEquipment = sessionEquipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session equipment không tồn tại"));

        Equipment equipment = sessionEquipment.getEquipment();

        // New logic: Equipment is charged 1 hour upfront
        // If totalAmount already set, equipment is already charged - just verify and return
        if (sessionEquipment.getTotalAmount() != null && sessionEquipment.getTotalAmount() > 0) {
            // Already charged upfront when rented, quantity will be returned on session end
            // This method is just for marking as "returned" if needed
            return sessionEquipmentMapper.toResponseDTO(sessionEquipment);
        }

        // Backward compatibility: Old logic for equipment rented before new pricing
        if (sessionEquipment.getEndTime() != null) {
            throw new RuntimeException("Thiết bị này đã được trả rồi");
        }

        // Calculate based on actual usage time (old logic)
        LocalDateTime endTime = LocalDateTime.now();
        sessionEquipment.setEndTime(endTime);

        long minutes = ChronoUnit.MINUTES.between(sessionEquipment.getStartTime(), endTime);
        double hours = minutes / 60.0;
        Double totalAmount = sessionEquipment.getHourlyRate() * hours * sessionEquipment.getQuantity();

        sessionEquipment.setTotalAmount(totalAmount);
        
        // Return available quantity for old logic equipment
        equipment.setAvailableQuantity(equipment.getAvailableQuantity() + sessionEquipment.getQuantity());
        equipmentRepository.save(equipment);

        SessionEquipment updatedSessionEquipment = sessionEquipmentRepository.save(sessionEquipment);
        return sessionEquipmentMapper.toResponseDTO(updatedSessionEquipment);
    }

    @Override
    @Transactional(readOnly = true)
    public SessionEquipmentResponseDTO getSessionEquipmentById(Long id) {
        SessionEquipment sessionEquipment = sessionEquipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session equipment không tồn tại"));
        return sessionEquipmentMapper.toResponseDTO(sessionEquipment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionEquipmentResponseDTO> getEquipmentsBySessionId(Long sessionId) {
        List<SessionEquipment> sessionEquipments = sessionEquipmentRepository.findBySessionId(sessionId);
        return sessionEquipmentMapper.toResponseDTOList(sessionEquipments);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionEquipmentResponseDTO> getActiveRentalsBySessionId(Long sessionId) {
        List<SessionEquipment> sessionEquipments = sessionEquipmentRepository.findActiveRentalsBySessionId(sessionId);
        return sessionEquipmentMapper.toResponseDTOList(sessionEquipments);
    }

    @Override
    @Transactional
    public void deleteSessionEquipment(Long id) {
        SessionEquipment sessionEquipment = sessionEquipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session equipment không tồn tại"));

        // If not returned yet, return available quantity
        if (sessionEquipment.getEndTime() == null) {
            Equipment equipment = sessionEquipment.getEquipment();
            equipment.setAvailableQuantity(equipment.getAvailableQuantity() + sessionEquipment.getQuantity());
            equipmentRepository.save(equipment);
        }

        sessionEquipmentRepository.delete(sessionEquipment);
    }
}
