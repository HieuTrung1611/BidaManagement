package com.mhbilliards.billiards_management.service.invoice;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mhbilliards.billiards_management.dto.invoice.InvoiceDTO;
import com.mhbilliards.billiards_management.dto.invoice.SessionComboInvoiceDTO;
import com.mhbilliards.billiards_management.dto.sessionEquipment.SessionEquipmentResponseDTO;
import com.mhbilliards.billiards_management.dto.sessionProduct.SessionProductResponseDTO;
import com.mhbilliards.billiards_management.entity.BilliardSession;
import com.mhbilliards.billiards_management.entity.SessionCombo;
import com.mhbilliards.billiards_management.entity.SessionEquipment;
import com.mhbilliards.billiards_management.entity.SessionProduct;
import com.mhbilliards.billiards_management.mapper.SessionEquipmentMapper;
import com.mhbilliards.billiards_management.mapper.SessionProductMapper;
import com.mhbilliards.billiards_management.repository.BilliardSessionRepository;
import com.mhbilliards.billiards_management.repository.SessionComboRepository;
import com.mhbilliards.billiards_management.repository.SessionEquipmentRepository;
import com.mhbilliards.billiards_management.repository.SessionProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final BilliardSessionRepository billiardSessionRepository;
    private final SessionComboRepository sessionComboRepository;
    private final SessionProductRepository sessionProductRepository;
    private final SessionEquipmentRepository sessionEquipmentRepository;
    private final SessionProductMapper sessionProductMapper;
    private final SessionEquipmentMapper sessionEquipmentMapper;

    @Override
    @Transactional(readOnly = true)
    public InvoiceDTO generateInvoice(Long sessionId) {
        BilliardSession session = billiardSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session không tồn tại"));

        // Calculate duration hours
        BigDecimal durationHours = BigDecimal.ZERO;
        if (session.getStartTime() != null && session.getEndTime() != null) {
            long minutes = ChronoUnit.MINUTES.between(session.getStartTime(), session.getEndTime());
            durationHours = BigDecimal.valueOf(minutes).divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
        }

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

        // Get equipments
        List<SessionEquipment> sessionEquipments = sessionEquipmentRepository.findBySessionId(sessionId);
        List<SessionEquipmentResponseDTO> equipmentDTOs = sessionEquipmentMapper.toResponseDTOList(sessionEquipments);
        BigDecimal equipmentsCost = sessionEquipments.stream()
                .map(se -> se.getTotalAmount() != null ? BigDecimal.valueOf(se.getTotalAmount()) : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate subtotal
        BigDecimal subtotal = tableRentalCost.add(combosCost).add(productsCost).add(equipmentsCost);

        // Calculate discount based on customer rank
        BigDecimal discountPercent = BigDecimal.valueOf(session.getCustomer().getRank().getDiscountPercent());
        BigDecimal discountAmount = subtotal.multiply(discountPercent).divide(BigDecimal.valueOf(100), 2,
                RoundingMode.HALF_UP);
        String discountReason = "Giảm giá theo hạng khách hàng: " + session.getCustomer().getRank().getDisplayName();

        // Calculate total
        BigDecimal totalAmount = subtotal.subtract(discountAmount);

        return InvoiceDTO.builder()
                .sessionId(session.getId())
                .sessionStatus(session.getStatus())
                .startTime(session.getStartTime())
                .endTime(session.getEndTime())
                .durationHours(durationHours.doubleValue())
                .tableName(session.getTable().getName())
                .tableType(session.getTable().getType().getName())
                .tableHourlyRate(tableHourlyRate.doubleValue())
                .customerName(session.getCustomer().getName())
                .customerPhone(session.getCustomer().getPhoneNumber())
                .customerRank(session.getCustomer().getRank().getDisplayName())
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

    private SessionComboInvoiceDTO mapToComboInvoiceDTO(SessionCombo sessionCombo) {
        return SessionComboInvoiceDTO.builder()
                .comboId(sessionCombo.getCombo().getId())
                .comboName(sessionCombo.getCombo().getName())
                .quantity(sessionCombo.getQuantity())
                .price(sessionCombo.getPrice())
                .totalAmount(sessionCombo.getTotalAmount())
                .build();
    }
}
