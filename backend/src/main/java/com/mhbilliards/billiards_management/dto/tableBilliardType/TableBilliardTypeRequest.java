package com.mhbilliards.billiards_management.dto.tableBilliardType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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
public class TableBilliardTypeRequest {
    @NotBlank(message = "Tên loại bàn bi-a không được để trống")
    @Pattern(regexp = "^[\\p{L} ]+$", message = "Tên loại bàn bi-a không hợp lệ")
    String name;

    String description;

    @NotNull(message = "Giá bàn không được để trống")
    Double costPrice;

    @NotBlank(message = "Nhà cung cấp không được để trống")
    String supplier;

    @NotBlank(message = "Số điện thoại nhà cung cấp không được để trống")
    @Pattern(regexp = "^(0|\\+84)(3|5|7|8|9)[0-9]{8}$", message = "Số điện thoại nhà cung cấp không hợp lệ")
    String supplierPhone;
}