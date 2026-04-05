package com.mhbilliards.billiards_management.dto.tableBilliard;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TableBilliardRequest {
    @NotBlank(message = "Tên bàn bi-a không được để trống")
    String name;

    String description;

    @NotNull(message = "Loại bàn bi-a không được để trống")
    Long typeId;

    @NotNull(message = "Khu vực không được để trống")
    Long zoneId;

    @NotNull(message = "Giá tiền không được để trống")
    Double pricePerHour;

    @NotNull(message = "Chi nhánh không được để trống")
    Long branchId;
}
