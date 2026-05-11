package com.mhbilliards.billiards_management.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mhbilliards.billiards_management.dto.invoice.InvoiceDTO;
import com.mhbilliards.billiards_management.service.invoice.InvoiceService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping("/session/{sessionId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<InvoiceDTO>> generateInvoice(@PathVariable Long sessionId) {
        InvoiceDTO invoice = invoiceService.generateInvoice(sessionId);
        return ResponseUtil.success(invoice, "Tạo hóa đơn thành công");
    }
}
