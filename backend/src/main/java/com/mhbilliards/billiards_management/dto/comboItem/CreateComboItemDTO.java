package com.mhbilliards.billiards_management.dto.comboItem;

import com.mhbilliards.billiards_management.enums.ComboItemType;

import jakarta.validation.constraints.Min;
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
public class CreateComboItemDTO {
    @NotNull(message = "Combo ID is required")
    Long comboId;

    @NotNull(message = "Item type is required")
    ComboItemType itemType;

    @NotNull(message = "Item ID is required")
    Long itemId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    Integer quantity;
}
