package com.mhbilliards.billiards_management.enums;

/**
 * Enum for employee salary types
 */
public enum SalaryType {
    FIXED("Fixed"), // Luong co ban
    HOURLY("Hourly"), // Tinh thep gio
    COMMISSION("Commission"); // Tinh hoa hong

    private final String displayName;

    SalaryType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
