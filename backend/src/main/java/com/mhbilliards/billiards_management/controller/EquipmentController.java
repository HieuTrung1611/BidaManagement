package com.mhbilliards.billiards_management.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mhbilliards.billiards_management.dto.equipment.CreateEquipmentDTO;
import com.mhbilliards.billiards_management.dto.equipment.EquipmentResponseDTO;
import com.mhbilliards.billiards_management.dto.equipment.UpdateEquipmentDTO;
import com.mhbilliards.billiards_management.enums.EquipmentType;
import com.mhbilliards.billiards_management.service.equipment.EquipmentService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/equipments")
@RequiredArgsConstructor
public class EquipmentController {

    private final EquipmentService equipmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<EquipmentResponseDTO>> createEquipment(
            @Valid @RequestBody CreateEquipmentDTO request) {
        EquipmentResponseDTO response = equipmentService.createEquipment(request);
        return ResponseUtil.created(response, "Tạo thiết bị thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<EquipmentResponseDTO>> getEquipmentById(@PathVariable Long id) {
        EquipmentResponseDTO response = equipmentService.getEquipmentById(id);
        return ResponseUtil.success(response, "Lấy thiết bị thành công");
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<Page<EquipmentResponseDTO>>> searchEquipments(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) EquipmentType type,
            @RequestParam(required = false) Long branchId,
            Pageable pageable) {

        Page<EquipmentResponseDTO> response = equipmentService.searchEquipments(keyword, type, branchId, pageable);
        return ResponseUtil.success(response, "Tìm kiếm thiết bị thành công");
    }

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<List<EquipmentResponseDTO>>> getEquipmentsByBranch(@PathVariable Long branchId) {
        List<EquipmentResponseDTO> response = equipmentService.getEquipmentsByBranch(branchId);
        return ResponseUtil.success(response, "Lấy danh sách thiết bị theo chi nhánh thành công");
    }

    @GetMapping("/branch/{branchId}/available")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<List<EquipmentResponseDTO>>> getAvailableEquipments(@PathVariable Long branchId) {
        List<EquipmentResponseDTO> response = equipmentService.getAvailableEquipments(branchId);
        return ResponseUtil.success(response, "Lấy danh sách thiết bị còn trống thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<EquipmentResponseDTO>> updateEquipment(@PathVariable Long id,
            @Valid @RequestBody UpdateEquipmentDTO request) {
        EquipmentResponseDTO response = equipmentService.updateEquipment(id, request);
        return ResponseUtil.success(response, "Cập nhật thiết bị thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
        return ResponseUtil.success(null, "Xóa thiết bị thành công");
    }
}
