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

import com.mhbilliards.billiards_management.dto.tableBilliardZone.TableBilliardZoneRequest;
import com.mhbilliards.billiards_management.dto.tableBilliardZone.TableBilliardZoneResponse;
import com.mhbilliards.billiards_management.service.tableBilliardZone.TableBilliardZoneService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/table-billiard-zones")
@RequiredArgsConstructor
public class TableBilliardZoneController {
    private final TableBilliardZoneService tableBilliardZoneService;

    @PostMapping
    public ResponseEntity<ApiResponse<TableBilliardZoneResponse>> createTableBilliardZone(
            @RequestBody TableBilliardZoneRequest request) {
        TableBilliardZoneResponse res = tableBilliardZoneService.createTableBilliardZone(request);
        return ResponseUtil.created(res, "Create table billiard zone successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TableBilliardZoneResponse>> updateTableBilliardZone(
            @RequestBody TableBilliardZoneRequest request,
            @PathVariable Long id) {
        TableBilliardZoneResponse res = tableBilliardZoneService.updateTableBilliardZone(id, request);
        return ResponseUtil.success(res, "Update table billiard zone successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TableBilliardZoneResponse>> getTableBilliardZoneById(@PathVariable Long id) {
        TableBilliardZoneResponse res = tableBilliardZoneService.getTableBilliardZoneById(id);
        return ResponseUtil.success(res, "Get table billiard zone successfully");
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TableBilliardZoneResponse>>> getAllTableBilliardZones(Pageable pageable) {
        Page<TableBilliardZoneResponse> res = tableBilliardZoneService.getAllTableBilliardZones(pageable);
        return ResponseUtil.success(res, "Get all table billiard zones successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTableBilliardZone(@PathVariable Long id) {
        tableBilliardZoneService.deleteTableBilliardZone(id);
        return ResponseUtil.success(null, "Delete table billiard zone successfully");
    }

}
