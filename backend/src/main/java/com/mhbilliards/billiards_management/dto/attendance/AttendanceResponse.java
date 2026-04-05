package com.mhbilliards.billiards_management.dto.attendance;

import java.time.LocalDate;

import com.mhbilliards.billiards_management.enums.AttendanceStatus;

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
public class AttendanceResponse {
    Long id;
    Long employeeId;
    String employeeName;
    String positionName;
    Long branchId;
    String branchName;
    LocalDate attendanceDate;
    AttendanceStatus status;
    Integer workingHours;
    String notes;
}