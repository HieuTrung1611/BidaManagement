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
    @Mapping(source = "session.id", target = "sessionId")
    @Mapping(source = "equipment.id", target = "equipmentId")
    @Mapping(source = "equipment.name", target = "equipmentName")
    @Mapping(target = "durationHours", source = ".", qualifiedByName = "calculateDurationHours")
    @Mapping(target = "isReturned", source = ".", qualifiedByName = "calculateIsReturned")
    SessionEquipmentResponseDTO toResponseDTO(SessionEquipment sessionEquipment);

    List<SessionEquipmentResponseDTO> toResponseDTOList(List<SessionEquipment> sessionEquipments);

    @Named("calculateDurationHours")
    default Double calculateDurationHours(SessionEquipment sessionEquipment) {
        if (sessionEquipment.getStartTime() != null && sessionEquipment.getEndTime() != null) {
            long minutes = ChronoUnit.MINUTES.between(sessionEquipment.getStartTime(), sessionEquipment.getEndTime());
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
