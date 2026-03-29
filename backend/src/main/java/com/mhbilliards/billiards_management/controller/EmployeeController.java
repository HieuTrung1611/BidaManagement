package com.mhbilliards.billiards_management.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mhbilliards.billiards_management.dto.employee.EmployeeRequest;
import com.mhbilliards.billiards_management.dto.employee.EmployeeResponse;
import com.mhbilliards.billiards_management.service.employee.EmployeeService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeResponse>> createEmployee(@Valid @RequestBody EmployeeRequest request) {
        EmployeeResponse res = employeeService.createEmployee(request);
        return ResponseUtil.created(res, "Create employee successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateEmployee(@Valid @RequestBody EmployeeRequest request,
            @PathVariable Long id) {
        EmployeeResponse res = employeeService.updateEmployee(id, request);
        return ResponseUtil.success(res, "Update employee successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getEmployeeById(@PathVariable Long id) {
        EmployeeResponse res = employeeService.getEmployeeById(id);
        return ResponseUtil.success(res, "Get employee successfully");
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<EmployeeResponse>>> getAllEmployees(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long branchId,
            Pageable pageable) {
        Page<EmployeeResponse> res = employeeService.getAllEmployees(keyword, branchId, pageable);
        return ResponseUtil.success(res, "Get all employees successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseUtil.success(null, "Delete employee successfully");
    }

}
