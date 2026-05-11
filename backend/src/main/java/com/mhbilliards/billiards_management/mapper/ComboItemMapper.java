package com.mhbilliards.billiards_management.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.mhbilliards.billiards_management.dto.comboItem.ComboItemResponseDTO;
import com.mhbilliards.billiards_management.entity.ComboItem;

@Mapper(componentModel = "spring")
public interface ComboItemMapper {
    @Mapping(source = "combo.id", target = "comboId")
    ComboItemResponseDTO toResponseDTO(ComboItem comboItem);

    List<ComboItemResponseDTO> toResponseDTOList(List<ComboItem> comboItems);
}
