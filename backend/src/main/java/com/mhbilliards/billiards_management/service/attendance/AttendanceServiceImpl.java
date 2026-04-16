package com.mhbilliards.billiards_management.service.attendance;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mhbilliards.billiards_management.dto.attendance.AttendanceDailyResponse;
import com.mhbilliards.billiards_management.dto.attendance.AttendanceDailyConfirmRequest;
import com.mhbilliards.billiards_management.dto.attendance.AttendanceDailyUpsertRequest;
import com.mhbilliards.billiards_management.dto.attendance.AttendanceResponse;
import com.mhbilliards.billiards_management.dto.attendance.AttendanceUpsertItemRequest;
import com.mhbilliards.billiards_management.entity.Attendance;
import com.mhbilliards.billiards_management.entity.Employee;
import com.mhbilliards.billiards_management.enums.AttendanceStatus;
import com.mhbilliards.billiards_management.mapper.AttendanceMapper;
import com.mhbilliards.billiards_management.repository.AttendanceRepository;
import com.mhbilliards.billiards_management.repository.EmployeeRepository;
import com.mhbilliards.billiards_management.service.base.CurrentUserAccessService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private static final int DEFAULT_WORKING_HOURS = 8;
    private static final LocalTime DAILY_CONFIRM_MIN_TIME = LocalTime.of(20, 0);

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final CurrentUserAccessService currentUserAccessService;
    private final AttendanceMapper attendanceMapper;

    @Override
    @Transactional
    public AttendanceDailyResponse upsertDailyAttendance(AttendanceDailyUpsertRequest request) {
        LocalDate attendanceDate = request.getAttendanceDate();
        if (attendanceDate.isAfter(LocalDate.now())) {
            throw new RuntimeException("Không thể chấm công cho ngày ở tương lai");
        }

        Long branchId = currentUserAccessService.resolveAccessibleBranchId(request.getBranchId());
        if (branchId == null) {
            throw new RuntimeException("Vui lòng chọn chi nhánh để cập nhật chấm công");
        }

        if (attendanceRepository.existsConfirmedByAttendanceDate(attendanceDate, branchId)) {
            throw new RuntimeException("Bảng chấm công của ngày này đã được chốt, không thể chỉnh sửa");
        }

        List<AttendanceUpsertItemRequest> items = request.getAttendances();

        Set<Long> employeeIds = new HashSet<>();
        for (AttendanceUpsertItemRequest item : items) {
            if (!employeeIds.add(item.getEmployeeId())) {
                throw new RuntimeException("Danh sách chấm công có nhân viên bị lặp");
            }
        }

        List<Employee> employees = employeeRepository.findAllDetailedByIdIn(items.stream()
                .map(AttendanceUpsertItemRequest::getEmployeeId)
                .toList());

        if (employees.size() != items.size()) {
            throw new RuntimeException("Có nhân viên không tồn tại hoặc đã bị vô hiệu hóa");
        }

        Map<Long, Employee> employeeMap = new HashMap<>();
        for (Employee employee : employees) {
            currentUserAccessService.assertCanManageEmployee(employee);
            if (!Objects.equals(employee.getBranch().getId(), branchId)) {
                throw new RuntimeException(
                        "Mỗi lần chấm công chỉ được thao tác với nhân viên trong cùng một chi nhánh");
            }
            employeeMap.put(employee.getId(), employee);
        }

        for (AttendanceUpsertItemRequest item : items) {
            Employee employee = employeeMap.get(item.getEmployeeId());
            Attendance attendance = attendanceRepository
                    .findByEmployeeIdAndAttendanceDate(employee.getId(), attendanceDate)
                    .orElseGet(() -> Attendance.builder()
                            .employee(employee)
                            .attendanceDate(attendanceDate)
                            .build());

            attendance.setEmployee(employee);
            attendance.setAttendanceDate(attendanceDate);
            attendance.setStatus(item.getStatus());
            attendance.setWorkingHours(normalizeWorkingHours(item.getStatus(), item.getWorkingHours()));
            attendance.setNotes(trimToNull(item.getNotes()));
            attendance.setConfirmed(false);
            attendance.setConfirmedAt(null);
            attendance.setConfirmedBy(null);
            attendanceRepository.save(attendance);
        }

        return getDailyAttendance(attendanceDate, branchId);
    }

    @Override
    @Transactional
    public AttendanceDailyResponse confirmDailyAttendance(AttendanceDailyConfirmRequest request) {
        LocalDate attendanceDate = request.getAttendanceDate();

        if (attendanceDate.isAfter(LocalDate.now())) {
            throw new RuntimeException("Không thể chốt công cho ngày ở tương lai");
        }

        Long branchId = currentUserAccessService.resolveAccessibleBranchId(request.getBranchId());
        if (branchId == null) {
            throw new RuntimeException("Vui lòng chọn chi nhánh để chốt công");
        }

        List<Employee> employees = employeeRepository.findActiveEmployeesByBranchId(branchId);
        if (employees.isEmpty()) {
            throw new RuntimeException("Chi nhánh chưa có nhân viên đang hoạt động");
        }

        ConfirmRuleResult confirmRuleResult = evaluateConfirmRule(attendanceDate, employees);
        if (!confirmRuleResult.canConfirm()) {
            throw new RuntimeException(confirmRuleResult.reason());
        }

        String currentUsername = currentUserAccessService.getCurrentUser().getUsername();
        LocalDateTime confirmedAt = LocalDateTime.now();

        Map<Long, Attendance> attendanceMap = attendanceRepository
                .findDetailedByAttendanceDate(attendanceDate, branchId)
                .stream()
                .collect(HashMap::new, (map, attendance) -> map.put(attendance.getEmployee().getId(), attendance),
                        HashMap::putAll);

        for (Employee employee : employees) {
            Attendance attendance = attendanceMap.get(employee.getId());
            if (attendance == null) {
                attendance = Attendance.builder()
                        .employee(employee)
                        .attendanceDate(attendanceDate)
                        .status(AttendanceStatus.PRESENT)
                        .workingHours(resolveDefaultShiftWorkingHours(employee))
                        .build();
            }

            if (attendance.getStatus() == null) {
                attendance.setStatus(AttendanceStatus.PRESENT);
            }

            attendance.setWorkingHours(normalizeWorkingHours(attendance.getStatus(), attendance.getWorkingHours()));
            attendance.setConfirmed(true);
            attendance.setConfirmedAt(confirmedAt);
            attendance.setConfirmedBy(currentUsername);
            attendanceRepository.save(attendance);
        }

        return getDailyAttendance(attendanceDate, branchId);
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceDailyResponse getDailyAttendance(LocalDate attendanceDate, Long branchId) {
        Long accessibleBranchId = currentUserAccessService.resolveAccessibleBranchId(branchId);

        List<Employee> employees = employeeRepository.findActiveEmployeesByBranchId(accessibleBranchId);
        List<Attendance> attendances = attendanceRepository.findDetailedByAttendanceDate(attendanceDate,
                accessibleBranchId);

        Map<Long, Attendance> attendanceMap = new HashMap<>();
        for (Attendance attendance : attendances) {
            attendanceMap.put(attendance.getEmployee().getId(), attendance);
        }

        List<AttendanceResponse> responses = employees.stream()
                .map(employee -> attendanceMapper.toResponse(attendanceMap.get(employee.getId()), employee,
                        attendanceDate))
                .toList();

        boolean confirmed = attendances.stream().anyMatch(attendance -> Boolean.TRUE.equals(attendance.getConfirmed()));
        LocalDateTime confirmedAt = attendances.stream()
                .map(Attendance::getConfirmedAt)
                .filter(Objects::nonNull)
                .max(LocalDateTime::compareTo)
                .orElse(null);
        String confirmedBy = attendances.stream()
                .map(Attendance::getConfirmedBy)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);

        ConfirmRuleResult confirmRuleResult = evaluateConfirmRule(attendanceDate, employees);
        boolean canConfirm = !confirmed && confirmRuleResult.canConfirm();

        return AttendanceDailyResponse.builder()
                .attendanceDate(attendanceDate)
                .branchId(accessibleBranchId)
                .branchName(resolveBranchName(accessibleBranchId, responses))
                .totalEmployees(responses.size())
                .confirmed(confirmed)
                .confirmedAt(confirmedAt)
                .confirmedBy(confirmedBy)
                .canConfirm(canConfirm)
                .confirmBlockedReason(confirmed ? "Bảng chấm công đã được chốt" : confirmRuleResult.reason())
                .attendances(responses)
                .build();
    }

    private int normalizeWorkingHours(AttendanceStatus status, Integer workingHours) {
        if (status == AttendanceStatus.ABSENT) {
            return 0;
        }
        if (workingHours != null) {
            return workingHours;
        }
        return DEFAULT_WORKING_HOURS;
    }

    private String resolveBranchName(Long branchId, List<AttendanceResponse> responses) {
        if (branchId == null) {
            return "Tất cả chi nhánh";
        }
        return responses.stream()
                .map(AttendanceResponse::getBranchName)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private int resolveDefaultShiftWorkingHours(Employee employee) {
        if (employee == null || employee.getShift() == null || employee.getShift().getStartTime() == null
                || employee.getShift().getEndTime() == null) {
            return DEFAULT_WORKING_HOURS;
        }

        LocalTime start = employee.getShift().getStartTime();
        LocalTime end = employee.getShift().getEndTime();

        if (start.equals(end)) {
            return DEFAULT_WORKING_HOURS;
        }

        long minutes = start.isBefore(end)
                ? ChronoUnit.MINUTES.between(start, end)
                : ChronoUnit.MINUTES.between(start, LocalTime.MAX) + 1
                        + ChronoUnit.MINUTES.between(LocalTime.MIN, end);

        return (int) Math.max(1, Math.round(minutes / 60.0));
    }

    private ConfirmRuleResult evaluateConfirmRule(LocalDate attendanceDate, List<Employee> employees) {
        LocalDate today = LocalDate.now();

        if (attendanceDate.isAfter(today)) {
            return new ConfirmRuleResult(false, "Không thể chốt công cho ngày ở tương lai");
        }

        if (attendanceDate.isBefore(today)) {
            return new ConfirmRuleResult(true, null);
        }

        LocalTime now = LocalTime.now();
        if (now.isBefore(DAILY_CONFIRM_MIN_TIME)) {
            return new ConfirmRuleResult(false, "Chỉ được chốt công sau 20:00 trong ngày hiện tại");
        }

        boolean hasActiveShift = employees.stream()
                .map(Employee::getShift)
                .filter(Objects::nonNull)
                .filter(shift -> shift.getStartTime() != null && shift.getEndTime() != null)
                .anyMatch(shift -> isTimeInShift(now, shift.getStartTime(), shift.getEndTime()));

        if (hasActiveShift) {
            return new ConfirmRuleResult(false, "Không thể chốt công trong thời gian ca làm việc đang diễn ra");
        }

        return new ConfirmRuleResult(true, null);
    }

    private boolean isTimeInShift(LocalTime now, LocalTime start, LocalTime end) {
        if (start.equals(end)) {
            return true;
        }

        if (start.isBefore(end)) {
            return !now.isBefore(start) && now.isBefore(end);
        }

        return !now.isBefore(start) || now.isBefore(end);
    }

    private record ConfirmRuleResult(boolean canConfirm, String reason) {
    }
}