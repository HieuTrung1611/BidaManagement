package com.mhbilliards.billiards_management.service.invoice;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.mhbilliards.billiards_management.dto.invoice.InvoiceDTO;
import com.mhbilliards.billiards_management.dto.invoice.InvoiceResponseDTO;
import com.mhbilliards.billiards_management.dto.invoice.SessionComboInvoiceDTO;
import com.mhbilliards.billiards_management.dto.sessionEquipment.SessionEquipmentResponseDTO;
import com.mhbilliards.billiards_management.dto.sessionProduct.SessionProductResponseDTO;
import com.mhbilliards.billiards_management.entity.BilliardSession;
import com.mhbilliards.billiards_management.entity.Invoice;
import com.mhbilliards.billiards_management.entity.SessionCombo;
import com.mhbilliards.billiards_management.entity.SessionEquipment;
import com.mhbilliards.billiards_management.entity.SessionProduct;
import com.mhbilliards.billiards_management.enums.InvoiceStatus;
import com.mhbilliards.billiards_management.event.SessionEndedEvent;
import com.mhbilliards.billiards_management.mapper.InvoiceMapper;
import com.mhbilliards.billiards_management.mapper.SessionEquipmentMapper;
import com.mhbilliards.billiards_management.mapper.SessionProductMapper;
import com.mhbilliards.billiards_management.repository.BilliardSessionRepository;
import com.mhbilliards.billiards_management.repository.InvoiceRepository;
import com.mhbilliards.billiards_management.repository.SessionComboRepository;
import com.mhbilliards.billiards_management.repository.SessionEquipmentRepository;
import com.mhbilliards.billiards_management.repository.SessionProductRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

        private final BilliardSessionRepository billiardSessionRepository;
        private final InvoiceRepository invoiceRepository;
        private final SessionComboRepository sessionComboRepository;
        private final SessionProductRepository sessionProductRepository;
        private final SessionEquipmentRepository sessionEquipmentRepository;
        private final SessionProductMapper sessionProductMapper;
        private final SessionEquipmentMapper sessionEquipmentMapper;
        private final InvoiceMapper invoiceMapper;

        /**
         * Triggered AFTER the session transaction commits.
         * Runs in its own transaction (REQUIRES_NEW) — completely isolated from the
         * session TX, so a failure here never rolls back the session.
         */
        @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
        @Transactional(propagation = Propagation.REQUIRES_NEW)
        public void onSessionEnded(SessionEndedEvent event) {
                try {
                        createInvoiceFromSession(event.getSessionId());
                } catch (Exception e) {
                        log.error("Failed to create invoice for session {}: {}", event.getSessionId(), e.getMessage(),
                                        e);
                }
        }

        @Override
        @Transactional(readOnly = true)
        public InvoiceDTO generateInvoice(Long sessionId) {
                BilliardSession session = billiardSessionRepository.findById(sessionId)
                                .orElseThrow(() -> new RuntimeException("Session không tồn tại"));

                // For ONGOING sessions, use current time as effective end time (preview mode)
                LocalDateTime effectiveEndTime = session.getEndTime() != null
                                ? session.getEndTime()
                                : LocalDateTime.now();

                // Calculate duration with 15-minute rounding
                BigDecimal durationHours = calculateRoundedDuration(session.getStartTime(), effectiveEndTime);

                // Calculate table rental cost
                BigDecimal tableHourlyRate = BigDecimal.valueOf(session.getTable().getType().getPricePerHour());
                BigDecimal tableRentalCost = tableHourlyRate.multiply(durationHours);

                // Get combos
                List<SessionCombo> sessionCombos = sessionComboRepository.findBySessionId(sessionId);
                List<SessionComboInvoiceDTO> comboDTOs = sessionCombos.stream()
                                .map(this::mapToComboInvoiceDTO)
                                .collect(Collectors.toList());
                BigDecimal combosCost = sessionCombos.stream()
                                .map(sc -> BigDecimal.valueOf(sc.getTotalAmount()))
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // Get products
                List<SessionProduct> sessionProducts = sessionProductRepository.findBySessionId(sessionId);
                List<SessionProductResponseDTO> productDTOs = sessionProductMapper.toResponseDTOList(sessionProducts);
                BigDecimal productsCost = sessionProducts.stream()
                                .map(sp -> BigDecimal.valueOf(sp.getTotalAmount()))
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // Get equipments — calculate cost for unreturned items using effectiveEndTime
                List<SessionEquipment> sessionEquipments = sessionEquipmentRepository.findBySessionId(sessionId);
                List<SessionEquipmentResponseDTO> equipmentDTOs = sessionEquipments.stream()
                                .map(se -> {
                                        SessionEquipmentResponseDTO dto = sessionEquipmentMapper.toResponseDTO(se);
                                        if (!dto.getIsReturned()) {
                                                // Override with preview calculation
                                                long minutes = ChronoUnit.MINUTES.between(se.getStartTime(),
                                                                effectiveEndTime);
                                                double hours = minutes / 60.0;
                                                dto.setDurationHours(
                                                                BigDecimal.valueOf(hours)
                                                                                .setScale(2, RoundingMode.HALF_UP)
                                                                                .doubleValue());
                                                dto.setTotalAmount(se.getHourlyRate() * hours * se.getQuantity());
                                        }
                                        return dto;
                                })
                                .collect(Collectors.toList());
                BigDecimal equipmentsCost = equipmentDTOs.stream()
                                .map(dto -> dto.getTotalAmount() != null
                                                ? BigDecimal.valueOf(dto.getTotalAmount())
                                                : BigDecimal.ZERO)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // Calculate subtotal
                BigDecimal subtotal = tableRentalCost.add(combosCost).add(productsCost).add(equipmentsCost);

                // Calculate discount based on customer rank (if customer exists)
                BigDecimal discountPercent = BigDecimal.ZERO;
                String discountReason = null;
                String customerName = null;
                String customerPhone = null;
                String customerRank = null;

                if (session.getCustomer() != null) {
                        customerName = session.getCustomer().getName();
                        customerPhone = session.getCustomer().getPhoneNumber();

                        if (session.getCustomer().getRank() != null) {
                                customerRank = session.getCustomer().getRank().getDisplayName();
                                discountPercent = BigDecimal
                                                .valueOf(session.getCustomer().getRank().getDiscountPercent());
                                discountReason = "Giảm giá theo hạng khách hàng: " + customerRank;
                        }
                }

                BigDecimal discountAmount = subtotal.multiply(discountPercent).divide(BigDecimal.valueOf(100), 2,
                                RoundingMode.HALF_UP);

                // Calculate total
                BigDecimal totalAmount = subtotal.subtract(discountAmount);

                return InvoiceDTO.builder()
                                .sessionId(session.getId())
                                .sessionStatus(session.getStatus())
                                .startTime(session.getStartTime())
                                .endTime(effectiveEndTime)
                                .durationHours(durationHours.doubleValue())
                                .tableName(session.getTable().getName())
                                .tableType(session.getTable().getType().getName())
                                .tableHourlyRate(tableHourlyRate.doubleValue())
                                .customerName(customerName)
                                .customerPhone(customerPhone)
                                .customerRank(customerRank)
                                .branchName(session.getBranch().getName())
                                .branchAddress(session.getBranch().getAddress())
                                .branchPhone(session.getBranch().getPhone())
                                .tableRentalCost(tableRentalCost.doubleValue())
                                .combos(comboDTOs)
                                .combosCost(combosCost.doubleValue())
                                .products(productDTOs)
                                .productsCost(productsCost.doubleValue())
                                .equipments(equipmentDTOs)
                                .equipmentsCost(equipmentsCost.doubleValue())
                                .subtotal(subtotal.doubleValue())
                                .discountAmount(discountAmount.doubleValue())
                                .discountReason(discountReason)
                                .totalAmount(totalAmount.doubleValue())
                                .notes(session.getNotes())
                                .generatedAt(LocalDateTime.now())
                                .generatedBy("System") // TODO: Get from logged in user
                                .build();
        }

        @Override
        @Transactional
        public Invoice createInvoiceFromSession(Long sessionId) {
                BilliardSession session = billiardSessionRepository.findById(sessionId)
                                .orElseThrow(() -> new RuntimeException("Session không tồn tại"));

                // Check if invoice already exists, return existing instead of throwing
                Optional<Invoice> existing = invoiceRepository.findBySessionId(sessionId);
                if (existing.isPresent()) {
                        return existing.get();
                }

                // Calculate amounts using the same logic as generateInvoice
                BigDecimal durationHours = calculateRoundedDuration(session.getStartTime(), session.getEndTime());
                BigDecimal tableHourlyRate = BigDecimal.valueOf(session.getTable().getType().getPricePerHour());
                BigDecimal tableRentalCost = tableHourlyRate.multiply(durationHours);

                // Get items costs
                BigDecimal combosCost = sessionComboRepository.findBySessionId(sessionId).stream()
                                .map(sc -> BigDecimal.valueOf(sc.getTotalAmount()))
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal productsCost = sessionProductRepository.findBySessionId(sessionId).stream()
                                .map(sp -> BigDecimal.valueOf(sp.getTotalAmount()))
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal equipmentsCost = sessionEquipmentRepository.findBySessionId(sessionId).stream()
                                .map(se -> se.getTotalAmount() != null ? BigDecimal.valueOf(se.getTotalAmount())
                                                : BigDecimal.ZERO)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // Calculate subtotal
                BigDecimal subtotal = tableRentalCost.add(combosCost).add(productsCost).add(equipmentsCost);

                // Calculate discount based on customer rank (if customer exists)
                BigDecimal discountPercent = BigDecimal.ZERO;
                if (session.getCustomer() != null && session.getCustomer().getRank() != null) {
                        discountPercent = BigDecimal.valueOf(session.getCustomer().getRank().getDiscountPercent());
                }
                BigDecimal discountAmount = subtotal.multiply(discountPercent).divide(BigDecimal.valueOf(100), 2,
                                RoundingMode.HALF_UP);

                // Calculate total
                BigDecimal totalAmount = subtotal.subtract(discountAmount);

                // Generate invoice number (format: INV-YYYYMMDD-XXXXXX)
                String invoiceNumber = generateInvoiceNumber();

                // Create and save invoice
                Invoice invoice = Invoice.builder()
                                .invoiceNumber(invoiceNumber)
                                .session(session)
                                .customer(session.getCustomer())
                                .branch(session.getBranch())
                                .invoiceDate(LocalDateTime.now())
                                .subtotal(subtotal.doubleValue())
                                .discountPercent(discountPercent.doubleValue())
                                .discountAmount(discountAmount.doubleValue())
                                .totalAmount(totalAmount.doubleValue())
                                .status(InvoiceStatus.COMPLETED)
                                .notes(session.getNotes())
                                .build();

                return invoiceRepository.save(invoice);
        }

        @Override
        @Transactional(readOnly = true)
        public InvoiceResponseDTO getInvoiceById(Long id) {
                Invoice invoice = invoiceRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Invoice không tồn tại"));
                return invoiceMapper.toResponseDTO(invoice);
        }

        @Override
        @Transactional(readOnly = true)
        public InvoiceResponseDTO getInvoiceBySessionId(Long sessionId) {
                Invoice invoice = invoiceRepository.findBySessionId(sessionId)
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn cho session này"));
                return invoiceMapper.toResponseDTO(invoice);
        }

        @Override
        @Transactional(readOnly = true)
        public Page<Invoice> getInvoicesByBranch(Long branchId, LocalDateTime startDate,
                        LocalDateTime endDate, InvoiceStatus status, Pageable pageable) {
                if (status != null) {
                        return invoiceRepository.findByBranchIdAndStatus(branchId, status, pageable);
                }

                // If no status filter, get all invoices in date range
                List<Invoice> invoices = invoiceRepository.findByBranchAndDateRange(branchId, startDate, endDate);
                // Convert to page manually (simplified - in production, use Specification)
                return Page.empty(pageable);
        }

        @Override
        @Transactional(readOnly = true)
        public Double getTotalRevenue(Long branchId, LocalDateTime startDate, LocalDateTime endDate) {
                Double revenue = invoiceRepository.getTotalRevenueByBranchAndDateRange(
                                branchId, InvoiceStatus.COMPLETED, startDate, endDate);
                return revenue != null ? revenue : 0.0;
        }

        @Override
        @Transactional(readOnly = true)
        public Long countInvoices(Long branchId, LocalDateTime startDate, LocalDateTime endDate) {
                return invoiceRepository.countInvoicesByBranchAndDateRange(branchId, startDate, endDate);
        }

        /**
         * Generate unique invoice number
         * Format: INV-YYYYMMDD-XXXXXX (X = sequence number)
         */
        private String generateInvoiceNumber() {
                String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
                long count = invoiceRepository.count() + 1;
                return String.format("INV-%s-%06d", dateStr, count);
        }

        private SessionComboInvoiceDTO mapToComboInvoiceDTO(SessionCombo sessionCombo) {
                return SessionComboInvoiceDTO.builder()
                                .comboId(sessionCombo.getCombo().getId())
                                .comboName(sessionCombo.getCombo().getName())
                                .quantity(sessionCombo.getQuantity())
                                .price(sessionCombo.getPrice())
                                .totalAmount(sessionCombo.getTotalAmount())
                                .build();
        }

        /**
         * Tính thời gian chơi làm tròn theo mốc 15 phút
         * Logic: 1-15p → 15p, 16-30p → 30p, 31-45p → 45p, 46-60p → 60p
         * 
         * Ví dụ:
         * - 1h10p = 70 phút → 1 giờ + 15 phút → 1.25 giờ
         * - 1h37p = 97 phút → 1 giờ + 45 phút → 1.75 giờ
         * - 2h05p = 125 phút → 2 giờ + 15 phút → 2.25 giờ
         */
        private BigDecimal calculateRoundedDuration(LocalDateTime startTime, LocalDateTime endTime) {
                if (startTime == null || endTime == null) {
                        return BigDecimal.ZERO;
                }

                // Tính tổng số phút
                long totalMinutes = ChronoUnit.MINUTES.between(startTime, endTime);

                // Chia ra: số giờ đầy đủ và số phút lẻ
                long fullHours = totalMinutes / 60;
                long remainingMinutes = totalMinutes % 60;

                // Làm tròn phút lẻ lên mốc 15 phút
                long roundedMinutes = 0;
                if (remainingMinutes > 0) {
                        // Làm tròn lên: 1-15→15, 16-30→30, 31-45→45, 46-60→60
                        roundedMinutes = ((remainingMinutes - 1) / 15 + 1) * 15;
                }

                // Tính tổng giờ (giờ đầy đủ + phút lẻ đã làm tròn)
                BigDecimal totalHours = BigDecimal.valueOf(fullHours)
                                .add(BigDecimal.valueOf(roundedMinutes).divide(BigDecimal.valueOf(60), 2,
                                                RoundingMode.HALF_UP));

                return totalHours;
        }
}
