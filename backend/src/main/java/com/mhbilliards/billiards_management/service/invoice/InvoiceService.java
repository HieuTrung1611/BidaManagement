package com.mhbilliards.billiards_management.service.invoice;

import com.mhbilliards.billiards_management.dto.invoice.InvoiceDTO;

public interface InvoiceService {
    InvoiceDTO generateInvoice(Long sessionId);
}
