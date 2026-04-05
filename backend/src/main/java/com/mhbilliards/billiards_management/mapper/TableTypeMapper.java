package com.mhbilliards.billiards_management.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.mhbilliards.billiards_management.dto.tableBilliardType.TableBilliardTypeRequest;
import com.mhbilliards.billiards_management.dto.tableBilliardType.TableBilliardTypeResponse;
import com.mhbilliards.billiards_management.entity.TableBilliardType;

@Mapper(componentModel = "spring")
public interface TableTypeMapper {

    TableBilliardTypeResponse toResponse(TableBilliardType tableBilliardType);

    TableBilliardType toEntity(TableBilliardTypeRequest tableBilliardTypeRequest);

    List<TableBilliardTypeResponse> toResponseList(List<TableBilliardType> tableBilliardTypeList);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateEntity(TableBilliardTypeRequest tableBilliardTypeRequest,
            @MappingTarget TableBilliardType tableBilliardType);
}
