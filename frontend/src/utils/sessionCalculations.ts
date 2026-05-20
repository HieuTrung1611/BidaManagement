/**
 * Round number to 2 decimal places using HALF_UP rounding mode
 * Matches Java's BigDecimal.setScale(2, RoundingMode.HALF_UP)
 */
export const roundHalfUp = (value: number, decimals: number = 2): number => {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier + Number.EPSILON) / multiplier;
};

/**
 * Calculate rounded duration using 15-minute blocks
 * Matches backend logic in BilliardSessionServiceImpl.calculateRoundedDuration
 */
export const calculateRoundedDuration = (
    startTime: Date,
    endTime: Date,
): number => {
    const totalMinutes = Math.floor(
        (endTime.getTime() - startTime.getTime()) / (1000 * 60),
    );

    if (totalMinutes <= 0) return 0;

    const fullHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    // Round up remaining minutes to 15-minute blocks
    // Backend: ((remainingMinutes - 1) / 15 + 1) * 15
    let roundedMinutes = 0;
    if (remainingMinutes > 0) {
        roundedMinutes = (Math.floor((remainingMinutes - 1) / 15) + 1) * 15;
    }

    // Convert to hours with 2 decimal places using HALF_UP rounding
    const totalHours = fullHours + roundedMinutes / 60;
    return roundHalfUp(totalHours, 2);
};

/**
 * Calculate equipment cost with rounded duration
 * Matches backend calculation with proper rounding
 */
export const calculateEquipmentCost = (
    quantity: number,
    hourlyRate: number,
    startTime: Date,
    endTime: Date,
): number => {
    const roundedDuration = calculateRoundedDuration(startTime, endTime);
    // Calculate: quantity * hourlyRate * duration
    const cost = quantity * hourlyRate * roundedDuration;
    // Round to 2 decimal places like backend
    return roundHalfUp(cost, 2);
};

/**
 * Calculate total with proper BigDecimal-like rounding
 */
export const calculateTotal = (values: number[]): number => {
    const sum = values.reduce((acc, val) => acc + val, 0);
    return roundHalfUp(sum, 2);
};

/**
 * Calculate discount amount with proper rounding
 * Matches backend: subtotal * discountPercent / 100 with HALF_UP rounding
 */
export const calculateDiscount = (
    subtotal: number,
    discountPercent: number,
): number => {
    const discount = (subtotal * discountPercent) / 100;
    return roundHalfUp(discount, 2);
};

/**
 * Format duration to display string (e.g., "2.5h" or "1.25h")
 */
export const formatDuration = (hours: number): string => {
    return `${hours.toFixed(2)}h`;
};
