package com.mhbilliards.billiards_management.enums;

/**
 * Enum for product types (food and beverage items)
 */
public enum ProductType {
    FOOD("Food"), // Đồ ăn
    BEVERAGE("Beverage"); // Đồ uống

    private final String displayName;

    ProductType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
