package com.mhbilliards.billiards_management.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.mhbilliards.billiards_management.dto.employeePosition.EmployeePositionDetailResponse;
import com.mhbilliards.billiards_management.dto.employeePosition.EmployeePositionRequest;
import com.mhbilliards.billiards_management.dto.employeePosition.EmployeePositionResponse;
import com.mhbilliards.billiards_management.entity.EmployeePosition;

@Mapper(componentModel = "spring")
public interface EmployeePositionMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    EmployeePosition toEntity(EmployeePositionRequest req);

    EmployeePositionResponse toResponse(EmployeePosition employeePosition);

    EmployeePositionDetailResponse toDetailResponse(EmployeePosition employeePosition);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateEntity(EmployeePositionRequest req, @MappingTarget EmployeePosition employeePosition);

    List<EmployeePositionResponse> toResponseList(List<EmployeePosition> employeePositionList);
}
