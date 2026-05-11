package com.mhbilliards.billiards_management.dto.combo;

import java.time.LocalDateTime;
import java.util.List;

import com.mhbilliards.billiards_management.dto.comboItem.ComboItemResponseDTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ComboResponseDTO {
    Long id;
    String name;
    String description;
    Double regularPrice;
    Double discountedPrice;
    Double savingsAmount; // regularPrice - discountedPrice
    Integer savingsPercent; // % tiết kiệm
    Long branchId;
    String branchName;
    Boolean isActive;
    List<ComboItemResponseDTO> items;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
