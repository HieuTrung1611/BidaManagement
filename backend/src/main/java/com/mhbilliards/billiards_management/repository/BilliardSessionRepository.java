package com.mhbilliards.billiards_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.BilliardSession;
import com.mhbilliards.billiards_management.enums.SessionStatus;

@Repository
public interface BilliardSessionRepository
        extends JpaRepository<BilliardSession, Long>, JpaSpecificationExecutor<BilliardSession> {

    @Query("SELECT bs FROM BilliardSession bs WHERE bs.table.id = :tableId")
    List<BilliardSession> findByTableId(@Param("tableId") Long tableId);

    @Query("SELECT bs FROM BilliardSession bs WHERE bs.customer.id = :customerId")
    List<BilliardSession> findByCustomerId(@Param("customerId") Long customerId);

    @Query("SELECT bs FROM BilliardSession bs WHERE bs.status = :status")
    List<BilliardSession> findByStatus(@Param("status") SessionStatus status);

    @Query("SELECT bs FROM BilliardSession bs WHERE bs.branch.id = :branchId")
    List<BilliardSession> findByBranchId(@Param("branchId") Long branchId);
}
