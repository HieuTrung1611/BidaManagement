package com.mhbilliards.billiards_management.dto.sessionProduct;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class SessionProductResponseDTO {
    Long id;
    Long sessionId;
    Long productId;
    String productName;
    Integer quantity;
    String unit;
    Double unitPrice;
    Double totalAmount;
    LocalDateTime createdAt;
}
