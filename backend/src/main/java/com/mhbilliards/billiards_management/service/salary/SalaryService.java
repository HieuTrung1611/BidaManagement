package com.mhbilliards.billiards_management.service.salary;

import com.mhbilliards.billiards_management.dto.salary.SalarySummaryResponse;

public interface SalaryService {
    SalarySummaryResponse calculateMonthlySalaries(String salaryMonth, Long branchId);

    SalarySummaryResponse getMonthlySalaries(String salaryMonth, Long branchId);
}