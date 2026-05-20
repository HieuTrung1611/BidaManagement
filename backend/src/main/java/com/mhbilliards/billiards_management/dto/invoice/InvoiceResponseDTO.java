package com.mhbilliards.billiards_management.dto.invoice;

import java.time.LocalDateTime;

import com.mhbilliards.billiards_management.enums.InvoiceStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/**
 * DTO for saved invoice response
 * Used when returning invoice from database (not preview)
 */
@Getter
@Setter
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class InvoiceResponseDTO {
    // Invoice info
    Long id;
    String invoiceNumber;
    LocalDateTime invoiceDate;
    InvoiceStatus status;
    String notes;

    // Session info
    Long sessionId;

    // Customer info (nullable for walk-in customers)
    Long customerId;
    String customerName;
    String customerPhone;

    // Branch info
    Long branchId;
    String branchName;
    String branchAddress;
    String branchPhone;

    // Financial details
    Double subtotal;
    Double discountPercent;
    Double discountAmount;
    Double totalAmount;

    // Timestamps
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
