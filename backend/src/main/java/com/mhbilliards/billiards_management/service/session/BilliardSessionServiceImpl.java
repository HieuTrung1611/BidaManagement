package com.mhbilliards.billiards_management.service.session;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mhbilliards.billiards_management.dto.session.SessionResponseDTO;
import com.mhbilliards.billiards_management.dto.session.SessionWithDetailsDTO;
import com.mhbilliards.billiards_management.dto.session.StartSessionDTO;
import com.mhbilliards.billiards_management.entity.BilliardSession;
import com.mhbilliards.billiards_management.entity.Customer;
import com.mhbilliards.billiards_management.entity.SessionEquipment;
import com.mhbilliards.billiards_management.entity.TableBilliard;
import com.mhbilliards.billiards_management.enums.SessionStatus;
import com.mhbilliards.billiards_management.enums.TableStatus;
import com.mhbilliards.billiards_management.mapper.BilliardSessionMapper;
import com.mhbilliards.billiards_management.mapper.SessionComboMapper;
import com.mhbilliards.billiards_management.mapper.SessionEquipmentMapper;
import com.mhbilliards.billiards_management.mapper.SessionProductMapper;
import com.mhbilliards.billiards_management.repository.BilliardSessionRepository;
import com.mhbilliards.billiards_management.repository.CustomerRepository;
import com.mhbilliards.billiards_management.repository.SessionComboRepository;
import com.mhbilliards.billiards_management.repository.SessionEquipmentRepository;
import com.mhbilliards.billiards_management.repository.SessionProductRepository;
import com.mhbilliards.billiards_management.repository.TableBilliardRepository;
import com.mhbilliards.billiards_management.event.SessionEndedEvent;
import com.mhbilliards.billiards_management.specification.BilliardSessionSpecification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BilliardSessionServiceImpl implements BilliardSessionService {

        private final BilliardSessionRepository sessionRepository;
        private final TableBilliardRepository tableRepository;
        private final CustomerRepository customerRepository;
        private final BilliardSessionMapper sessionMapper;
        private final ApplicationEventPublisher eventPublisher;
        private final SessionComboRepository sessionComboRepository;
        private final SessionProductRepository sessionProductRepository;
        private final SessionEquipmentRepository sessionEquipmentRepository;
        private final SessionProductMapper sessionProductMapper;
        private final SessionComboMapper sessionComboMapper;
        private final SessionEquipmentMapper sessionEquipmentMapper;

        @Override
        @Transactional
        public SessionResponseDTO startSession(StartSessionDTO request) {
                // Validate table exists and is AVAILABLE
                TableBilliard table = tableRepository.findById(request.getTableId())
                                .orElseThrow(() -> new RuntimeException("Bàn không tồn tại"));

                if (table.getStatus() != TableStatus.AVAILABLE) {
                        throw new IllegalStateException("Bàn đang không khả dụng. Trạng thái hiện tại: "
                                        + table.getStatus().getDisplayName());
                }

                // Validate customer exists if provided (optional for walk-in customers)
                Customer customer = null;
                if (request.getCustomerId() != null) {
                        customer = customerRepository.findById(request.getCustomerId())
                                        .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));
                }

                // Create new session
                BilliardSession session = BilliardSession.builder()
                                .table(table)
                                .customer(customer)
                                .branch(table.getBranch())
                                .startTime(LocalDateTime.now())
                                .durationHours(0.0)
                                .totalAmount(0.0)
                                .status(SessionStatus.ONGOING)
                                .notes(request.getNotes())
                                .build();

                BilliardSession savedSession = sessionRepository.save(session);

                // Update table status to IN_USE
                table.setStatus(TableStatus.IN_USE);
                tableRepository.save(table);

                return sessionMapper.toResponseDTOWithType(savedSession);
        }

        @Override
        @Transactional
        public SessionResponseDTO endSession(Long sessionId) {
                BilliardSession session = sessionRepository.findById(sessionId)
                                .orElseThrow(() -> new RuntimeException("Session không tồn tại"));

                if (session.getStatus() != SessionStatus.ONGOING) {
                        throw new IllegalStateException("Session đã kết thúc hoặc bị hủy");
                }

                // Set end time
                LocalDateTime endTime = LocalDateTime.now();
                session.setEndTime(endTime);

                // Auto-return any equipment that was not manually returned before session ends
                List<SessionEquipment> activeEquipments = sessionEquipmentRepository
                                .findActiveRentalsBySessionId(sessionId);
                for (SessionEquipment se : activeEquipments) {
                        se.setEndTime(endTime);
                        long minutes = ChronoUnit.MINUTES.between(se.getStartTime(), endTime);
                        double hours = minutes / 60.0;
                        se.setTotalAmount(se.getHourlyRate() * hours * se.getQuantity());
                        // Restore available quantity (entity is managed, dirty-checked by JPA)
                        se.getEquipment().setAvailableQuantity(
                                        se.getEquipment().getAvailableQuantity() + se.getQuantity());
                }
                if (!activeEquipments.isEmpty()) {
                        sessionEquipmentRepository.saveAll(activeEquipments);
                }

                // Calculate duration with 15-minute rounding
                BigDecimal durationHours = calculateRoundedDuration(session.getStartTime(), endTime);
                session.setDurationHours(durationHours.doubleValue());

                // Calculate total amount (equipment costs are now populated)
                BigDecimal totalAmount = calculateTotalAmount(session, durationHours);
                session.setTotalAmount(totalAmount.doubleValue());

                // Update status to COMPLETED
                session.setStatus(SessionStatus.COMPLETED);

                // Update table status back to AVAILABLE
                TableBilliard table = session.getTable();
                table.setStatus(TableStatus.AVAILABLE);
                tableRepository.save(table);

                // Save session
                BilliardSession updatedSession = sessionRepository.save(session);

                // Publish event — invoice will be created AFTER this transaction commits
                // (TransactionalEventListener AFTER_COMMIT) to avoid rollback-only
                // contamination
                eventPublisher.publishEvent(new SessionEndedEvent(sessionId));

                return sessionMapper.toResponseDTOWithType(updatedSession);
        }

        /**
         * Calculate rounded duration using 15-minute blocks
         */
        private BigDecimal calculateRoundedDuration(LocalDateTime startTime, LocalDateTime endTime) {
                if (startTime == null || endTime == null) {
                        return BigDecimal.ZERO;
                }

                long totalMinutes = ChronoUnit.MINUTES.between(startTime, endTime);
                long fullHours = totalMinutes / 60;
                long remainingMinutes = totalMinutes % 60;

                // Round up remaining minutes to 15-minute blocks
                long roundedMinutes = 0;
                if (remainingMinutes > 0) {
                        roundedMinutes = ((remainingMinutes - 1) / 15 + 1) * 15;
                }

                BigDecimal totalHours = BigDecimal.valueOf(fullHours)
                                .add(BigDecimal.valueOf(roundedMinutes).divide(BigDecimal.valueOf(60), 2,
                                                RoundingMode.HALF_UP));

                return totalHours;
        }

        /**
         * Calculate total amount including table rental and items
         */
        private BigDecimal calculateTotalAmount(BilliardSession session, BigDecimal durationHours) {
                // Table rental cost
                BigDecimal tableHourlyRate = BigDecimal.valueOf(session.getTable().getType().getPricePerHour());
                BigDecimal tableRentalCost = tableHourlyRate.multiply(durationHours);

                // Items costs
                BigDecimal combosCost = sessionComboRepository.findBySessionId(session.getId()).stream()
                                .map(sc -> BigDecimal.valueOf(sc.getTotalAmount()))
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal productsCost = sessionProductRepository.findBySessionId(session.getId()).stream()
                                .map(sp -> BigDecimal.valueOf(sp.getTotalAmount()))
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal equipmentsCost = sessionEquipmentRepository.findBySessionId(session.getId()).stream()
                                .map(se -> se.getTotalAmount() != null ? BigDecimal.valueOf(se.getTotalAmount())
                                                : BigDecimal.ZERO)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // Subtotal
                BigDecimal subtotal = tableRentalCost.add(combosCost).add(productsCost).add(equipmentsCost);

                // Apply customer discount if exists
                if (session.getCustomer() != null && session.getCustomer().getRank() != null) {
                        BigDecimal discountPercent = BigDecimal
                                        .valueOf(session.getCustomer().getRank().getDiscountPercent());
                        BigDecimal discountAmount = subtotal.multiply(discountPercent)
                                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                        return subtotal.subtract(discountAmount);
                }

                return subtotal;
        }

        @Override
        @Transactional(readOnly = true)
        public SessionResponseDTO getSessionById(Long id) {
                BilliardSession session = sessionRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Session không tồn tại"));
                return sessionMapper.toResponseDTOWithType(session);
        }

        @Override
        @Transactional(readOnly = true)
        public Page<SessionResponseDTO> searchSessions(Long tableId, Long customerId, SessionStatus status,
                        Long branchId, Pageable pageable) {
                Specification<BilliardSession> spec = Specification
                                .where(BilliardSessionSpecification.hasTableId(tableId))
                                .and(BilliardSessionSpecification.hasCustomerId(customerId))
                                .and(BilliardSessionSpecification.hasStatus(status))
                                .and(BilliardSessionSpecification.hasBranchId(branchId));

                Page<BilliardSession> sessions = sessionRepository.findAll(spec, pageable);
                return sessions.map(sessionMapper::toResponseDTOWithType);
        }

        @Override
        @Transactional(readOnly = true)
        public List<SessionResponseDTO> getSessionsByBranch(Long branchId) {
                List<BilliardSession> sessions = sessionRepository.findByBranchId(branchId);
                return sessions.stream().map(sessionMapper::toResponseDTOWithType).toList();
        }

        @Override
        @Transactional(readOnly = true)
        public List<SessionResponseDTO> getActiveSessions(Long branchId) {
                List<BilliardSession> sessions = sessionRepository.findByBranchId(branchId).stream()
                                .filter(s -> s.getStatus() == SessionStatus.ONGOING)
                                .toList();
                return sessions.stream().map(sessionMapper::toResponseDTOWithType).toList();
        }

        @Override
        @Transactional(readOnly = true)
        public List<SessionWithDetailsDTO> getSessionsWithDetailsByBranch(Long branchId, LocalDate date) {
                LocalDateTime startOfDay = date.atStartOfDay();
                LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();

                List<BilliardSession> sessions = sessionRepository.findByBranchIdAndDateRange(
                                branchId, startOfDay, endOfDay);

                return sessions.stream().map(this::toSessionWithDetails).toList();
        }

        private SessionWithDetailsDTO toSessionWithDetails(BilliardSession session) {
                SessionResponseDTO dto = sessionMapper.toResponseDTOWithType(session);
                Long sessionId = session.getId();

                return SessionWithDetailsDTO.builder()
                                .id(dto.getId())
                                .tableId(dto.getTableId())
                                .tableName(dto.getTableName())
                                .tableType(dto.getTableType())
                                .customerId(dto.getCustomerId())
                                .customerName(dto.getCustomerName())
                                .customerPhone(dto.getCustomerPhone())
                                .branchId(dto.getBranchId())
                                .branchName(dto.getBranchName())
                                .startTime(dto.getStartTime())
                                .endTime(dto.getEndTime())
                                .durationHours(dto.getDurationHours())
                                .status(dto.getStatus())
                                .totalAmount(dto.getTotalAmount())
                                .notes(dto.getNotes())
                                .createdAt(dto.getCreatedAt())
                                .updatedAt(dto.getUpdatedAt())
                                .products(sessionProductMapper.toResponseDTOList(
                                                sessionProductRepository.findBySessionId(sessionId)))
                                .combos(sessionComboMapper.toResponseDTOList(
                                                sessionComboRepository.findBySessionId(sessionId)))
                                .equipments(sessionEquipmentMapper.toResponseDTOList(
                                                sessionEquipmentRepository.findBySessionId(sessionId)))
                                .build();
        }
}
