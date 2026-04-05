package com.mhbilliards.billiards_management.enums;

/**
 * Enum for billiard session status
 */
public enum SessionStatus {
    ONGOING("Ongoing"), // Phiên chơi đang diễn ra
    COMPLETED("Completed"), // Phiên chơi hoàn thành
    CANCELLED("Cancelled"); // Phiên chơi bị hủy

    private final String displayName;

    SessionStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
