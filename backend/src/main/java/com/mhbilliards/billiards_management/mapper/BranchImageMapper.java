package com.mhbilliards.billiards_management.mapper;

import org.mapstruct.Mapper;

import com.mhbilliards.billiards_management.dto.branchImage.BranchImageDTO;
import com.mhbilliards.billiards_management.entity.BranchImage;

@Mapper(componentModel = "spring")
public interface BranchImageMapper {
    BranchImageDTO toDTO(BranchImage branchImage);

}
