package com.mhbilliards.billiards_management.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.mhbilliards.billiards_management.dto.branch.BranchCreationRequest;
import com.mhbilliards.billiards_management.dto.branch.BranchDetailResponse;
import com.mhbilliards.billiards_management.dto.branch.BranchResponse;
import com.mhbilliards.billiards_management.dto.branch.BranchUpdationRequest;
import com.mhbilliards.billiards_management.entity.Branch;

@Mapper(componentModel = "spring", uses = { EmployeeMapper.class, BranchImageMapper.class,
        EmployeePositionMapper.class })
public interface BranchMapper {

    @Mapping(target = "employees", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "branchImages", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Branch toEntity(BranchCreationRequest req);

    @Mapping(target = "employeesCount", ignore = true)
    @Mapping(target = "managerName", ignore = true)
    @Mapping(target = "managerPhoneNumber", ignore = true)
    BranchResponse toResponse(Branch branch);

    @Mapping(target = "employeesCount", ignore = true)
    @Mapping(target = "managerName", ignore = true)
    @Mapping(target = "managerPhoneNumber", ignore = true)
    BranchDetailResponse toDetailResponse(Branch branch);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "employees", ignore = true)
    @Mapping(target = "branchImages", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    void updateEntity(BranchUpdationRequest req, @MappingTarget Branch branch);

    List<BranchResponse> toResponseList(List<Branch> branchList);

}
