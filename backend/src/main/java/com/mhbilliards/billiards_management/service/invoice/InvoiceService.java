package com.mhbilliards.billiards_management.service.invoice;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.mhbilliards.billiards_management.dto.invoice.InvoiceDTO;
import com.mhbilliards.billiards_management.dto.invoice.InvoiceResponseDTO;
import com.mhbilliards.billiards_management.entity.Invoice;
import com.mhbilliards.billiards_management.enums.InvoiceStatus;

public interface InvoiceService {
    /**
     * Generate invoice DTO for display/print (không lưu DB)
     */
    InvoiceDTO generateInvoice(Long sessionId);

    /**
     * Tạo và lưu invoice vào database khi kết thúc session
     */
    Invoice createInvoiceFromSession(Long sessionId);

    /**
     * Lấy invoice theo ID - trả về DTO
     */
    InvoiceResponseDTO getInvoiceById(Long id);

    /**
     * Lấy invoice theo sessionId - trả về DTO
     */
    InvoiceResponseDTO getInvoiceBySessionId(Long sessionId);

    /**
     * Lấy danh sách invoice theo branch và khoảng thời gian
     */
    Page<Invoice> getInvoicesByBranch(Long branchId, LocalDateTime startDate,
            LocalDateTime endDate, InvoiceStatus status, Pageable pageable);

    /**
     * Tính tổng doanh thu theo branch và khoảng thời gian
     */
    Double getTotalRevenue(Long branchId, LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Đếm số hóa đơn theo branch và khoảng thời gian
     */
    Long countInvoices(Long branchId, LocalDateTime startDate, LocalDateTime endDate);
}
