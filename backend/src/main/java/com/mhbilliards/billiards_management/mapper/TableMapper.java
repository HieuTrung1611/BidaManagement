package com.mhbilliards.billiards_management.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.mhbilliards.billiards_management.dto.tableBilliard.TableBilliardRequest;
import com.mhbilliards.billiards_management.dto.tableBilliard.TableBilliardResponse;
import com.mhbilliards.billiards_management.entity.TableBilliard;

@Mapper(componentModel = "spring", uses = { TableTypeMapper.class, BranchMapper.class })
public interface TableMapper {

    TableBilliardResponse toResponse(TableBilliard tableBilliard);

    @Mapping(source = "branchId", target = "branch.id")
    @Mapping(source = "typeId", target = "type.id")
    TableBilliard toEntity(TableBilliardRequest tableBilliardRequest);

    List<TableBilliardResponse> toResponseList(List<TableBilliard> tableBilliardList);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(source = "typeId", target = "type.id")
    @Mapping(source = "branchId", target = "branch.id")
    void updateEntity(TableBilliardRequest tableBilliardRequest, @MappingTarget TableBilliard tableBilliard);
}
