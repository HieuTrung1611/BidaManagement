package com.mhbilliards.billiards_management.dto.session;

import java.time.LocalDateTime;
import java.util.List;

import com.mhbilliards.billiards_management.dto.sessionCombo.SessionComboResponseDTO;
import com.mhbilliards.billiards_management.dto.sessionEquipment.SessionEquipmentResponseDTO;
import com.mhbilliards.billiards_management.dto.sessionProduct.SessionProductResponseDTO;
import com.mhbilliards.billiards_management.enums.SessionStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class SessionWithDetailsDTO {

    Long id;

    // Table info
    Long tableId;
    String tableName;
    String tableType;

    // Customer info
    Long customerId;
    String customerName;
    String customerPhone;

    // Branch info
    Long branchId;
    String branchName;

    // Session details
    LocalDateTime startTime;
    LocalDateTime endTime;
    Double durationHours;
    SessionStatus status;
    Double totalAmount;
    String notes;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    // Item details (what was used in the session)
    List<SessionProductResponseDTO> products;
    List<SessionComboResponseDTO> combos;
    List<SessionEquipmentResponseDTO> equipments;
}
