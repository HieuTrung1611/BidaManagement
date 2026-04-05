package com.mhbilliards.billiards_management.dto.salary;

import java.time.LocalDate;
import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SalarySummaryResponse {
    String salaryMonth;
    LocalDate fromDate;
    LocalDate toDate;
    Long branchId;
    String branchName;
    Integer employeeCount;
    Integer totalWorkingDays;
    Integer totalWorkingHours;
    Double totalSalary;
    List<SalaryBranchSummaryResponse> branchSummaries;
    List<SalaryResponse> salaries;
}