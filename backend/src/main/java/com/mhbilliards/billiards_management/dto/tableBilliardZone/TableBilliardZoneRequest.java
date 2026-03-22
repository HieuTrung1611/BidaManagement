package com.mhbilliards.billiards_management.dto.tableBilliardZone;

import jakarta.validation.constraints.NotBlank;
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
public class TableBilliardZoneRequest {
    @NotBlank(message = "Tên khu vực không được để trống")
    @Pattern(regexp = "^[\\p{L} ]+$", message = "Tên khu vực không hợp lệ")
    String name;
    String description;
}
