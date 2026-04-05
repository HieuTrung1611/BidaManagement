package com.mhbilliards.billiards_management.service.attendance;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mhbilliards.billiards_management.dto.attendance.AttendanceDailyResponse;
import com.mhbilliards.billiards_management.dto.attendance.AttendanceDailyUpsertRequest;
import com.mhbilliards.billiards_management.dto.attendance.AttendanceResponse;
import com.mhbilliards.billiards_management.dto.attendance.AttendanceUpsertItemRequest;
import com.mhbilliards.billiards_management.entity.Attendance;
import com.mhbilliards.billiards_management.entity.Employee;
import com.mhbilliards.billiards_management.enums.AttendanceStatus;
import com.mhbilliards.billiards_management.repository.AttendanceRepository;
import com.mhbilliards.billiards_management.repository.EmployeeRepository;
import com.mhbilliards.billiards_management.service.base.CurrentUserAccessService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private static final int DEFAULT_WORKING_HOURS = 8;

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final CurrentUserAccessService currentUserAccessService;

    @Override
    @Transactional
    public AttendanceDailyResponse upsertDailyAttendance(AttendanceDailyUpsertRequest request) {
        LocalDate attendanceDate = request.getAttendanceDate();
        if (attendanceDate.isAfter(LocalDate.now())) {
            throw new RuntimeException("Không thể chấm công cho ngày ở tương lai");
        }

        Long branchId = currentUserAccessService.resolveAccessibleBranchId(request.getBranchId());
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
                throw new RuntimeException("Mỗi lần chấm công chỉ được thao tác với nhân viên trong cùng một chi nhánh");
            }
            employeeMap.put(employee.getId(), employee);
        }

        for (AttendanceUpsertItemRequest item : items) {
            Employee employee = employeeMap.get(item.getEmployeeId());
            Attendance attendance = attendanceRepository.findByEmployeeIdAndAttendanceDate(employee.getId(), attendanceDate)
                    .orElseGet(() -> Attendance.builder()
                            .employee(employee)
                            .attendanceDate(attendanceDate)
                            .build());

            attendance.setEmployee(employee);
            attendance.setAttendanceDate(attendanceDate);
            attendance.setStatus(item.getStatus());
            attendance.setWorkingHours(normalizeWorkingHours(item.getStatus(), item.getWorkingHours()));
            attendance.setNotes(trimToNull(item.getNotes()));
            attendanceRepository.save(attendance);
        }

        return getDailyAttendance(attendanceDate, branchId);
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceDailyResponse getDailyAttendance(LocalDate attendanceDate, Long branchId) {
        Long accessibleBranchId = currentUserAccessService.resolveAccessibleBranchId(branchId);

        List<Employee> employees = employeeRepository.findActiveEmployeesByBranchId(accessibleBranchId);
        List<Attendance> attendances = attendanceRepository.findDetailedByAttendanceDate(attendanceDate, accessibleBranchId);

        Map<Long, Attendance> attendanceMap = new HashMap<>();
        for (Attendance attendance : attendances) {
            attendanceMap.put(attendance.getEmployee().getId(), attendance);
        }

        List<AttendanceResponse> responses = employees.stream()
                .map(employee -> toResponse(attendanceMap.get(employee.getId()), employee, attendanceDate))
                .toList();

        return AttendanceDailyResponse.builder()
                .attendanceDate(attendanceDate)
                .branchId(accessibleBranchId)
                .branchName(resolveBranchName(accessibleBranchId, responses))
                .totalEmployees(responses.size())
                .attendances(responses)
                .build();
    }

    private AttendanceResponse toResponse(Attendance attendance, Employee employee, LocalDate attendanceDate) {
        return AttendanceResponse.builder()
                .id(attendance != null ? attendance.getId() : null)
                .employeeId(employee.getId())
                .employeeName(employee.getName())
                .positionName(employee.getPosition() != null ? employee.getPosition().getName() : null)
                .branchId(employee.getBranch() != null ? employee.getBranch().getId() : null)
                .branchName(employee.getBranch() != null ? employee.getBranch().getName() : null)
                .attendanceDate(attendanceDate)
                .status(attendance != null ? attendance.getStatus() : null)
                .workingHours(attendance != null ? attendance.getWorkingHours() : 0)
                .notes(attendance != null ? attendance.getNotes() : null)
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
}