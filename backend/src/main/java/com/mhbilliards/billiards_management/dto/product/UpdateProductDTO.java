package com.mhbilliards.billiards_management.dto.product;

import com.mhbilliards.billiards_management.enums.ProductType;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UpdateProductDTO {
    String name;
    String description;
    ProductType type;

    @Min(value = 0, message = "Purchase price must be greater than or equal to 0")
    Double purchasePrice;

    @Min(value = 0, message = "Sale price must be greater than or equal to 0")
    Double salePrice;

    @Min(value = 0, message = "Stock quantity must be greater than or equal to 0")
    Integer stockQuantity;

    String unit;
    Boolean isActive;
}
