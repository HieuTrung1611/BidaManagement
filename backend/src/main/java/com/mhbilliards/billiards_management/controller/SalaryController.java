package com.mhbilliards.billiards_management.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mhbilliards.billiards_management.dto.salary.SalarySummaryResponse;
import com.mhbilliards.billiards_management.dto.salary.SalaryStatisticsResponse;
import com.mhbilliards.billiards_management.service.salary.SalaryService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/salaries")
@RequiredArgsConstructor
public class SalaryController {

    private final SalaryService salaryService;

    @PostMapping("/calculate")
    public ResponseEntity<ApiResponse<SalarySummaryResponse>> calculateMonthlySalaries(
            @RequestParam(required = false) String salaryMonth,
            @RequestParam(required = false) Long branchId) {
        SalarySummaryResponse response = salaryService.calculateMonthlySalaries(salaryMonth, branchId);
        return ResponseUtil.success(response, "Tính lương thành công");
    }

    @GetMapping
    public ResponseEntity<ApiResponse<SalarySummaryResponse>> getMonthlySalaries(
            @RequestParam(required = false) String salaryMonth,
            @RequestParam(required = false) Long branchId) {
        SalarySummaryResponse response = salaryService.getMonthlySalaries(salaryMonth, branchId);
        return ResponseUtil.success(response, "Lấy bảng lương thành công");
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<SalaryStatisticsResponse>> getSalaryStatistics(
            @RequestParam(required = false) String salaryMonth,
            @RequestParam(required = false) Long branchId,
            @RequestParam(required = false) String keyword) {
        SalaryStatisticsResponse response = salaryService.getSalaryStatistics(salaryMonth, branchId, keyword);
        return ResponseUtil.success(response, "Lấy thống kê bảng lương thành công");
    }
}