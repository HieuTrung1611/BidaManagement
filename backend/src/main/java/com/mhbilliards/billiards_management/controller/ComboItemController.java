package com.mhbilliards.billiards_management.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mhbilliards.billiards_management.dto.comboItem.ComboItemResponseDTO;
import com.mhbilliards.billiards_management.dto.comboItem.CreateComboItemDTO;
import com.mhbilliards.billiards_management.dto.comboItem.UpdateComboItemDTO;
import com.mhbilliards.billiards_management.service.comboItem.ComboItemService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/combo-items")
@RequiredArgsConstructor
public class ComboItemController {

    private final ComboItemService comboItemService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<ComboItemResponseDTO>> addItemToCombo(
            @Valid @RequestBody CreateComboItemDTO request) {
        ComboItemResponseDTO response = comboItemService.addItemToCombo(request);
        return ResponseUtil.created(response, "Thêm item vào combo thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<ComboItemResponseDTO>> getComboItemById(@PathVariable Long id) {
        ComboItemResponseDTO response = comboItemService.getComboItemById(id);
        return ResponseUtil.success(response, "Lấy combo item thành công");
    }

    @GetMapping("/combo/{comboId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<List<ComboItemResponseDTO>>> getComboItemsByComboId(@PathVariable Long comboId) {
        List<ComboItemResponseDTO> response = comboItemService.getComboItemsByComboId(comboId);
        return ResponseUtil.success(response, "Lấy danh sách items trong combo thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<ComboItemResponseDTO>> updateComboItem(@PathVariable Long id,
            @Valid @RequestBody UpdateComboItemDTO request) {
        ComboItemResponseDTO response = comboItemService.updateComboItem(id, request);
        return ResponseUtil.success(response, "Cập nhật combo item thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> deleteComboItem(@PathVariable Long id) {
        comboItemService.deleteComboItem(id);
        return ResponseUtil.success(null, "Xóa combo item thành công");
    }

    @DeleteMapping("/combo/{comboId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> deleteAllItemsByComboId(@PathVariable Long comboId) {
        comboItemService.deleteAllItemsByComboId(comboId);
        return ResponseUtil.success(null, "Xóa tất cả items trong combo thành công");
    }
}
