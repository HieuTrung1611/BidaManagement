package com.mhbilliards.billiards_management.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.mhbilliards.billiards_management.dto.sessionProduct.SessionProductResponseDTO;
import com.mhbilliards.billiards_management.entity.SessionProduct;

@Mapper(componentModel = "spring")
public interface SessionProductMapper {
    @Mapping(source = "session.id", target = "sessionId")
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    SessionProductResponseDTO toResponseDTO(SessionProduct sessionProduct);

    List<SessionProductResponseDTO> toResponseDTOList(List<SessionProduct> sessionProducts);
}
