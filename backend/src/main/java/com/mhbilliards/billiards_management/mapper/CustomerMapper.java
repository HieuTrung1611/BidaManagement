package com.mhbilliards.billiards_management.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.mhbilliards.billiards_management.dto.customer.CustomerRequest;
import com.mhbilliards.billiards_management.dto.customer.CustomerResponse;
import com.mhbilliards.billiards_management.entity.Customer;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    @Mapping(target = "faceEmbedding", ignore = true)
    @Mapping(target = "photoUrl", ignore = true)
    @Mapping(target = "visitCount", ignore = true)
    @Mapping(target = "lastVisitDate", ignore = true)
    @Mapping(target = "totalSpent", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    Customer toEntity(CustomerRequest req);

    CustomerResponse toResponse(Customer customer);

    List<CustomerResponse> toResponseList(List<Customer> customerList);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "rank", ignore = true)
    @Mapping(target = "totalSpent", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "photoUrl", ignore = true)
    @Mapping(target = "faceEmbedding", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "visitCount", ignore = true)
    @Mapping(target = "lastVisitDate", ignore = true)
    void updateEntity(CustomerRequest req, @MappingTarget Customer customer);
}
