package com.mhbilliards.billiards_management.dto.employeePosition;

import com.mhbilliards.billiards_management.dto.base.BaseResponse;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeePositionDetailResponse extends BaseResponse {
    String code;
    String name;
    Double hourlyRate;
}
