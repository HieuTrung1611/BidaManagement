package com.mhbilliards.billiards_management.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mhbilliards.billiards_management.dto.session.SessionResponseDTO;
import com.mhbilliards.billiards_management.dto.session.SessionWithDetailsDTO;
import com.mhbilliards.billiards_management.dto.session.StartSessionDTO;
import com.mhbilliards.billiards_management.enums.SessionStatus;
import com.mhbilliards.billiards_management.service.session.BilliardSessionService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
public class BilliardSessionController {

    private final BilliardSessionService sessionService;

    @PostMapping("/start")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<SessionResponseDTO>> startSession(
            @Valid @RequestBody StartSessionDTO request) {
        SessionResponseDTO response = sessionService.startSession(request);
        return ResponseUtil.created(response, "Bắt đầu phiên chơi thành công");
    }

    @PostMapping("/{id}/end")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<SessionResponseDTO>> endSession(@PathVariable Long id) {
        SessionResponseDTO response = sessionService.endSession(id);
        return ResponseUtil.success(response, "Kết thúc phiên chơi thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<SessionResponseDTO>> getSessionById(@PathVariable Long id) {
        SessionResponseDTO response = sessionService.getSessionById(id);
        return ResponseUtil.success(response, "Lấy thông tin session thành công");
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<Page<SessionResponseDTO>>> searchSessions(
            @RequestParam(required = false) Long tableId,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) SessionStatus status,
            @RequestParam(required = false) Long branchId,
            Pageable pageable) {
        Page<SessionResponseDTO> response = sessionService.searchSessions(tableId, customerId, status, branchId,
                pageable);
        return ResponseUtil.success(response, "Lấy danh sách session thành công");
    }

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<List<SessionResponseDTO>>> getSessionsByBranch(@PathVariable Long branchId) {
        List<SessionResponseDTO> response = sessionService.getSessionsByBranch(branchId);
        return ResponseUtil.success(response, "Lấy danh sách session của chi nhánh thành công");
    }

    @GetMapping("/branch/{branchId}/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<List<SessionResponseDTO>>> getActiveSessions(@PathVariable Long branchId) {
        List<SessionResponseDTO> response = sessionService.getActiveSessions(branchId);
        return ResponseUtil.success(response, "Lấy danh sách session đang hoạt động thành công");
    }

    @GetMapping("/branch/{branchId}/history")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<List<SessionWithDetailsDTO>>> getSessionHistory(
            @PathVariable Long branchId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        List<SessionWithDetailsDTO> response = sessionService.getSessionsWithDetailsByBranch(branchId, targetDate);
        return ResponseUtil.success(response, "Lấy lịch sử phiên chơi thành công");
    }

    @GetMapping("/{id}/details")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<SessionWithDetailsDTO>> getSessionWithDetails(@PathVariable Long id) {
        SessionWithDetailsDTO response = sessionService.getSessionWithDetailsById(id);
        return ResponseUtil.success(response, "Lấy thông tin chi tiết session thành công");
    }
}
