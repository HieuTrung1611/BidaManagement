package com.mhbilliards.billiards_management.service.statistics;

import com.mhbilliards.billiards_management.dto.statistics.ChartDataPointDTO;
import com.mhbilliards.billiards_management.dto.statistics.DashboardOverviewDTO;
import com.mhbilliards.billiards_management.dto.statistics.RevenueStatisticsDTO;
import com.mhbilliards.billiards_management.dto.statistics.SalaryStatisticsDTO;
import com.mhbilliards.billiards_management.enums.InvoiceStatus;
import com.mhbilliards.billiards_management.repository.BilliardSessionRepository;
import com.mhbilliards.billiards_management.repository.InvoiceRepository;
import com.mhbilliards.billiards_management.repository.SalaryRepository;
import com.mhbilliards.billiards_management.service.base.CurrentUserAccessService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatisticsServiceImpl implements StatisticsService {

        private final InvoiceRepository invoiceRepository;
        private final BilliardSessionRepository sessionRepository;
        private final SalaryRepository salaryRepository;
        private final CurrentUserAccessService currentUserAccessService;

        @Override
        public DashboardOverviewDTO getDashboardOverview(Long requestedBranchId) {
                Long branchId = currentUserAccessService.resolveAccessibleBranchId(requestedBranchId);
                LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
                LocalDateTime endOfToday = startOfToday.plusDays(1);

                // Doanh thu hôm nay
                List<Object[]> todaySummaryList = invoiceRepository.getSummaryByDateRange(branchId, startOfToday,
                                endOfToday, InvoiceStatus.COMPLETED);
                Object[] todaySummary = todaySummaryList.isEmpty() ? null : todaySummaryList.get(0);
                double revenueToday = todaySummary != null && todaySummary[0] != null
                                ? ((Number) todaySummary[0]).doubleValue()
                                : 0.0;

                // Doanh thu tháng này
                LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
                List<Object[]> monthSummaryList = invoiceRepository.getSummaryByDateRange(branchId, startOfMonth,
                                endOfToday, InvoiceStatus.COMPLETED);
                Object[] monthSummary = monthSummaryList.isEmpty() ? null : monthSummaryList.get(0);
                double revenueThisMonth = monthSummary != null && monthSummary[0] != null
                                ? ((Number) monthSummary[0]).doubleValue()
                                : 0.0;

                // Số phiên hôm nay
                Long sessionsToday = sessionRepository.countTodaySessions(branchId, startOfToday, endOfToday);

                // Số bàn đang chạy
                Long activeTables = sessionRepository.countActiveSessions(branchId);

                // Chart 7 ngày gần nhất
                LocalDateTime startOf7Days = LocalDate.now().minusDays(6).atStartOfDay();
                List<Object[]> dailyData = invoiceRepository.getDailyRevenue(branchId, startOf7Days, endOfToday,
                                InvoiceStatus.COMPLETED);
                Map<String, Double> dailyMap = dailyData.stream()
                                .collect(Collectors.toMap(
                                                row -> row[0].toString().substring(0, 10),
                                                row -> row[1] != null ? ((Number) row[1]).doubleValue() : 0.0));
                List<ChartDataPointDTO> last7Days = new ArrayList<>();
                for (int i = 6; i >= 0; i--) {
                        LocalDate date = LocalDate.now().minusDays(i);
                        String key = date.format(DateTimeFormatter.ISO_LOCAL_DATE);
                        last7Days.add(ChartDataPointDTO.builder()
                                        .label(date.format(DateTimeFormatter.ofPattern("dd/MM")))
                                        .value(dailyMap.getOrDefault(key, 0.0))
                                        .count(0L)
                                        .build());
                }

                // Chart 12 tháng trong năm hiện tại
                int currentYear = LocalDate.now().getYear();
                List<Object[]> monthlyData = invoiceRepository.getMonthlyRevenue(branchId, currentYear,
                                InvoiceStatus.COMPLETED);
                Map<Integer, Double> monthlyMap = monthlyData.stream()
                                .collect(Collectors.toMap(
                                                row -> ((Number) row[0]).intValue(),
                                                row -> row[1] != null ? ((Number) row[1]).doubleValue() : 0.0));
                List<ChartDataPointDTO> monthly = new ArrayList<>();
                String[] monthNames = { "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12" };
                for (int m = 1; m <= 12; m++) {
                        monthly.add(ChartDataPointDTO.builder()
                                        .label(monthNames[m - 1])
                                        .value(monthlyMap.getOrDefault(m, 0.0))
                                        .count(0L)
                                        .build());
                }

                return DashboardOverviewDTO.builder()
                                .revenueToday(revenueToday)
                                .revenueThisMonth(revenueThisMonth)
                                .sessionsToday(sessionsToday != null ? sessionsToday : 0L)
                                .activeTablesNow(activeTables != null ? activeTables : 0L)
                                .totalCustomersToday(sessionsToday != null ? sessionsToday : 0L)
                                .totalEmployees(0L)
                                .last7DaysRevenue(last7Days)
                                .monthlyRevenue(monthly)
                                .build();
        }

        @Override
        public RevenueStatisticsDTO getMonthlyRevenue(Long requestedBranchId, int year, int month) {
                Long branchId = currentUserAccessService.resolveAccessibleBranchId(requestedBranchId);
                // Breakdown từng ngày trong tháng
                LocalDateTime start = LocalDate.of(year, month, 1).atStartOfDay();
                LocalDateTime end = start.plusMonths(1);

                List<Object[]> dailyData = invoiceRepository.getDailyRevenue(branchId, start, end,
                                InvoiceStatus.COMPLETED);
                List<ChartDataPointDTO> chartData = dailyData.stream()
                                .map(row -> ChartDataPointDTO.builder()
                                                .label(row[0].toString().substring(8, 10) + "/"
                                                                + row[0].toString().substring(5, 7))
                                                .value(row[1] != null ? ((Number) row[1]).doubleValue() : 0.0)
                                                .count(row[2] != null ? ((Number) row[2]).longValue() : 0L)
                                                .build())
                                .collect(Collectors.toList());

                List<Object[]> summaryList = invoiceRepository.getSummaryByDateRange(branchId, start, end,
                                InvoiceStatus.COMPLETED);
                Object[] summary = summaryList.isEmpty() ? null : summaryList.get(0);
                double totalRevenue = summary != null && summary[0] != null ? ((Number) summary[0]).doubleValue() : 0.0;
                long totalInvoices = summary != null && summary[1] != null ? ((Number) summary[1]).longValue() : 0L;

                return RevenueStatisticsDTO.builder()
                                .totalRevenue(totalRevenue)
                                .totalInvoices(totalInvoices)
                                .totalSessions(totalInvoices)
                                .averagePerSession(totalInvoices > 0 ? totalRevenue / totalInvoices : 0.0)
                                .period("month")
                                .periodLabel("Tháng " + month + "/" + year)
                                .chartData(chartData)
                                .build();
        }

        @Override
        public RevenueStatisticsDTO getYearlyRevenue(Long requestedBranchId, int year) {
                Long branchId = currentUserAccessService.resolveAccessibleBranchId(requestedBranchId);
                List<Object[]> monthlyData = invoiceRepository.getMonthlyRevenue(branchId, year,
                                InvoiceStatus.COMPLETED);
                Map<Integer, Object[]> monthMap = monthlyData.stream()
                                .collect(Collectors.toMap(row -> ((Number) row[0]).intValue(), row -> row));

                String[] monthNames = { "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12" };
                List<ChartDataPointDTO> chartData = new ArrayList<>();
                double totalRevenue = 0.0;
                long totalInvoices = 0L;

                for (int m = 1; m <= 12; m++) {
                        double rev = 0.0;
                        long cnt = 0L;
                        if (monthMap.containsKey(m)) {
                                Object[] row = monthMap.get(m);
                                rev = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;
                                cnt = row[2] != null ? ((Number) row[2]).longValue() : 0L;
                        }
                        totalRevenue += rev;
                        totalInvoices += cnt;
                        chartData.add(ChartDataPointDTO.builder()
                                        .label(monthNames[m - 1])
                                        .value(rev)
                                        .count(cnt)
                                        .build());
                }

                return RevenueStatisticsDTO.builder()
                                .totalRevenue(totalRevenue)
                                .totalInvoices(totalInvoices)
                                .totalSessions(totalInvoices)
                                .averagePerSession(totalInvoices > 0 ? totalRevenue / totalInvoices : 0.0)
                                .period("year")
                                .periodLabel("Năm " + year)
                                .chartData(chartData)
                                .build();
        }

        @Override
        public RevenueStatisticsDTO getWeeklyRevenue(Long requestedBranchId, int year) {
                Long branchId = currentUserAccessService.resolveAccessibleBranchId(requestedBranchId);
                List<Object[]> weeklyData = invoiceRepository.getWeeklyRevenue(branchId, year, InvoiceStatus.COMPLETED);
                List<ChartDataPointDTO> chartData = weeklyData.stream()
                                .map(row -> ChartDataPointDTO.builder()
                                                .label("Tuần " + row[0])
                                                .value(row[1] != null ? ((Number) row[1]).doubleValue() : 0.0)
                                                .count(row[2] != null ? ((Number) row[2]).longValue() : 0L)
                                                .build())
                                .collect(Collectors.toList());

                double totalRevenue = chartData.stream().mapToDouble(ChartDataPointDTO::getValue).sum();
                long totalInvoices = chartData.stream().mapToLong(ChartDataPointDTO::getCount).sum();

                return RevenueStatisticsDTO.builder()
                                .totalRevenue(totalRevenue)
                                .totalInvoices(totalInvoices)
                                .totalSessions(totalInvoices)
                                .averagePerSession(totalInvoices > 0 ? totalRevenue / totalInvoices : 0.0)
                                .period("week")
                                .periodLabel("Tuần theo năm " + year)
                                .chartData(chartData)
                                .build();
        }

        @Override
        public SalaryStatisticsDTO getYearlySalaryStats(Long requestedBranchId, int year) {
                Long branchId = currentUserAccessService.resolveAccessibleBranchId(requestedBranchId);
                List<Object[]> monthlyData = salaryRepository.getMonthlySalaryStats(String.valueOf(year), branchId);
                Map<String, Object[]> monthMap = monthlyData.stream()
                                .collect(Collectors.toMap(row -> row[0].toString(), row -> row));

                String[] monthNames = { "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12" };
                List<ChartDataPointDTO> chartData = new ArrayList<>();
                double totalPaid = 0.0;
                double totalPending = 0.0;

                for (int m = 1; m <= 12; m++) {
                        String key = String.format("%02d", m);
                        double total = 0.0;
                        double paid = 0.0;
                        if (monthMap.containsKey(key)) {
                                Object[] row = monthMap.get(key);
                                total = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;
                                paid = row[2] != null ? ((Number) row[2]).doubleValue() : 0.0;
                        }
                        totalPaid += paid;
                        totalPending += (total - paid);
                        chartData.add(ChartDataPointDTO.builder()
                                        .label(monthNames[m - 1])
                                        .value(total)
                                        .count(0L)
                                        .build());
                }

                return SalaryStatisticsDTO.builder()
                                .year(year)
                                .totalSalaryPaid(totalPaid)
                                .totalSalaryPending(totalPending)
                                .totalEmployees(0L)
                                .chartData(chartData)
                                .build();
        }

        @Override
        public SalaryStatisticsDTO getMonthlySalaryStats(Long requestedBranchId, int year, int month) {
                Long branchId = currentUserAccessService.resolveAccessibleBranchId(requestedBranchId);
                String salaryMonth = String.format("%d-%02d", year, month);
                List<Object[]> summaryList = salaryRepository.getSalarySummaryByMonth(salaryMonth, branchId);
                Object[] summary = summaryList.isEmpty() ? null : summaryList.get(0);

                double totalSalary = summary != null && summary[0] != null ? ((Number) summary[0]).doubleValue() : 0.0;
                double paidSalary = summary != null && summary[1] != null ? ((Number) summary[1]).doubleValue() : 0.0;
                long employeeCount = summary != null && summary[2] != null ? ((Number) summary[2]).longValue() : 0L;

                return SalaryStatisticsDTO.builder()
                                .year(year)
                                .month(month)
                                .totalSalaryPaid(paidSalary)
                                .totalSalaryPending(totalSalary - paidSalary)
                                .totalEmployees(employeeCount)
                                .chartData(new ArrayList<>())
                                .build();
        }
}
