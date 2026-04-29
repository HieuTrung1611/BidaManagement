export const getCurrentMonth = (): string => {
    const now = new Date();
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    return `${now.getFullYear()}-${month}`;
};

export const formatCurrency = (value?: number): string => {
    return (value ?? 0).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });
};

export const salaryTypeLabel = (salaryType?: string): string => {
    if (salaryType === "FIXED") return "Lương cố định";
    if (salaryType === "HOURLY") return "Lương theo giờ";
    if (salaryType === "COMMISSION") return "Lương hoa hồng";
    return salaryType || "-";
};
