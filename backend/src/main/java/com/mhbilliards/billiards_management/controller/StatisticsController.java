package com.mhbilliards.billiards_management.controller;

import com.mhbilliards.billiards_management.dto.statistics.DashboardOverviewDTO;
import com.mhbilliards.billiards_management.dto.statistics.RevenueStatisticsDTO;
import com.mhbilliards.billiards_management.dto.statistics.SalaryStatisticsDTO;
import com.mhbilliards.billiards_management.service.statistics.StatisticsService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * API thống kê doanh thu và lương
 * Chỉ ADMIN, MANAGER, ACCOUNTANT mới được xem thống kê
 */
@RestController
@RequestMapping("/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    /**
     * Tổng quan dashboard: KPI hôm nay, chart 7 ngày, chart 12 tháng
     * GET /statistics/overview?branchId=1
     */
    @GetMapping("/overview")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ACCOUNTANT')")
    public ResponseEntity<ApiResponse<DashboardOverviewDTO>> getDashboardOverview(
            @RequestParam(required = false) Long branchId) {
        DashboardOverviewDTO overview = statisticsService.getDashboardOverview(branchId);
        return ResponseUtil.success(overview, "Lấy tổng quan dashboard thành công");
    }

    /**
     * Thống kê doanh thu theo tháng (breakdown từng ngày)
     * GET /statistics/revenue/monthly?year=2025&month=6&branchId=1
     */
    @GetMapping("/revenue/monthly")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ACCOUNTANT')")
    public ResponseEntity<ApiResponse<RevenueStatisticsDTO>> getMonthlyRevenue(
            @RequestParam(required = false) Long branchId,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().getYear()}") int year,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().getMonthValue()}") int month) {
        int resolvedYear = year == 0 ? LocalDate.now().getYear() : year;
        int resolvedMonth = month == 0 ? LocalDate.now().getMonthValue() : month;
        RevenueStatisticsDTO stats = statisticsService.getMonthlyRevenue(branchId, resolvedYear, resolvedMonth);
        return ResponseUtil.success(stats, "Thống kê doanh thu tháng thành công");
    }

    /**
     * Thống kê doanh thu theo năm (breakdown từng tháng)
     * GET /statistics/revenue/yearly?year=2025&branchId=1
     */
    @GetMapping("/revenue/yearly")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ACCOUNTANT')")
    public ResponseEntity<ApiResponse<RevenueStatisticsDTO>> getYearlyRevenue(
            @RequestParam(required = false) Long branchId,
            @RequestParam(required = false) Integer year) {
        int resolvedYear = year != null ? year : LocalDate.now().getYear();
        RevenueStatisticsDTO stats = statisticsService.getYearlyRevenue(branchId, resolvedYear);
        return ResponseUtil.success(stats, "Thống kê doanh thu năm thành công");
    }

    /**
     * Thống kê doanh thu theo tuần (breakdown từng tuần trong năm)
     * GET /statistics/revenue/weekly?year=2025&branchId=1
     */
    @GetMapping("/revenue/weekly")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ACCOUNTANT')")
    public ResponseEntity<ApiResponse<RevenueStatisticsDTO>> getWeeklyRevenue(
            @RequestParam(required = false) Long branchId,
            @RequestParam(required = false) Integer year) {
        int resolvedYear = year != null ? year : LocalDate.now().getYear();
        RevenueStatisticsDTO stats = statisticsService.getWeeklyRevenue(branchId, resolvedYear);
        return ResponseUtil.success(stats, "Thống kê doanh thu tuần thành công");
    }

    /**
     * Thống kê lương theo năm (breakdown từng tháng)
     * GET /statistics/salary/yearly?year=2025&branchId=1
     */
    @GetMapping("/salary/yearly")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ACCOUNTANT')")
    public ResponseEntity<ApiResponse<SalaryStatisticsDTO>> getYearlySalaryStats(
            @RequestParam(required = false) Long branchId,
            @RequestParam(required = false) Integer year) {
        int resolvedYear = year != null ? year : LocalDate.now().getYear();
        SalaryStatisticsDTO stats = statisticsService.getYearlySalaryStats(branchId, resolvedYear);
        return ResponseUtil.success(stats, "Thống kê lương năm thành công");
    }

    /**
     * Thống kê lương theo tháng cụ thể
     * GET /statistics/salary/monthly?year=2025&month=6&branchId=1
     */
    @GetMapping("/salary/monthly")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'ACCOUNTANT')")
    public ResponseEntity<ApiResponse<SalaryStatisticsDTO>> getMonthlySalaryStats(
            @RequestParam(required = false) Long branchId,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        int resolvedYear = year != null ? year : LocalDate.now().getYear();
        int resolvedMonth = month != null ? month : LocalDate.now().getMonthValue();
        SalaryStatisticsDTO stats = statisticsService.getMonthlySalaryStats(branchId, resolvedYear, resolvedMonth);
        return ResponseUtil.success(stats, "Thống kê lương tháng thành công");
    }
}
