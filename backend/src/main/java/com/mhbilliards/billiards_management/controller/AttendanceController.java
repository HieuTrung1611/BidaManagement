package com.mhbilliards.billiards_management.controller;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mhbilliards.billiards_management.dto.attendance.AttendanceDailyResponse;
import com.mhbilliards.billiards_management.dto.attendance.AttendanceDailyConfirmRequest;
import com.mhbilliards.billiards_management.dto.attendance.AttendanceDailyUpsertRequest;
import com.mhbilliards.billiards_management.service.attendance.AttendanceService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/attendances")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/daily")
    public ResponseEntity<ApiResponse<AttendanceDailyResponse>> upsertDailyAttendance(
            @Valid @RequestBody AttendanceDailyUpsertRequest request) {
        AttendanceDailyResponse response = attendanceService.upsertDailyAttendance(request);
        return ResponseUtil.success(response, "Cập nhật chấm công thành công");
    }

    @PostMapping("/daily/confirm")
    public ResponseEntity<ApiResponse<AttendanceDailyResponse>> confirmDailyAttendance(
            @Valid @RequestBody AttendanceDailyConfirmRequest request) {
        AttendanceDailyResponse response = attendanceService.confirmDailyAttendance(request);
        return ResponseUtil.success(response, "Chốt công thành công");
    }

    @GetMapping("/daily")
    public ResponseEntity<ApiResponse<AttendanceDailyResponse>> getDailyAttendance(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate attendanceDate,
            @RequestParam(required = false) Long branchId) {
        AttendanceDailyResponse response = attendanceService.getDailyAttendance(attendanceDate, branchId);
        return ResponseUtil.success(response, "Lấy danh sách chấm công thành công");
    }
}