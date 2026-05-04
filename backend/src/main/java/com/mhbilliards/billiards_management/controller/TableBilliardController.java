package com.mhbilliards.billiards_management.controller;

import java.util.List;

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

import com.mhbilliards.billiards_management.dto.tableBilliard.TableBilliardRequest;
import com.mhbilliards.billiards_management.dto.tableBilliard.TableBilliardResponse;
import com.mhbilliards.billiards_management.service.tableBilliards.TableBilliardService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/table-billiard")
@RequiredArgsConstructor
public class TableBilliardController {
    private final TableBilliardService tableBilliardService;

    @PostMapping
    public ResponseEntity<ApiResponse<TableBilliardResponse>> createTableBilliard(
            @RequestBody TableBilliardRequest request) {
        TableBilliardResponse res = tableBilliardService.createTableBilliard(request);
        return ResponseUtil.created(res, "Create table billiard successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TableBilliardResponse>> updateTableBilliard(
            @RequestBody TableBilliardRequest request,
            @PathVariable Long id) {
        TableBilliardResponse res = tableBilliardService.updateTableBilliard(id, request);
        return ResponseUtil.success(res, "Update table billiard successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TableBilliardResponse>> getTableBilliardById(@PathVariable Long id) {
        TableBilliardResponse res = tableBilliardService.getTableBilliardById(id);
        return ResponseUtil.success(res, "Get table billiard successfully");
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TableBilliardResponse>>> getAllTableBilliards(
            @RequestParam(required = false) Long branchId,
            Pageable pageable) {
        Page<TableBilliardResponse> res = tableBilliardService.getAllTableBilliards(branchId, pageable);
        return ResponseUtil.success(res, "Get all table billiards successfully");
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<TableBilliardResponse>>> getAllTableBilliardsNoPaging(
            @RequestParam(required = false) Long branchId) {
        List<TableBilliardResponse> res = tableBilliardService.getAllTableBilliardsNoPaging(branchId);
        return ResponseUtil.success(res, "Get all table billiards successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTableBilliard(@PathVariable Long id) {
        tableBilliardService.deleteTableBilliard(id);
        return ResponseUtil.success(null, "Delete table billiard successfully");
    }
}
