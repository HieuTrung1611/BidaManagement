package com.mhbilliards.billiards_management.dto.equipment;

import com.mhbilliards.billiards_management.enums.EquipmentType;

import jakarta.validation.constraints.Min;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UpdateEquipmentDTO {
    String name;
    String description;
    EquipmentType type;

    @Min(value = 0, message = "Rental price must be greater than or equal to 0")
    Double rentalPricePerHour;

    @Min(value = 0, message = "Total quantity must be greater than or equal to 0")
    Integer totalQuantity;

    @Min(value = 0, message = "Available quantity must be greater than or equal to 0")
    Integer availableQuantity;

    Boolean isActive;
}
