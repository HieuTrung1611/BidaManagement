package com.mhbilliards.billiards_management.dto.invoice;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/**
 * DTO cho combo trong hóa đơn
 */
@Getter
@Setter
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class SessionComboInvoiceDTO {
    Long comboId;
    String comboName;
    Integer quantity;
    Double price;
    Double totalAmount;
}
