package com.mhbilliards.billiards_management.dto.equipment;

import java.time.LocalDateTime;

import com.mhbilliards.billiards_management.enums.EquipmentType;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class EquipmentResponseDTO {
    Long id;
    String name;
    String description;
    EquipmentType type;
    Double rentalPricePerHour;
    Integer totalQuantity;
    Integer availableQuantity;
    Long branchId;
    String branchName;
    Boolean isActive;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
