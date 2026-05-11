package com.mhbilliards.billiards_management.dto.equipment;

import com.mhbilliards.billiards_management.enums.EquipmentType;

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
public class CreateEquipmentDTO {
    @NotBlank(message = "Equipment name is required")
    String name;

    String description;

    @NotNull(message = "Equipment type is required")
    EquipmentType type;

    @NotNull(message = "Rental price per hour is required")
    @Min(value = 0, message = "Rental price must be greater than or equal to 0")
    Double rentalPricePerHour;

    @NotNull(message = "Total quantity is required")
    @Min(value = 0, message = "Total quantity must be greater than or equal to 0")
    Integer totalQuantity;

    @NotNull(message = "Available quantity is required")
    @Min(value = 0, message = "Available quantity must be greater than or equal to 0")
    Integer availableQuantity;

    @NotNull(message = "Branch ID is required")
    Long branchId;

    Boolean isActive;
}
