package com.mhbilliards.billiards_management.dto.product;

import java.time.LocalDateTime;

import com.mhbilliards.billiards_management.enums.ProductType;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ProductResponseDTO {
    Long id;
    String name;
    String description;
    ProductType type;
    Double purchasePrice;
    Double salePrice;
    Integer stockQuantity;
    String unit;
    Long branchId;
    String branchName;
    Boolean isActive;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
