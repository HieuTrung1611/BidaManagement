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

import com.mhbilliards.billiards_management.dto.combo.ComboResponseDTO;
import com.mhbilliards.billiards_management.dto.combo.CreateComboDTO;
import com.mhbilliards.billiards_management.dto.combo.UpdateComboDTO;
import com.mhbilliards.billiards_management.service.combo.ComboService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/combos")
@RequiredArgsConstructor
public class ComboController {

    private final ComboService comboService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<ComboResponseDTO>> createCombo(@Valid @RequestBody CreateComboDTO request) {
        ComboResponseDTO response = comboService.createCombo(request);
        return ResponseUtil.created(response, "Tạo combo thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<ComboResponseDTO>> getComboById(@PathVariable Long id) {
        ComboResponseDTO response = comboService.getComboById(id);
        return ResponseUtil.success(response, "Lấy combo thành công");
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<Page<ComboResponseDTO>>> searchCombos(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long branchId,
            @RequestParam(required = false) Boolean isActive,
            Pageable pageable) {

        Page<ComboResponseDTO> response = comboService.searchCombos(keyword, branchId, isActive, pageable);
        return ResponseUtil.success(response, "Tìm kiếm combo thành công");
    }

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<List<ComboResponseDTO>>> getCombosByBranch(@PathVariable Long branchId) {
        List<ComboResponseDTO> response = comboService.getCombosByBranch(branchId);
        return ResponseUtil.success(response, "Lấy danh sách combo theo chi nhánh thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<ComboResponseDTO>> updateCombo(@PathVariable Long id,
            @Valid @RequestBody UpdateComboDTO request) {
        ComboResponseDTO response = comboService.updateCombo(id, request);
        return ResponseUtil.success(response, "Cập nhật combo thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCombo(@PathVariable Long id) {
        comboService.deleteCombo(id);
        return ResponseUtil.success(null, "Xóa combo thành công");
    }
}
