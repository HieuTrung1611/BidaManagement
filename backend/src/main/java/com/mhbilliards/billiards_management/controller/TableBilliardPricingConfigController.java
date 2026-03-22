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

import com.mhbilliards.billiards_management.dto.tableBilliardPricingConfig.TableBilliardPricingConfigRequest;
import com.mhbilliards.billiards_management.dto.tableBilliardPricingConfig.TableBilliardPricingConfigResponse;
import com.mhbilliards.billiards_management.service.tableBilliardPricingConfig.TableBilliardPricingConfigService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/table-billiard-pricing-configs")
@RequiredArgsConstructor
public class TableBilliardPricingConfigController {
    private final TableBilliardPricingConfigService tableBilliardPricingConfigService;

    @PostMapping
    public ResponseEntity<ApiResponse<TableBilliardPricingConfigResponse>> createTableBilliardPricingConfig(
            @RequestBody TableBilliardPricingConfigRequest request) {
        TableBilliardPricingConfigResponse response = tableBilliardPricingConfigService
                .createTableBilliardPricingConfig(request);
        return ResponseUtil.created(response, "TableBilliardPricingConfig created successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TableBilliardPricingConfigResponse>> updateTableBilliardPricingConfig(
            @PathVariable Long id,
            @RequestBody TableBilliardPricingConfigRequest request) {
        TableBilliardPricingConfigResponse response = tableBilliardPricingConfigService
                .updateTableBilliardPricingConfig(id, request);
        return ResponseUtil.success(response, "TableBilliardPricingConfig updated successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TableBilliardPricingConfigResponse>> getTableBilliardPricingConfigById(
            @PathVariable Long id) {
        TableBilliardPricingConfigResponse response = tableBilliardPricingConfigService
                .getTableBilliardPricingConfigById(id);
        return ResponseUtil.success(response, "TableBilliardPricingConfig retrieved successfully");
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TableBilliardPricingConfigResponse>>> getAllTableBilliardPricingConfigs(
            Pageable pageable) {
        Page<TableBilliardPricingConfigResponse> response = tableBilliardPricingConfigService
                .getAllTableBilliardPricingConfigs(pageable);
        return ResponseUtil.success(response, "TableBilliardPricingConfigs retrieved successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTableBilliardPricingConfig(@PathVariable Long id) {
        tableBilliardPricingConfigService.deleteTableBilliardPricingConfig(id);
        return ResponseUtil.success(null, "TableBilliardPricingConfig deleted successfully");
    }
}