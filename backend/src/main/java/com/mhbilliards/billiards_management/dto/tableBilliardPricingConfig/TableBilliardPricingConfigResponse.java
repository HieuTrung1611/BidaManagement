package com.mhbilliards.billiards_management.dto.tableBilliardPricingConfig;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class TableBilliardPricingConfigResponse {
    Long id;
    Long tableBilliardTypeId;
    Double pricePerHour;
    Long tableBilliardZoneId;
}
