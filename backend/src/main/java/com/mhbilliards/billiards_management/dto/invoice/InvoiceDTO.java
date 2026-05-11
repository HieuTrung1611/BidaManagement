package com.mhbilliards.billiards_management.dto.invoice;

import java.time.LocalDateTime;
import java.util.List;

import com.mhbilliards.billiards_management.dto.sessionEquipment.SessionEquipmentResponseDTO;
import com.mhbilliards.billiards_management.dto.sessionProduct.SessionProductResponseDTO;
import com.mhbilliards.billiards_management.enums.SessionStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/**
 * DTO để xuất hóa đơn chi tiết cho khách hàng
 */
@Getter
@Setter
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class InvoiceDTO {
    // Thông tin session
    Long sessionId;
    SessionStatus sessionStatus;
    LocalDateTime startTime;
    LocalDateTime endTime;
    Double durationHours;

    // Thông tin bàn
    String tableName;
    String tableType;
    Double tableHourlyRate;

    // Thông tin khách hàng
    String customerName;
    String customerPhone;
    String customerRank;

    // Thông tin chi nhánh
    String branchName;
    String branchAddress;
    String branchPhone;

    // Chi tiết các khoản phí
    Double tableRentalCost; // Tiền giờ chơi bàn

    List<SessionComboInvoiceDTO> combos; // Các combo đã dùng
    Double combosCost;

    List<SessionProductResponseDTO> products; // Đồ ăn/uống gọi thêm
    Double productsCost;

    List<SessionEquipmentResponseDTO> equipments; // Thiết bị thuê thêm
    Double equipmentsCost;

    // Tổng kết
    Double subtotal; // Tổng trước giảm giá
    Double discountAmount; // Số tiền giảm (nếu có)
    String discountReason; // Lý do giảm giá (rank, promotion...)
    Double totalAmount; // Tổng sau giảm giá

    // Thông tin khác
    String notes;
    LocalDateTime generatedAt; // Thời điểm xuất hóa đơn
    String generatedBy; // Người xuất hóa đơn
}
