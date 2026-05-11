package com.mhbilliards.billiards_management.dto.comboItem;

import java.time.LocalDateTime;

import com.mhbilliards.billiards_management.enums.ComboItemType;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ComboItemResponseDTO {
    Long id;
    Long comboId;
    ComboItemType itemType;
    Long itemId;
    String itemName; // Tên của Product hoặc Equipment
    Integer quantity;
    String unit; // Đơn vị (nếu là Product)
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
