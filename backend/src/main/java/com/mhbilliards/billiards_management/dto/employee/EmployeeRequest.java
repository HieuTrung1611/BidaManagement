package com.mhbilliards.billiards_management.dto.employee;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeRequest {
    @NotBlank(message = "Tên không được để trống")
    String name;
    @NotBlank(message = "Email không được để trống")
    String email;
    @Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "Số điện thoại không hợp lệ")
    String phoneNumber;

    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    LocalDate dob;

    String address;

    @NotNull(message = "Chức vụ không được để trống")
    Long positionId;
}
