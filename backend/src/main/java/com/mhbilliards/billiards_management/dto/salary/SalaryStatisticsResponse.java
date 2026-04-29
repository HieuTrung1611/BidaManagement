package com.mhbilliards.billiards_management.dto.salary;

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
public class SalaryStatisticsResponse {
    String salaryMonth;
    Long branchId;
    String keyword;
    Integer totalBranches;
    Integer totalEmployees;
    Integer totalPaidEmployees;
    Double totalSalary;
    Boolean allPaid;
    List<SalaryBranchStatisticsResponse> branchStatistics;
}
