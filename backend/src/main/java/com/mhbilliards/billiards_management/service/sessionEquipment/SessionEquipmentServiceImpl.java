package com.mhbilliards.billiards_management.service.sessionEquipment;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

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

        SessionEquipment sessionEquipment = SessionEquipment.builder()
                .session(session)
                .equipment(equipment)
                .quantity(request.getQuantity())
                .startTime(LocalDateTime.now())
                .hourlyRate(equipment.getRentalPricePerHour())
                .build();

        SessionEquipment savedSessionEquipment = sessionEquipmentRepository.save(sessionEquipment);
        return sessionEquipmentMapper.toResponseDTO(savedSessionEquipment);
    }

    @Override
    @Transactional
    public SessionEquipmentResponseDTO returnEquipment(Long id) {
        SessionEquipment sessionEquipment = sessionEquipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session equipment không tồn tại"));

        if (sessionEquipment.getEndTime() != null) {
            throw new RuntimeException("Thiết bị này đã được trả rồi");
        }

        // Set end time and calculate total amount
        LocalDateTime endTime = LocalDateTime.now();
        sessionEquipment.setEndTime(endTime);

        long minutes = ChronoUnit.MINUTES.between(sessionEquipment.getStartTime(), endTime);
        double hours = minutes / 60.0;
        Double totalAmount = sessionEquipment.getHourlyRate() * hours * sessionEquipment.getQuantity();

        sessionEquipment.setTotalAmount(totalAmount);

        // Return available quantity
        Equipment equipment = sessionEquipment.getEquipment();
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
