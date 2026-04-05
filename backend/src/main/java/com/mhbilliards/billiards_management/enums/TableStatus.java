package com.mhbilliards.billiards_management.enums;

/**
 * Enum for billiard table status
 */
public enum TableStatus {
    AVAILABLE("Available"), // Bàn trống, có thể sử dụng
    IN_USE("In Use"), // Đang có khách sử dụng
    MAINTENANCE("Maintenance"), // Đang bảo trì
    RESERVED("Reserved"); // Đã đặt trước

    private final String displayName;

    TableStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
