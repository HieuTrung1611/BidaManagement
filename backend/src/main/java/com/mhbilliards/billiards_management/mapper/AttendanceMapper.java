package com.mhbilliards.billiards_management.mapper;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.mhbilliards.billiards_management.dto.attendance.AttendanceResponse;
import com.mhbilliards.billiards_management.entity.Attendance;
import com.mhbilliards.billiards_management.entity.Employee;
import com.mhbilliards.billiards_management.enums.AttendanceStatus;

@Mapper(componentModel = "spring")
public interface AttendanceMapper {

    DateTimeFormatter SHIFT_TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    @Mapping(source = "employee.id", target = "employeeId")
    @Mapping(source = "employee.name", target = "employeeName")
    @Mapping(source = "employee.position.name", target = "positionName")
    @Mapping(source = "employee.shift.id", target = "shiftId")
    @Mapping(source = "employee.shift.name", target = "shiftName")
    @Mapping(source = "employee.shift.startTime", target = "shiftStartTime", dateFormat = "HH:mm")
    @Mapping(source = "employee.shift.endTime", target = "shiftEndTime", dateFormat = "HH:mm")
    @Mapping(source = "employee.branch.id", target = "branchId")
    @Mapping(source = "employee.branch.name", target = "branchName")
    AttendanceResponse toResponse(Attendance attendance);

    default AttendanceResponse toResponse(Attendance attendance, Employee employee, LocalDate attendanceDate) {
        if (attendance != null) {
            AttendanceResponse response = toResponse(attendance);
            response.setAttendanceDate(attendanceDate);
            return response;
        }

        return AttendanceResponse.builder()
                .employeeId(employee.getId())
                .employeeName(employee.getName())
                .positionName(employee.getPosition() != null ? employee.getPosition().getName() : null)
                .shiftId(employee.getShift() != null ? employee.getShift().getId() : null)
                .shiftName(employee.getShift() != null ? employee.getShift().getName() : null)
                .shiftStartTime(employee.getShift() != null && employee.getShift().getStartTime() != null
                        ? employee.getShift().getStartTime().format(SHIFT_TIME_FORMATTER)
                        : null)
                .shiftEndTime(employee.getShift() != null && employee.getShift().getEndTime() != null
                        ? employee.getShift().getEndTime().format(SHIFT_TIME_FORMATTER)
                        : null)
                .branchId(employee.getBranch() != null ? employee.getBranch().getId() : null)
                .branchName(employee.getBranch() != null ? employee.getBranch().getName() : null)
                .attendanceDate(attendanceDate)
                .status(AttendanceStatus.PRESENT)
                .workingHours(resolveDefaultWorkingHours(employee))
                .build();
    }

    private int resolveDefaultWorkingHours(Employee employee) {
        if (employee == null || employee.getShift() == null) {
            return 8;
        }

        LocalTime start = employee.getShift().getStartTime();
        LocalTime end = employee.getShift().getEndTime();

        if (start == null || end == null || start.equals(end)) {
            return 8;
        }

        long minutes = start.isBefore(end)
                ? ChronoUnit.MINUTES.between(start, end)
                : ChronoUnit.MINUTES.between(start, LocalTime.MAX) + 1 + ChronoUnit.MINUTES.between(LocalTime.MIN, end);

        return (int) Math.max(1, Math.round(minutes / 60.0));
    }
}