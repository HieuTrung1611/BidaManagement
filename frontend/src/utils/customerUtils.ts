import { CustomerRank } from "@/types/customer";

export const getCustomerRankDisplay = (rank: CustomerRank) => {
    const rankMap: Record<
        CustomerRank,
        { displayName: string; discountPercent: number }
    > = {
        BRONZE: { displayName: "Đồng", discountPercent: 0 },
        SILVER: { displayName: "Bạc", discountPercent: 5 },
        GOLD: { displayName: "Vàng", discountPercent: 10 },
        PLATINUM: { displayName: "Bạch Kim", discountPercent: 15 },
    };

    return rankMap[rank] || rankMap.BRONZE;
};

export const getCustomerRankColor = (
    rank: CustomerRank,
): "error" | "warning" | "info" | "light" => {
    const colorMap: Record<
        CustomerRank,
        "error" | "warning" | "info" | "light"
    > = {
        PLATINUM: "error",
        GOLD: "warning",
        SILVER: "info",
        BRONZE: "light",
    };

    return colorMap[rank] || "light";
};
