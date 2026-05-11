package com.mhbilliards.billiards_management.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.mhbilliards.billiards_management.dto.combo.ComboResponseDTO;
import com.mhbilliards.billiards_management.dto.combo.CreateComboDTO;
import com.mhbilliards.billiards_management.dto.combo.UpdateComboDTO;
import com.mhbilliards.billiards_management.entity.Combo;

@Mapper(componentModel = "spring", uses = { ComboItemMapper.class })
public interface ComboMapper {
    @Mapping(source = "branchId", target = "branch.id")
    @Mapping(target = "items", ignore = true)
    Combo toEntity(CreateComboDTO dto);

    @Mapping(source = "branch.id", target = "branchId")
    @Mapping(source = "branch.name", target = "branchName")
    ComboResponseDTO toResponseDTO(Combo combo);

    List<ComboResponseDTO> toResponseDTOList(List<Combo> combos);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateEntity(UpdateComboDTO dto, @MappingTarget Combo combo);
}
