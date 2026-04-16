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

import com.mhbilliards.billiards_management.dto.shift.ShiftRequest;
import com.mhbilliards.billiards_management.dto.shift.ShiftResponse;
import com.mhbilliards.billiards_management.service.shift.ShiftService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/shifts")
@RequiredArgsConstructor
public class ShiftController {

    private final ShiftService shiftService;

    @PostMapping
    public ResponseEntity<ApiResponse<ShiftResponse>> createShift(@Valid @RequestBody ShiftRequest request) {
        ShiftResponse response = shiftService.createShift(request);
        return ResponseUtil.created(response, "Tạo ca làm việc thành công");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ShiftResponse>> updateShift(
            @PathVariable Long id,
            @Valid @RequestBody ShiftRequest request) {
        ShiftResponse response = shiftService.updateShift(id, request);
        return ResponseUtil.success(response, "Cập nhật ca làm việc thành công");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ShiftResponse>> getShiftById(@PathVariable Long id) {
        ShiftResponse response = shiftService.getShiftById(id);
        return ResponseUtil.success(response, "Lấy thông tin ca làm việc thành công");
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ShiftResponse>>> getAllShifts(Pageable pageable) {
        Page<ShiftResponse> response = shiftService.getAllShifts(pageable);
        return ResponseUtil.success(response, "Lấy danh sách ca làm việc thành công");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteShift(@PathVariable Long id) {
        shiftService.deleteShift(id);
        return ResponseUtil.success(null, "Xóa ca làm việc thành công");
    }
}
