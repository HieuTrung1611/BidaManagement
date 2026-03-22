package com.mhbilliards.billiards_management.service.employee;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.mhbilliards.billiards_management.dto.employee.EmployeeDetailResponse;
import com.mhbilliards.billiards_management.dto.employee.EmployeeRequest;
import com.mhbilliards.billiards_management.dto.employee.EmployeeResponse;

public interface EmployeeService {
    EmployeeResponse createEmployee(EmployeeRequest request);

    EmployeeResponse updateEmployee(Long id, EmployeeRequest request);

    void deleteEmployee(Long id);

    EmployeeDetailResponse getEmployeeById(Long id);

    Page<EmployeeResponse> getAllEmployees(String keyword, Pageable pageable);
}
