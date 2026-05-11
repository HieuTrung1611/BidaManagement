package com.mhbilliards.billiards_management.dto.combo;

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
public class UpdateComboDTO {
    String name;
    String description;

    @Min(value = 0, message = "Regular price must be greater than or equal to 0")
    Double regularPrice;

    @Min(value = 0, message = "Discounted price must be greater than or equal to 0")
    Double discountedPrice;

    Boolean isActive;
}
