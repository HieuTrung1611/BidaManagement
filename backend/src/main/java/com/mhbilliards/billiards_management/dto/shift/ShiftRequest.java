package com.mhbilliards.billiards_management.dto.shift;

import java.time.LocalTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

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
public class ShiftRequest {
    String name; // Tên ca làm việc, ví dụ: "Ca sáng", "Ca chiều", "Ca tối"
    @NotBlank(message = "Mã ca làm việc không được để trống")
    @Pattern(regexp = "^\\S+$", message = "Mã ca làm việc không được chứa khoảng trắng")
    String code;
    String description; // Mô tả chi tiết về ca làm việc
    LocalTime startTime; // Thời gian bắt đầu ca làm việc
    LocalTime endTime; // Thời gian kết thúc ca làm việc
}
