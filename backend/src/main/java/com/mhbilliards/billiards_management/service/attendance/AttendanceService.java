package com.mhbilliards.billiards_management.service.attendance;

import java.time.LocalDate;

import com.mhbilliards.billiards_management.dto.attendance.AttendanceDailyResponse;
import com.mhbilliards.billiards_management.dto.attendance.AttendanceDailyUpsertRequest;

public interface AttendanceService {
    AttendanceDailyResponse upsertDailyAttendance(AttendanceDailyUpsertRequest request);

    AttendanceDailyResponse getDailyAttendance(LocalDate attendanceDate, Long branchId);
}