package com.mhbilliards.billiards_management.enums;

/**
 * Enum for combo item types
 */
public enum ComboItemType {
    PRODUCT("Product"), // Item là Product (đồ ăn/uống)
    EQUIPMENT("Equipment"); // Item là Equipment (thiết bị cho thuê)

    private final String displayName;

    ComboItemType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
