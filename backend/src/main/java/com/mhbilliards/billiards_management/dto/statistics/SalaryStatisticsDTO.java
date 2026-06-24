package com.mhbilliards.billiards_management.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO thống kê lương theo kỳ
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryStatisticsDTO {
    private Integer year;
    private Integer month;    // null nếu thống kê cả năm
    private Long totalEmployees;
    private Double totalSalaryPaid;   // Tổng lương đã trả
    private Double totalSalaryPending; // Tổng lương chưa trả
    private List<ChartDataPointDTO> chartData; // Lương theo từng tháng
}
