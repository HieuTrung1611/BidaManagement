package com.mhbilliards.billiards_management.enums;

/**
 * Enum for customer rank levels
 * Different ranks have different discount percentages
 */
public enum CustomerRank {
    BRONZE("Bronze", 0.0),      // 0% discount
    SILVER("Silver", 5.0),      // 5% discount
    GOLD("Gold", 10.0),         // 10% discount
    PLATINUM("Platinum", 15.0); // 15% discount

    private final String displayName;
    private final Double discountPercent;

    CustomerRank(String displayName, Double discountPercent) {
        this.displayName = displayName;
        this.discountPercent = discountPercent;
    }

    public String getDisplayName() {
        return displayName;
    }

    public Double getDiscountPercent() {
        return discountPercent;
    }
}
