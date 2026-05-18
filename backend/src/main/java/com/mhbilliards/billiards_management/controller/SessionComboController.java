package com.mhbilliards.billiards_management.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mhbilliards.billiards_management.dto.session.AddComboToSessionDTO;
import com.mhbilliards.billiards_management.dto.sessionCombo.SessionComboResponseDTO;
import com.mhbilliards.billiards_management.service.sessionCombo.SessionComboService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/session-combos")
@RequiredArgsConstructor
public class SessionComboController {

    private final SessionComboService sessionComboService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<SessionComboResponseDTO>> addComboToSession(
            @Valid @RequestBody AddComboToSessionDTO request) {
        SessionComboResponseDTO response = sessionComboService.addComboToSession(request);
        return ResponseUtil.created(response, "Thêm combo vào session thành công");
    }

    @GetMapping("/session/{sessionId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<List<SessionComboResponseDTO>>> getCombosBySessionId(
            @PathVariable Long sessionId) {
        List<SessionComboResponseDTO> response = sessionComboService.getCombosBySessionId(sessionId);
        return ResponseUtil.success(response, "Lấy danh sách combo trong session thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> deleteSessionCombo(@PathVariable Long id) {
        sessionComboService.deleteSessionCombo(id);
        return ResponseUtil.success(null, "Xóa combo khỏi session thành công");
    }
}
