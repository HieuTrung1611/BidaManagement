package com.mhbilliards.billiards_management.dto.tableBilliardType;

import com.mhbilliards.billiards_management.dto.base.BaseResponse;

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
public class TableBilliardTypeResponse extends BaseResponse {
    String name;
    String description;

    Double pricePerHour;

    Double costPrice;
    String supplier;
    String supplierPhone;
}