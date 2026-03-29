package com.mhbilliards.billiards_management.dto.branch;

import java.util.List;

import com.mhbilliards.billiards_management.dto.base.BaseResponse;
import com.mhbilliards.billiards_management.dto.branchImage.BranchImageDTO;
import com.mhbilliards.billiards_management.dto.employee.EmployeeResponse;

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
public class BranchDetailResponse extends BaseResponse {
    String name;
    String address;
    String description;
    String managerName;
    String managerPhoneNumber;
    int employeesCount;
    List<EmployeeResponse> employees;
    List<BranchImageDTO> branchImages;

}
