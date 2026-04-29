package com.mhbilliards.billiards_management.service.salary;

import com.mhbilliards.billiards_management.dto.salary.SalarySummaryResponse;
import com.mhbilliards.billiards_management.dto.salary.SalaryStatisticsResponse;

public interface SalaryService {
    SalarySummaryResponse calculateMonthlySalaries(String salaryMonth, Long branchId);

    SalarySummaryResponse getMonthlySalaries(String salaryMonth, Long branchId);

    SalaryStatisticsResponse getSalaryStatistics(String salaryMonth, Long branchId, String keyword);
}