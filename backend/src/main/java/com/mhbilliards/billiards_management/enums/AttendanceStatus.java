package com.mhbilliards.billiards_management.enums;

/**
 * Enum for employee attendance status
 */
public enum AttendanceStatus {
    PRESENT("Present"), // Có mặt
    ABSENT("Absent"), // Vắng
    LATE("Late"), // Đi trễ
    EARLY_LEAVE("Early Leave"); // Về sớm

    private final String displayName;

    AttendanceStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
