package com.mhbilliards.billiards_management.dto.salary;

import com.mhbilliards.billiards_management.enums.SalaryType;

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
public class SalaryResponse {
    Long id;
    Long employeeId;
    String employeeName;
    String positionName;
    Long branchId;
    String branchName;
    String salaryMonth;
    SalaryType salaryType;
    Double baseSalary;
    Double bonus;
    Double deduction;
    Double totalSalary;
    Integer workingDays;
    Integer workingHours;
    Boolean isPaid;
    String notes;
}