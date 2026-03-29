package com.mhbilliards.billiards_management.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.mhbilliards.billiards_management.dto.employeePosition.EmployeePositionDetailResponse;
import com.mhbilliards.billiards_management.dto.employeePosition.EmployeePositionRequest;
import com.mhbilliards.billiards_management.dto.employeePosition.EmployeePositionResponse;
import com.mhbilliards.billiards_management.entity.EmployeePosition;

@Mapper(componentModel = "spring")
public interface EmployeePositionMapper {

    EmployeePosition toEntity(EmployeePositionRequest req);

    EmployeePositionResponse toResponse(EmployeePosition employeePosition);

    EmployeePositionDetailResponse toDetailResponse(EmployeePosition employeePosition);

    void updateEntity(EmployeePositionRequest req, @MappingTarget EmployeePosition employeePosition);

    List<EmployeePositionResponse> toResponseList(List<EmployeePosition> employeePositionList);
}
