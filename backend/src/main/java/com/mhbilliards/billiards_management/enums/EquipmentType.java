package com.mhbilliards.billiards_management.enums;

/**
 * Enum for equipment types (rental items)
 */
public enum EquipmentType {
    STICK("Stick"), // Gậy
    CHALK("Chalk"), // Phấn
    GLOVES("Gloves"), // Găng tay
    BRIDGE("Bridge"), // Cầu
    OTHER("Other"); // Khác

    private final String displayName;

    EquipmentType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
