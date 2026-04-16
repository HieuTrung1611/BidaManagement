package com.mhbilliards.billiards_management.dto.attendance;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
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
public class AttendanceDailyConfirmRequest {
    @NotNull(message = "Ngày chấm công không được để trống")
    @PastOrPresent(message = "Ngày chấm công không được ở tương lai")
    LocalDate attendanceDate;

    Long branchId;
}
