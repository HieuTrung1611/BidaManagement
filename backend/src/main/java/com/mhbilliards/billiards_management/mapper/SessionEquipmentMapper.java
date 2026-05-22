package com.mhbilliards.billiards_management.mapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.mhbilliards.billiards_management.dto.sessionEquipment.SessionEquipmentResponseDTO;
import com.mhbilliards.billiards_management.entity.SessionEquipment;

@Mapper(componentModel = "spring")
public interface SessionEquipmentMapper {
    @Mapping(target = "sessionId", ignore = true)
    @Mapping(source = "equipment.id", target = "equipmentId")
    @Mapping(source = "equipment.name", target = "equipmentName")
    @Mapping(target = "durationHours", source = ".", qualifiedByName = "calculateDurationHours")
    @Mapping(target = "isReturned", source = ".", qualifiedByName = "calculateIsReturned")
    SessionEquipmentResponseDTO toResponseDTO(SessionEquipment sessionEquipment);

    List<SessionEquipmentResponseDTO> toResponseDTOList(List<SessionEquipment> sessionEquipments);

    @Named("calculateDurationHours")
    default Double calculateDurationHours(SessionEquipment sessionEquipment) {
        // NEW LOGIC: Equipment charged 1 hour upfront
        // If totalAmount is set, it means equipment is charged (show 1.0h)
        if (sessionEquipment.getTotalAmount() != null && sessionEquipment.getTotalAmount() > 0) {
            return 1.0;
        }

        // Backward compatibility: Calculate actual duration for old equipment
        if (sessionEquipment.getStartTime() != null && sessionEquipment.getEndTime() != null) {
            long minutes = ChronoUnit.MINUTES.between(sessionEquipment.getStartTime(), sessionEquipment.getEndTime());
            // Avoid showing 0.0 if endTime == startTime (can happen with old charged
            // equipment)
            if (minutes == 0 && sessionEquipment.getTotalAmount() != null) {
                return 1.0; // Assume 1 hour if charged but times are equal
            }
            return BigDecimal.valueOf(minutes)
                    .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP)
                    .doubleValue();
        }
        return null;
    }

    @Named("calculateIsReturned")
    default Boolean calculateIsReturned(SessionEquipment sessionEquipment) {
        return sessionEquipment.getEndTime() != null;
    }
}
