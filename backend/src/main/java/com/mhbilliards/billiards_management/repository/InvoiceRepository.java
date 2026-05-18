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
}
