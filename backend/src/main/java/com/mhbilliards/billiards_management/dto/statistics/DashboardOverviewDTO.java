package com.mhbilliards.billiards_management.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO tổng quan dashboard
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardOverviewDTO {
    private Double revenueToday;        // Doanh thu hôm nay
    private Double revenueThisMonth;    // Doanh thu tháng này
    private Long sessionsToday;         // Số phiên hôm nay
    private Long activeTablesNow;       // Số bàn đang chơi hiện tại
    private Long totalCustomersToday;   // Số khách hôm nay
    private Long totalEmployees;        // Tổng nhân viên đang làm việc

    // Chart cho 7 ngày gần nhất
    private List<ChartDataPointDTO> last7DaysRevenue;
    // Chart cho 12 tháng trong năm
    private List<ChartDataPointDTO> monthlyRevenue;
}
