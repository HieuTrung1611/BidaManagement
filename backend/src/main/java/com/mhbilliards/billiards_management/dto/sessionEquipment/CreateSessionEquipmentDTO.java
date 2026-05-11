package com.mhbilliards.billiards_management.dto.sessionEquipment;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class CreateSessionEquipmentDTO {
    @NotNull(message = "Session ID is required")
    Long sessionId;

    @NotNull(message = "Equipment ID is required")
    Long equipmentId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    Integer quantity;
}
