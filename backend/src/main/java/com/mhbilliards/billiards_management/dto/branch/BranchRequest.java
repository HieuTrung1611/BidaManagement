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
public class BranchRequest {
    @NotBlank(message = "Tên chi nhánh không được để trống")
    @Pattern(regexp = "^[\\p{L} ]+$", message = "Tên chi nhánh không hợp lệ")
    String name;

    @NotBlank(message = "Tên chi nhánh không được để trống")
    @Pattern(regexp = "^[\\p{L} ]+$", message = "Tên chi nhánh không hợp lệ")
    String address;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(0|\\+84)(3|5|7|8|9)[0-9]{8}$", message = "Số điện thoại không hợp lệ")
    String phoneNumber;

    String description;
}
