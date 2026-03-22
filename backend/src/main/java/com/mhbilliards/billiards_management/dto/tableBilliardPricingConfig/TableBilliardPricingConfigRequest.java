package com.mhbilliards.billiards_management.dto.tableBilliardPricingConfig;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class TableBilliardPricingConfigRequest {
    @NotNull(message = "Loại bàn bi-a không được để trống")
    Long tableBilliardTypeId;

    @NotNull(message = "Giá tiền theo giờ không được để trống")
    Double pricePerHour;

    @NotNull(message = "Khu vực không được để trống")
    Long tableBilliardZoneId;
}
