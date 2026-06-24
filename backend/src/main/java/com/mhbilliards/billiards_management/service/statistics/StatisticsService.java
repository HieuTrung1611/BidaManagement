package com.mhbilliards.billiards_management.service.statistics;

import com.mhbilliards.billiards_management.dto.statistics.DashboardOverviewDTO;
import com.mhbilliards.billiards_management.dto.statistics.RevenueStatisticsDTO;
import com.mhbilliards.billiards_management.dto.statistics.SalaryStatisticsDTO;

public interface StatisticsService {

    /**
     * Tổng quan dashboard: doanh thu hôm nay, phiên hôm nay, bàn đang chạy, chart 7 ngày + 12 tháng
     */
    DashboardOverviewDTO getDashboardOverview(Long branchId);

    /**
     * Thống kê doanh thu theo tháng (breakdown từng ngày trong tháng)
     */
    RevenueStatisticsDTO getMonthlyRevenue(Long branchId, int year, int month);

    /**
     * Thống kê doanh thu theo cả năm (breakdown từng tháng)
     */
    RevenueStatisticsDTO getYearlyRevenue(Long branchId, int year);

    /**
     * Thống kê doanh thu theo tuần trong năm (breakdown từng tuần)
     */
    RevenueStatisticsDTO getWeeklyRevenue(Long branchId, int year);

    /**
     * Thống kê lương theo năm (breakdown từng tháng)
     */
    SalaryStatisticsDTO getYearlySalaryStats(Long branchId, int year);

    /**
     * Thống kê lương theo tháng cụ thể
     */
    SalaryStatisticsDTO getMonthlySalaryStats(Long branchId, int year, int month);
}
