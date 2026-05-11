package com.mhbilliards.billiards_management.dto.comboItem;

import com.mhbilliards.billiards_management.enums.ComboItemType;

import jakarta.validation.constraints.Min;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UpdateComboItemDTO {
    ComboItemType itemType;
    Long itemId;

    @Min(value = 1, message = "Quantity must be at least 1")
    Integer quantity;
}
