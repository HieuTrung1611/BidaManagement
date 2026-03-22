package com.mhbilliards.billiards_management.controller;

import java.util.List;

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

import com.mhbilliards.billiards_management.dto.employeePosition.EmployeePositionDetailResponse;
import com.mhbilliards.billiards_management.dto.employeePosition.EmployeePositionRequest;
import com.mhbilliards.billiards_management.dto.employeePosition.EmployeePositionResponse;
import com.mhbilliards.billiards_management.service.employeePosition.EmployeePositionService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/employee-positions")
@RequiredArgsConstructor
public class EmployeePositionController {
    private final EmployeePositionService employeePositionService;

    @PostMapping
    public ResponseEntity<ApiResponse<EmployeePositionResponse>> createEmployeePosition(
            @Valid @RequestBody EmployeePositionRequest position) {
        EmployeePositionResponse createdPosition = employeePositionService.createEmployeePosition(position);
        return ResponseUtil.created(createdPosition, "Tạo mới vị trí thành công");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeePositionResponse>> updateEmployeePosition(
            @PathVariable Long id,
            @Valid @RequestBody EmployeePositionRequest position) {
        EmployeePositionResponse updatedPosition = employeePositionService.updateEmployeePosition(id, position);
        return ResponseUtil.success(updatedPosition, "Cập nhật vị trí thành công");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeePositionDetailResponse>> getEmployeePositionById(@PathVariable Long id) {
        EmployeePositionDetailResponse position = employeePositionService.getEmployeePositionById(id);
        return ResponseUtil.success(position, "Lấy thông tin vị trí thành công");
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeePositionResponse>>> getAllEmployeePositionsByKeyword(
            @RequestParam(required = false) String keyword) {
        List<EmployeePositionResponse> positions = employeePositionService.getAllEmployeePositionsByKeyword(keyword);
        return ResponseUtil.success(positions, "Lấy danh sách vị trí thành công");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployeePosition(@PathVariable Long id) {
        employeePositionService.deleteEmployeePosition(id);
        return ResponseUtil.success(null, "Xóa vị trí thành công");
    }
}
