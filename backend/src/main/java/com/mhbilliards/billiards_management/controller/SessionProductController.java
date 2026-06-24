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

import com.mhbilliards.billiards_management.dto.sessionProduct.CreateSessionProductDTO;
import com.mhbilliards.billiards_management.dto.sessionProduct.SessionProductResponseDTO;
import com.mhbilliards.billiards_management.service.sessionProduct.SessionProductService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/session-products")
@RequiredArgsConstructor
public class SessionProductController {

    private final SessionProductService sessionProductService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<SessionProductResponseDTO>> addProductToSession(
            @Valid @RequestBody CreateSessionProductDTO request) {
        SessionProductResponseDTO response = sessionProductService.addProductToSession(request);
        return ResponseUtil.created(response, "Thêm sản phẩm vào session thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<SessionProductResponseDTO>> getSessionProductById(@PathVariable Long id) {
        SessionProductResponseDTO response = sessionProductService.getSessionProductById(id);
        return ResponseUtil.success(response, "Lấy session product thành công");
    }

    @GetMapping("/session/{sessionId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<List<SessionProductResponseDTO>>> getProductsBySessionId(
            @PathVariable Long sessionId) {
        List<SessionProductResponseDTO> response = sessionProductService.getProductsBySessionId(sessionId);
        return ResponseUtil.success(response, "Lấy danh sách sản phẩm trong session thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> deleteSessionProduct(@PathVariable Long id) {
        sessionProductService.deleteSessionProduct(id);
        return ResponseUtil.success(null, "Xóa sản phẩm khỏi session thành công");
    }
}
