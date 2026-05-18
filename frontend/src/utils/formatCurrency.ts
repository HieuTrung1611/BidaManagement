/**
 * Format number to Vietnamese currency format
 */
export const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) {
        return "0 ₫";
    }
    return `${amount.toLocaleString("vi-VN")} ₫`;
};

/**
 * Parse currency string back to number
 */
export const parseCurrency = (currency: string): number => {
    return Number(currency.replace(/[^\d]/g, ""));
};
