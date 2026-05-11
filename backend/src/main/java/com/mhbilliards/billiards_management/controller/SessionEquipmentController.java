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

import com.mhbilliards.billiards_management.dto.sessionEquipment.CreateSessionEquipmentDTO;
import com.mhbilliards.billiards_management.dto.sessionEquipment.SessionEquipmentResponseDTO;
import com.mhbilliards.billiards_management.service.sessionEquipment.SessionEquipmentService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/session-equipments")
@RequiredArgsConstructor
public class SessionEquipmentController {

    private final SessionEquipmentService sessionEquipmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<SessionEquipmentResponseDTO>> rentEquipmentForSession(
            @Valid @RequestBody CreateSessionEquipmentDTO request) {
        SessionEquipmentResponseDTO response = sessionEquipmentService.rentEquipmentForSession(request);
        return ResponseUtil.created(response, "Cho thuê thiết bị thành công");
    }

    @PutMapping("/{id}/return")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<SessionEquipmentResponseDTO>> returnEquipment(@PathVariable Long id) {
        SessionEquipmentResponseDTO response = sessionEquipmentService.returnEquipment(id);
        return ResponseUtil.success(response, "Trả thiết bị thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<SessionEquipmentResponseDTO>> getSessionEquipmentById(@PathVariable Long id) {
        SessionEquipmentResponseDTO response = sessionEquipmentService.getSessionEquipmentById(id);
        return ResponseUtil.success(response, "Lấy session equipment thành công");
    }

    @GetMapping("/session/{sessionId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<List<SessionEquipmentResponseDTO>>> getEquipmentsBySessionId(
            @PathVariable Long sessionId) {
        List<SessionEquipmentResponseDTO> response = sessionEquipmentService.getEquipmentsBySessionId(sessionId);
        return ResponseUtil.success(response, "Lấy danh sách thiết bị trong session thành công");
    }

    @GetMapping("/session/{sessionId}/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<List<SessionEquipmentResponseDTO>>> getActiveRentalsBySessionId(
            @PathVariable Long sessionId) {
        List<SessionEquipmentResponseDTO> response = sessionEquipmentService.getActiveRentalsBySessionId(sessionId);
        return ResponseUtil.success(response, "Lấy danh sách thiết bị đang thuê thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> deleteSessionEquipment(@PathVariable Long id) {
        sessionEquipmentService.deleteSessionEquipment(id);
        return ResponseUtil.success(null, "Xóa thiết bị khỏi session thành công");
    }
}
