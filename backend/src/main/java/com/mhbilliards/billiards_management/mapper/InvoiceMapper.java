package com.mhbilliards.billiards_management.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.mhbilliards.billiards_management.dto.invoice.InvoiceResponseDTO;
import com.mhbilliards.billiards_management.entity.Invoice;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {
    
    /**
     * Map Invoice entity to InvoiceResponseDTO
     * Extracts only necessary fields from related entities to avoid circular references
     */
    @Mapping(source = "session.id", target = "sessionId")
    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(source = "customer.name", target = "customerName")
    @Mapping(source = "customer.phoneNumber", target = "customerPhone")
    @Mapping(source = "branch.id", target = "branchId")
    @Mapping(source = "branch.name", target = "branchName")
    @Mapping(source = "branch.address", target = "branchAddress")
    @Mapping(source = "branch.phone", target = "branchPhone")
    InvoiceResponseDTO toResponseDTO(Invoice invoice);
}
