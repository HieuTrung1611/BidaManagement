package com.mhbilliards.billiards_management.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.mhbilliards.billiards_management.dto.sessionCombo.SessionComboResponseDTO;
import com.mhbilliards.billiards_management.entity.SessionCombo;

@Mapper(componentModel = "spring")
public interface SessionComboMapper {
    @Mapping(source = "session.id", target = "sessionId")
    @Mapping(source = "combo.id", target = "comboId")
    @Mapping(source = "combo.name", target = "comboName")
    SessionComboResponseDTO toResponseDTO(SessionCombo sessionCombo);

    List<SessionComboResponseDTO> toResponseDTOList(List<SessionCombo> sessionCombos);
}
