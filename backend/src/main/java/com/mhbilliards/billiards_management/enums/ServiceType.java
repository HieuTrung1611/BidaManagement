package com.mhbilliards.billiards_management.enums;

/**
 * Enum for service types
 */
public enum ServiceType {
    STICK_RENTAL("Stick Rental"), // Thuê gậy
    FOOD("Food"), // Đồ ăn
    BEVERAGE("Beverage"); // Đồ uống

    private final String displayName;

    ServiceType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
