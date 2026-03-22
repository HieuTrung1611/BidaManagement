package com.mhbilliards.billiards_management.dto.employee;

import java.time.LocalDate;

import com.mhbilliards.billiards_management.dto.base.BaseResponse;
import com.mhbilliards.billiards_management.dto.employeePosition.EmployeePositionResponse;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeDetailResponse extends BaseResponse {
    String name;
    String email;
    String phoneNumber;
    LocalDate dob;
    String address;
    EmployeePositionResponse position;
}
