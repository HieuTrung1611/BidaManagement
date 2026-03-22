package com.mhbilliards.billiards_management.dto.tableBilliardType;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TableBilliardTypeResponse {
    Long id;
    String name;
    String description;
    Double costPrice;
    String supplier;
    String supplierPhone;
}