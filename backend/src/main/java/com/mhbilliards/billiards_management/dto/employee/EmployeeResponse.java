package com.mhbilliards.billiards_management.dto.employee;

import java.time.LocalDate;

import com.mhbilliards.billiards_management.dto.branch.BranchResponse;
import com.mhbilliards.billiards_management.dto.employeePosition.EmployeePositionResponse;
import com.mhbilliards.billiards_management.dto.shift.ShiftResponse;
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
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeResponse {
    Long id;
    String name;
    String email;
    String phoneNumber;
    LocalDate dob;
    String address;
    String identityNumber;
    String bankAccount;
    String bankName;
    LocalDate hireDate;
    SalaryType salaryType;
    Double baseSalary;
    String emergencyContactName;
    String emergencyContactPhone;
    Boolean isActive;
    EmployeePositionResponse position;
    BranchResponse branch;
    ShiftResponse shift;
}
