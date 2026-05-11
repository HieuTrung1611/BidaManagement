package com.mhbilliards.billiards_management.dto.sessionEquipment;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class SessionEquipmentResponseDTO {
    Long id;
    Long sessionId;
    Long equipmentId;
    String equipmentName;
    Integer quantity;
    LocalDateTime startTime;
    LocalDateTime endTime;
    Double hourlyRate;
    Double durationHours;
    Double totalAmount;
    Boolean isReturned; // endTime != null
    LocalDateTime createdAt;
}
