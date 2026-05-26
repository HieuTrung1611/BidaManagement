package com.mhbilliards.billiards_management.dto.session;

import java.time.LocalDateTime;

import com.mhbilliards.billiards_management.enums.SessionStatus;
import com.mhbilliards.billiards_management.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/**
 * DTO response cho session
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class SessionResponseDTO {
    Long id;

    // Table info
    Long tableId;
    String tableName;
    String tableType;

    // Customer info
    Long customerId;
    String customerName;
    String customerPhone;
    String customerRank; // Display name of customer rank for UI

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

    // Self-service fields
    Boolean isSelfService;
    PaymentStatus paymentStatus;
    String customerPhoneForDebt;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
