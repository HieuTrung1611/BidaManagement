package com.mhbilliards.billiards_management.dto.combo;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateComboDTO {
    @NotBlank(message = "Combo name is required")
    String name;

    String description;

    @NotNull(message = "Regular price is required")
    @Min(value = 0, message = "Regular price must be greater than or equal to 0")
    Double regularPrice;

    @NotNull(message = "Discounted price is required")
    @Min(value = 0, message = "Discounted price must be greater than or equal to 0")
    Double discountedPrice;

    @NotNull(message = "Branch ID is required")
    Long branchId;

    Boolean isActive;
}
