package com.mhbilliards.billiards_management.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.mhbilliards.billiards_management.dto.salary.SalaryResponse;
import com.mhbilliards.billiards_management.entity.Salary;

@Mapper(componentModel = "spring")
public interface SalaryMapper {

    @Mapping(source = "employee.id", target = "employeeId")
    @Mapping(source = "employee.name", target = "employeeName")
    @Mapping(source = "employee.position.name", target = "positionName")
    @Mapping(source = "employee.branch.id", target = "branchId")
    @Mapping(source = "employee.branch.name", target = "branchName")
    @Mapping(source = "employee.salaryType", target = "salaryType")
    SalaryResponse toResponse(Salary salary);
}