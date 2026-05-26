package com.mhbilliards.billiards_management.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.mhbilliards.billiards_management.dto.session.SessionResponseDTO;
import com.mhbilliards.billiards_management.entity.BilliardSession;

@Mapper(componentModel = "spring")
public interface BilliardSessionMapper {
    @Mapping(source = "table.id", target = "tableId")
    @Mapping(source = "table.name", target = "tableName")
    @Mapping(target = "tableType", ignore = true)
    @Mapping(source = "customer.id", target = "customerId")
    @Mapping(source = "customer.name", target = "customerName")
    @Mapping(source = "customer.phoneNumber", target = "customerPhone")
    @Mapping(target = "customerRank", ignore = true)
    @Mapping(source = "branch.id", target = "branchId")
    @Mapping(source = "branch.name", target = "branchName")
    SessionResponseDTO toResponseDTO(BilliardSession session);

    default SessionResponseDTO toResponseDTOWithType(BilliardSession session) {
        SessionResponseDTO dto = toResponseDTO(session);
        if (session != null && session.getTable() != null && session.getTable().getType() != null) {
            dto.setTableType(session.getTable().getType().getName());
        }
        if (session != null && session.getCustomer() != null && session.getCustomer().getRank() != null) {
            dto.setCustomerRank(session.getCustomer().getRank().getDisplayName());
        }
        return dto;
    }
}
