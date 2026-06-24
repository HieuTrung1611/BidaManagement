package com.mhbilliards.billiards_management.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * DTO trả về dữ liệu thống kê doanh thu
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueStatisticsDTO {
    private Double totalRevenue;         // Tổng doanh thu
    private Long totalSessions;          // Tổng số phiên
    private Long totalInvoices;          // Tổng số hóa đơn
    private Double averagePerSession;    // Doanh thu trung bình / phiên
    private String period;               // "week" | "month" | "year"
    private String periodLabel;          // "Tháng 6/2025", "Tuần 23/2025"
    private List<ChartDataPointDTO> chartData; // Dữ liệu biểu đồ
}
