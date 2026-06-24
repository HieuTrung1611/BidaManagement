package com.mhbilliards.billiards_management.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.Invoice;
import com.mhbilliards.billiards_management.enums.InvoiceStatus;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findBySessionId(Long sessionId);

    List<Invoice> findByCustomerId(Long customerId);

    List<Invoice> findByBranchId(Long branchId);

    Page<Invoice> findByBranchIdAndStatus(Long branchId, InvoiceStatus status, Pageable pageable);

    @Query("SELECT i FROM Invoice i WHERE i.branch.id = :branchId " +
            "AND i.invoiceDate >= :startDate AND i.invoiceDate <= :endDate")
    List<Invoice> findByBranchAndDateRange(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(i.totalAmount) FROM Invoice i " +
            "WHERE i.branch.id = :branchId " +
            "AND i.status = :status " +
            "AND i.invoiceDate >= :startDate AND i.invoiceDate <= :endDate")
    Double getTotalRevenueByBranchAndDateRange(
            @Param("branchId") Long branchId,
            @Param("status") InvoiceStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(i) FROM Invoice i " +
            "WHERE i.branch.id = :branchId " +
            "AND i.invoiceDate >= :startDate AND i.invoiceDate <= :endDate")
    Long countInvoicesByBranchAndDateRange(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // ===== STATISTICS QUERIES =====

    /**
     * Doanh thu theo từng tháng trong năm (group by month)
     */
    @Query("SELECT MONTH(i.invoiceDate) as month, SUM(i.totalAmount) as revenue, COUNT(i) as invoiceCount " +
            "FROM Invoice i " +
            "WHERE (:branchId IS NULL OR i.branch.id = :branchId) " +
            "AND YEAR(i.invoiceDate) = :year " +
            "AND i.status = com.mhbilliards.billiards_management.enums.InvoiceStatus.PAID " +
            "GROUP BY MONTH(i.invoiceDate) " +
            "ORDER BY MONTH(i.invoiceDate)")
    List<Object[]> getMonthlyRevenue(
            @Param("branchId") Long branchId,
            @Param("year") int year);

    /**
     * Doanh thu theo từng tuần trong năm (group by week)
     */
    @Query("SELECT WEEK(i.invoiceDate) as week, SUM(i.totalAmount) as revenue, COUNT(i) as invoiceCount " +
            "FROM Invoice i " +
            "WHERE (:branchId IS NULL OR i.branch.id = :branchId) " +
            "AND YEAR(i.invoiceDate) = :year " +
            "AND i.status = com.mhbilliards.billiards_management.enums.InvoiceStatus.PAID " +
            "GROUP BY WEEK(i.invoiceDate) " +
            "ORDER BY WEEK(i.invoiceDate)")
    List<Object[]> getWeeklyRevenue(
            @Param("branchId") Long branchId,
            @Param("year") int year);

    /**
     * Doanh thu theo từng ngày trong khoảng thời gian
     */
    @Query("SELECT DATE(i.invoiceDate) as date, SUM(i.totalAmount) as revenue, COUNT(i) as invoiceCount " +
            "FROM Invoice i " +
            "WHERE (:branchId IS NULL OR i.branch.id = :branchId) " +
            "AND i.invoiceDate >= :startDate AND i.invoiceDate <= :endDate " +
            "AND i.status = com.mhbilliards.billiards_management.enums.InvoiceStatus.PAID " +
            "GROUP BY DATE(i.invoiceDate) " +
            "ORDER BY DATE(i.invoiceDate)")
    List<Object[]> getDailyRevenue(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Tổng doanh thu và số hóa đơn trong khoảng thời gian
     */
    @Query("SELECT SUM(i.totalAmount), COUNT(i) FROM Invoice i " +
            "WHERE (:branchId IS NULL OR i.branch.id = :branchId) " +
            "AND i.invoiceDate >= :startDate AND i.invoiceDate <= :endDate " +
            "AND i.status = com.mhbilliards.billiards_management.enums.InvoiceStatus.PAID")
    List<Object[]> getSummaryByDateRange(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Đếm số phiên hôm nay theo branch
     */
    @Query("SELECT COUNT(i) FROM Invoice i " +
            "WHERE (:branchId IS NULL OR i.branch.id = :branchId) " +
            "AND i.invoiceDate >= :startDate AND i.invoiceDate <= :endDate")
    Long countSessionsToday(
            @Param("branchId") Long branchId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}

