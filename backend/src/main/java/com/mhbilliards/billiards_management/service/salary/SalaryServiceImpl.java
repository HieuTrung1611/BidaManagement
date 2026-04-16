package com.mhbilliards.billiards_management.service.salary;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mhbilliards.billiards_management.dto.salary.SalaryBranchSummaryResponse;
import com.mhbilliards.billiards_management.dto.salary.SalaryResponse;
import com.mhbilliards.billiards_management.dto.salary.SalarySummaryResponse;
import com.mhbilliards.billiards_management.entity.Attendance;
import com.mhbilliards.billiards_management.entity.Employee;
import com.mhbilliards.billiards_management.entity.Salary;
import com.mhbilliards.billiards_management.enums.AttendanceStatus;
import com.mhbilliards.billiards_management.enums.SalaryType;
import com.mhbilliards.billiards_management.mapper.SalaryMapper;
import com.mhbilliards.billiards_management.repository.AttendanceRepository;
import com.mhbilliards.billiards_management.repository.EmployeeRepository;
import com.mhbilliards.billiards_management.repository.SalaryRepository;
import com.mhbilliards.billiards_management.service.base.CurrentUserAccessService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SalaryServiceImpl implements SalaryService {

        private static final BigDecimal STANDARD_WORKING_HOURS = BigDecimal.valueOf(8);

        private final SalaryRepository salaryRepository;
        private final AttendanceRepository attendanceRepository;
        private final EmployeeRepository employeeRepository;
        private final CurrentUserAccessService currentUserAccessService;
        private final SalaryMapper salaryMapper;

        @Override
        @Transactional
        public SalarySummaryResponse calculateMonthlySalaries(String salaryMonth, Long branchId) {
                YearMonth targetMonth = resolveSalaryMonth(salaryMonth);
                Long accessibleBranchId = currentUserAccessService.resolveAccessibleBranchId(branchId);
                LocalDate fromDate = targetMonth.atDay(1);
                LocalDate toDate = resolveEndDate(targetMonth);

                List<Employee> employees = employeeRepository.findActiveEmployeesByBranchId(accessibleBranchId);
                List<Attendance> attendances = attendanceRepository.findDetailedByDateRange(fromDate, toDate,
                                accessibleBranchId);

                Map<Long, List<Attendance>> attendanceByEmployeeId = attendances.stream()
                                .collect(Collectors.groupingBy(attendance -> attendance.getEmployee().getId(),
                                                LinkedHashMap::new,
                                                Collectors.toList()));

                List<Salary> savedSalaries = employees.stream()
                                .map(employee -> buildAndPersistSalary(employee, targetMonth,
                                                attendanceByEmployeeId.get(employee.getId())))
                                .sorted(Comparator.comparing(
                                                (Salary salary) -> salary.getEmployee().getBranch().getName())
                                                .thenComparing(salary -> salary.getEmployee().getName()))
                                .toList();

                return buildSummary(savedSalaries, targetMonth, fromDate, toDate, accessibleBranchId);
        }

        @Override
        @Transactional(readOnly = true)
        public SalarySummaryResponse getMonthlySalaries(String salaryMonth, Long branchId) {
                YearMonth targetMonth = resolveSalaryMonth(salaryMonth);
                Long accessibleBranchId = currentUserAccessService.resolveAccessibleBranchId(branchId);
                List<Salary> salaries = salaryRepository.findDetailedBySalaryMonth(targetMonth.toString(),
                                accessibleBranchId);
                return buildSummary(salaries, targetMonth, targetMonth.atDay(1), resolveEndDate(targetMonth),
                                accessibleBranchId);
        }

        private Salary buildAndPersistSalary(Employee employee, YearMonth targetMonth, List<Attendance> attendances) {
                List<Attendance> employeeAttendances = attendances == null ? List.of() : attendances;

                int workingHours = employeeAttendances.stream()
                                .filter(attendance -> attendance.getStatus() != AttendanceStatus.ABSENT)
                                .map(Attendance::getWorkingHours)
                                .filter(Objects::nonNull)
                                .mapToInt(Integer::intValue)
                                .sum();

                int workingDays = (int) employeeAttendances.stream()
                                .filter(attendance -> attendance.getStatus() != AttendanceStatus.ABSENT)
                                .filter(attendance -> attendance.getWorkingHours() != null
                                                && attendance.getWorkingHours() > 0)
                                .count();

                BigDecimal equivalentWorkingDays = BigDecimal.valueOf(workingHours)
                                .divide(STANDARD_WORKING_HOURS, 4, RoundingMode.HALF_UP);
                BigDecimal salaryAmount = calculateSalaryAmount(employee, targetMonth, workingHours,
                                equivalentWorkingDays);

                Salary salary = salaryRepository
                                .findByEmployeeIdAndSalaryMonth(employee.getId(), targetMonth.toString())
                                .orElseGet(() -> Salary.builder()
                                                .employee(employee)
                                                .salaryMonth(targetMonth.toString())
                                                .bonus(0.0)
                                                .deduction(0.0)
                                                .isPaid(false)
                                                .build());

                salary.setEmployee(employee);
                salary.setSalaryMonth(targetMonth.toString());
                salary.setBaseSalary(resolveBaseSalaryValue(employee));
                salary.setWorkingDays(workingDays);
                salary.setWorkingHours(workingHours);

                BigDecimal totalSalary = salaryAmount
                                .add(BigDecimal.valueOf(salary.getBonus() == null ? 0.0 : salary.getBonus()))
                                .subtract(BigDecimal
                                                .valueOf(salary.getDeduction() == null ? 0.0 : salary.getDeduction()));

                salary.setTotalSalary(roundCurrency(totalSalary.max(BigDecimal.ZERO)));
                return salaryRepository.save(salary);
        }

        private BigDecimal calculateSalaryAmount(Employee employee, YearMonth targetMonth, int workingHours,
                        BigDecimal equivalentWorkingDays) {
                SalaryType salaryType = employee.getSalaryType() == null ? SalaryType.FIXED : employee.getSalaryType();
                BigDecimal baseSalary = BigDecimal.valueOf(resolveBaseSalaryValue(employee));

                return switch (salaryType) {
                        case HOURLY -> baseSalary.multiply(BigDecimal.valueOf(workingHours));
                        case FIXED, COMMISSION -> {
                                BigDecimal dailyRate = baseSalary.divide(
                                                BigDecimal.valueOf(targetMonth.lengthOfMonth()), 4,
                                                RoundingMode.HALF_UP);
                                yield dailyRate.multiply(equivalentWorkingDays);
                        }
                };
        }

        private double resolveBaseSalaryValue(Employee employee) {
                if (employee.getSalaryType() == SalaryType.HOURLY) {
                        if (employee.getBaseSalary() != null && employee.getBaseSalary() > 0) {
                                return employee.getBaseSalary();
                        }
                        if (employee.getPosition() != null && employee.getPosition().getHourlyRate() != null) {
                                return employee.getPosition().getHourlyRate();
                        }
                        return 0.0;
                }
                return employee.getBaseSalary() == null ? 0.0 : employee.getBaseSalary();
        }

        private SalarySummaryResponse buildSummary(List<Salary> salaries, YearMonth targetMonth, LocalDate fromDate,
                        LocalDate toDate, Long branchId) {
                List<SalaryResponse> salaryResponses = salaries.stream()
                                .map(salaryMapper::toResponse)
                                .toList();

                List<SalaryBranchSummaryResponse> branchSummaries = salaryResponses.stream()
                                .collect(Collectors.groupingBy(SalaryResponse::getBranchId, LinkedHashMap::new,
                                                Collectors.toList()))
                                .values()
                                .stream()
                                .map(this::toBranchSummary)
                                .toList();

                int totalWorkingDays = salaryResponses.stream()
                                .map(SalaryResponse::getWorkingDays)
                                .filter(Objects::nonNull)
                                .mapToInt(Integer::intValue)
                                .sum();

                int totalWorkingHours = salaryResponses.stream()
                                .map(SalaryResponse::getWorkingHours)
                                .filter(Objects::nonNull)
                                .mapToInt(Integer::intValue)
                                .sum();

                double totalSalary = roundCurrency(BigDecimal.valueOf(salaryResponses.stream()
                                .map(SalaryResponse::getTotalSalary)
                                .filter(Objects::nonNull)
                                .mapToDouble(Double::doubleValue)
                                .sum()));

                return SalarySummaryResponse.builder()
                                .salaryMonth(targetMonth.toString())
                                .fromDate(fromDate)
                                .toDate(toDate)
                                .branchId(branchId)
                                .branchName(resolveBranchName(branchId, salaryResponses))
                                .employeeCount(salaryResponses.size())
                                .totalWorkingDays(totalWorkingDays)
                                .totalWorkingHours(totalWorkingHours)
                                .totalSalary(totalSalary)
                                .branchSummaries(branchSummaries)
                                .salaries(salaryResponses)
                                .build();
        }

        private SalaryBranchSummaryResponse toBranchSummary(List<SalaryResponse> salaries) {
                SalaryResponse first = salaries.getFirst();
                int totalWorkingDays = salaries.stream()
                                .map(SalaryResponse::getWorkingDays)
                                .filter(Objects::nonNull)
                                .mapToInt(Integer::intValue)
                                .sum();

                int totalWorkingHours = salaries.stream()
                                .map(SalaryResponse::getWorkingHours)
                                .filter(Objects::nonNull)
                                .mapToInt(Integer::intValue)
                                .sum();

                double totalSalary = roundCurrency(BigDecimal.valueOf(salaries.stream()
                                .map(SalaryResponse::getTotalSalary)
                                .filter(Objects::nonNull)
                                .mapToDouble(Double::doubleValue)
                                .sum()));

                return SalaryBranchSummaryResponse.builder()
                                .branchId(first.getBranchId())
                                .branchName(first.getBranchName())
                                .employeeCount(salaries.size())
                                .totalWorkingDays(totalWorkingDays)
                                .totalWorkingHours(totalWorkingHours)
                                .totalSalary(totalSalary)
                                .build();
        }

        private YearMonth resolveSalaryMonth(String salaryMonth) {
                if (salaryMonth == null || salaryMonth.isBlank()) {
                        return YearMonth.now();
                }

                try {
                        YearMonth month = YearMonth.parse(salaryMonth.trim());
                        if (month.isAfter(YearMonth.now())) {
                                throw new RuntimeException("Không thể tính lương cho tháng ở tương lai");
                        }
                        return month;
                } catch (DateTimeParseException ex) {
                        throw new RuntimeException("Định dạng tháng lương không hợp lệ. Dùng định dạng YYYY-MM");
                }
        }

        private LocalDate resolveEndDate(YearMonth targetMonth) {
                YearMonth currentMonth = YearMonth.now();
                if (targetMonth.equals(currentMonth)) {
                        return LocalDate.now();
                }
                return targetMonth.atEndOfMonth();
        }

        private String resolveBranchName(Long branchId, List<SalaryResponse> salaries) {
                if (branchId == null) {
                        return "Tất cả chi nhánh";
                }
                return salaries.stream()
                                .map(SalaryResponse::getBranchName)
                                .filter(Objects::nonNull)
                                .findFirst()
                                .orElse(null);
        }

        private double roundCurrency(BigDecimal value) {
                return value.setScale(2, RoundingMode.HALF_UP).doubleValue();
        }
}