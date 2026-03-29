package com.mhbilliards.billiards_management.dto.branch;

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
public class BranchCreationRequest {
    @NotBlank(message = "Tên chi nhánh không được để trống")
    @Pattern(regexp = "^[\\p{L} ]+$", message = "Tên chi nhánh không hợp lệ")
    String name;

    @NotBlank(message = "Địa chỉ chi nhánh không được để trống")
    String address;

    String description;
}
