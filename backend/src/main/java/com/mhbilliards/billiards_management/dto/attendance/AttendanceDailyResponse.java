package com.mhbilliards.billiards_management.dto.attendance;

import java.time.LocalDate;
import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AttendanceDailyResponse {
    LocalDate attendanceDate;
    Long branchId;
    String branchName;
    Integer totalEmployees;
    List<AttendanceResponse> attendances;
}