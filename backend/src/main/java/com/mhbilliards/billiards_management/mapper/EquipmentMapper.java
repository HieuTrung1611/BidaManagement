package com.mhbilliards.billiards_management.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.mhbilliards.billiards_management.dto.equipment.CreateEquipmentDTO;
import com.mhbilliards.billiards_management.dto.equipment.EquipmentResponseDTO;
import com.mhbilliards.billiards_management.dto.equipment.UpdateEquipmentDTO;
import com.mhbilliards.billiards_management.entity.Equipment;

@Mapper(componentModel = "spring")
public interface EquipmentMapper {
    @Mapping(source = "branchId", target = "branch.id")
    Equipment toEntity(CreateEquipmentDTO dto);

    @Mapping(source = "branch.id", target = "branchId")
    @Mapping(source = "branch.name", target = "branchName")
    EquipmentResponseDTO toResponseDTO(Equipment equipment);

    List<EquipmentResponseDTO> toResponseDTOList(List<Equipment> equipments);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branch", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateEntity(UpdateEquipmentDTO dto, @MappingTarget Equipment equipment);
}
