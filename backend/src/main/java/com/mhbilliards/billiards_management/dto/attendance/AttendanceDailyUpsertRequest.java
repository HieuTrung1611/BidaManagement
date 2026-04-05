package com.mhbilliards.billiards_management.dto.attendance;

import java.time.LocalDate;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
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
public class AttendanceDailyUpsertRequest {
    @NotNull(message = "Ngày chấm công không được để trống")
    @PastOrPresent(message = "Ngày chấm công không được ở tương lai")
    LocalDate attendanceDate;

    @NotNull(message = "Chi nhánh không được để trống")
    Long branchId;

    @Valid
    @NotEmpty(message = "Danh sách chấm công không được để trống")
    List<AttendanceUpsertItemRequest> attendances;
}