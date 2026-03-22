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
import org.springframework.web.bind.annotation.RestController;

import com.mhbilliards.billiards_management.dto.tableBilliardType.TableBilliardTypeRequest;
import com.mhbilliards.billiards_management.dto.tableBilliardType.TableBilliardTypeResponse;
import com.mhbilliards.billiards_management.service.tableBilliardType.TableBilliardTypeService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/table-billiard-types")
@RequiredArgsConstructor
public class TableBilliardTypeController {
    private final TableBilliardTypeService tableBilliardTypeService;

    @PostMapping
    public ResponseEntity<ApiResponse<TableBilliardTypeResponse>> createTableBilliardType(
            @RequestBody TableBilliardTypeRequest request) {
        TableBilliardTypeResponse res = tableBilliardTypeService.createTableBilliardType(request);
        return ResponseUtil.created(res, "Create table billiard type successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TableBilliardTypeResponse>> updateTableBilliardType(
            @RequestBody TableBilliardTypeRequest request,
            @PathVariable Long id) {
        TableBilliardTypeResponse res = tableBilliardTypeService.updateTableBilliardType(id, request);
        return ResponseUtil.success(res, "Update table billiard type successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TableBilliardTypeResponse>> getTableBilliardTypeById(@PathVariable Long id) {
        TableBilliardTypeResponse res = tableBilliardTypeService.getTableBilliardTypeById(id);
        return ResponseUtil.success(res, "Get table billiard type successfully");
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TableBilliardTypeResponse>>> getAllTableBilliardTypes(Pageable pageable) {
        Page<TableBilliardTypeResponse> res = tableBilliardTypeService.getAllTableBilliardTypes(pageable);
        return ResponseUtil.success(res, "Get all table billiard types successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTableBilliardType(@PathVariable Long id) {
        tableBilliardTypeService.deleteTableBilliardType(id);
        return ResponseUtil.success(null, "Delete table billiard type successfully");
    }

}