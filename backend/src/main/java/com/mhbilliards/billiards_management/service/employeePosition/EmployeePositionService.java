package com.mhbilliards.billiards_management.service.employeePosition;

import java.util.List;

import com.mhbilliards.billiards_management.dto.employeePosition.EmployeePositionDetailResponse;
import com.mhbilliards.billiards_management.dto.employeePosition.EmployeePositionRequest;
import com.mhbilliards.billiards_management.dto.employeePosition.EmployeePositionResponse;

public interface EmployeePositionService {
    EmployeePositionResponse createEmployeePosition(EmployeePositionRequest request);

    EmployeePositionResponse updateEmployeePosition(Long id, EmployeePositionRequest request);

    void deleteEmployeePosition(Long id);

    EmployeePositionDetailResponse getEmployeePositionById(Long id);

    List<EmployeePositionResponse> getAllEmployeePositionsByKeyword(String keyword);
}
