package com.mhbilliards.billiards_management.dto.product;

import com.mhbilliards.billiards_management.enums.ProductType;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class CreateProductDTO {
    @NotBlank(message = "Product name is required")
    String name;

    String description;

    @NotNull(message = "Product type is required")
    ProductType type;

    @NotNull(message = "Purchase price is required")
    @Min(value = 0, message = "Purchase price must be greater than or equal to 0")
    Double purchasePrice;

    @NotNull(message = "Sale price is required")
    @Min(value = 0, message = "Sale price must be greater than or equal to 0")
    Double salePrice;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity must be greater than or equal to 0")
    Integer stockQuantity;

    @NotBlank(message = "Unit is required")
    String unit; // chai, ly, phần...

    @NotNull(message = "Branch ID is required")
    Long branchId;

    Boolean isActive;
}
