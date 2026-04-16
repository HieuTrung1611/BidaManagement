package com.mhbilliards.billiards_management.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.mhbilliards.billiards_management.dto.shift.ShiftRequest;
import com.mhbilliards.billiards_management.dto.shift.ShiftResponse;
import com.mhbilliards.billiards_management.entity.Shift;

@Mapper(componentModel = "spring")
public interface ShiftMapper {
    ShiftResponse toResponse(Shift shift);

    Shift toEntity(ShiftRequest request);

    List<ShiftResponse> toResponseList(List<Shift> shifts);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateEntity(ShiftRequest request, @MappingTarget Shift shift);
}
