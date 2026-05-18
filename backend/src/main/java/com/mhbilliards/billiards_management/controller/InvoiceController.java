package com.mhbilliards.billiards_management.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mhbilliards.billiards_management.dto.invoice.InvoiceDTO;
import com.mhbilliards.billiards_management.entity.Invoice;
import com.mhbilliards.billiards_management.enums.InvoiceStatus;
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

    /**
     * Get invoice by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<Invoice>> getInvoiceById(@PathVariable Long id) {
        Invoice invoice = invoiceService.getInvoiceById(id);
        return ResponseUtil.success(invoice, "Lấy hóa đơn thành công");
    }

    /**
     * Get invoice by session ID
     */
    @GetMapping("/session/{sessionId}/saved")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<Invoice>> getInvoiceBySession(@PathVariable Long sessionId) {
        Invoice invoice = invoiceService.getInvoiceBySessionId(sessionId);
        return ResponseUtil.success(invoice, "Lấy hóa đơn thành công");
    }

    /**
     * Get invoices list with filters
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Page<Invoice>>> getInvoices(
            @RequestParam Long branchId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) InvoiceStatus status,
            Pageable pageable) {

        // Set default dates if not provided
        if (startDate == null) {
            startDate = LocalDateTime.now().minusMonths(1);
        }
        if (endDate == null) {
            endDate = LocalDateTime.now();
        }

        Page<Invoice> invoices = invoiceService.getInvoicesByBranch(branchId, startDate, endDate, status, pageable);
        return ResponseUtil.success(invoices, "Lấy danh sách hóa đơn thành công");
    }

    /**
     * Get revenue report
     */
    @GetMapping("/revenue")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRevenue(
            @RequestParam Long branchId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        // Set default dates if not provided
        if (startDate == null) {
            startDate = LocalDateTime.now().minusMonths(1);
        }
        if (endDate == null) {
            endDate = LocalDateTime.now();
        }

        Double totalRevenue = invoiceService.getTotalRevenue(branchId, startDate, endDate);
        Long invoiceCount = invoiceService.countInvoices(branchId, startDate, endDate);

        Map<String, Object> report = new HashMap<>();
        report.put("branchId", branchId);
        report.put("startDate", startDate);
        report.put("endDate", endDate);
        report.put("totalRevenue", totalRevenue);
        report.put("invoiceCount", invoiceCount);
        report.put("averageInvoiceAmount", invoiceCount > 0 ? totalRevenue / invoiceCount : 0.0);

        return ResponseUtil.success(report, "Lấy báo cáo doanh thu thành công");
    }
}
