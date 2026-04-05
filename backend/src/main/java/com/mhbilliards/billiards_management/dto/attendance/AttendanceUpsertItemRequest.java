package com.mhbilliards.billiards_management.dto.attendance;

import com.mhbilliards.billiards_management.enums.AttendanceStatus;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AttendanceUpsertItemRequest {
    @NotNull(message = "Nhân viên không được để trống")
    Long employeeId;

    @NotNull(message = "Trạng thái chấm công không được để trống")
    AttendanceStatus status;

    @Min(value = 0, message = "Số giờ làm không được âm")
    @Max(value = 24, message = "Số giờ làm không hợp lệ")
    Integer workingHours;

    String notes;
}