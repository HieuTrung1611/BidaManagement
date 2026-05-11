package com.mhbilliards.billiards_management.dto.branch;

import java.util.List;

import com.mhbilliards.billiards_management.dto.branchImage.BranchImageDTO;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BranchResponse {
    Long id;
    String name;
    String address;
    String description;
    String managerName;
    String managerPhoneNumber;
    String phone;
    int employeesCount;
    List<BranchImageDTO> branchImages;

}
