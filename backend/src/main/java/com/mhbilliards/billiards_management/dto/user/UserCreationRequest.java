package com.mhbilliards.billiards_management.dto.user;

import com.mhbilliards.billiards_management.enums.UserRole;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UserCreationRequest {
    @NotBlank(message = "Tên người dùng không được để trống")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới")
    String username;
    @NotBlank(message = "Mật khẩu không được để trống")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$", message = "Mật khẩu phải >= 8 ký tự và chứa cả chữ lẫn số")
    String password;
    @NotBlank(message = "Email không được để trống")
    String email;
    @Builder.Default
    UserRole role = UserRole.EMPLOYEE;

    Long branchId;
}
