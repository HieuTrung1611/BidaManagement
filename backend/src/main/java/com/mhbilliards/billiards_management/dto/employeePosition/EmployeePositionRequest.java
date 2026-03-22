package com.mhbilliards.billiards_management.dto.employeePosition;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeePositionRequest {
    @NotBlank(message = "Mã chức vụ không được để trống")
    @Pattern(regexp = "^[A-Za-z]+$", message = "Mã chức vụ không được chứa số và khoảng trắng")
    private String code;

    @NotBlank(message = "Tên chức vụ không được để trống")
    @Pattern(regexp = "^[\\p{L} ]+$", message = "Tên chức vụ không hợp lệ ")
    String name;

    @NotNull(message = "Mức lương theo giờ không được để trống")
    Double hourlyRate;
}
