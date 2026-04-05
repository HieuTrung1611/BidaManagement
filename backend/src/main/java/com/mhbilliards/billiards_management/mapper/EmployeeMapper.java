package com.mhbilliards.billiards_management.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.mhbilliards.billiards_management.dto.employee.EmployeeRequest;
import com.mhbilliards.billiards_management.dto.employee.EmployeeResponse;
import com.mhbilliards.billiards_management.entity.Employee;

@Mapper(componentModel = "spring", uses = { EmployeePositionMapper.class })
public interface EmployeeMapper {
    @Mapping(source = "positionId", target = "position.id")
    @Mapping(source = "branchId", target = "branch.id")
    Employee toEntity(EmployeeRequest req);

    @Mapping(target = "branch.managerName", ignore = true)
    @Mapping(target = "branch.managerPhoneNumber", ignore = true)
    @Mapping(target = "branch.employeesCount", ignore = true)
    EmployeeResponse toResponse(Employee employee);

    List<EmployeeResponse> toResponseList(List<Employee> employeeList);

    @Mapping(target = "id", ignore = true)
    @Mapping(source = "positionId", target = "position.id")
    @Mapping(source = "branchId", target = "branch.id")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateEntity(EmployeeRequest req, @MappingTarget Employee employee);
}
