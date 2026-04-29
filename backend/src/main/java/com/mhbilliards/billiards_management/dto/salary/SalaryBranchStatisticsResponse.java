package com.mhbilliards.billiards_management.dto.salary;

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
public class SalaryBranchStatisticsResponse {
    Long branchId;
    String branchName;
    Integer employeeCount;
    Integer paidEmployeeCount;
    Double totalSalary;
    Boolean allPaid;
}
