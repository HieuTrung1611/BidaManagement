package com.mhbilliards.billiards_management.enums;

/**
 * Enum for invoice status
 */
public enum InvoiceStatus {
    PENDING("Pending"), // Chờ thanh toán
    COMPLETED("Completed"), // Đã thanh toán
    CANCELLED("Cancelled"), // Bị hủy
    REFUNDED("Refunded"); // Hoàn tiền

    private final String displayName;

    InvoiceStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
