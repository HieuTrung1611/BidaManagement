package com.mhbilliards.billiards_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.Branch;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long>, JpaSpecificationExecutor<Branch> {
    boolean existsByName(String name);

    @Query("SELECT e.name AS managerName, e.phoneNumber AS managerPhoneNumber "
            + "FROM Branch b "
            + "JOIN b.employees e "
            + "JOIN e.position p "
            + "WHERE b.id = :branchId "
            + "AND p.code = :managerCode")
    Optional<BranchManagerContact> findManagerContactByBranchId(@Param("branchId") Long branchId,
            @Param("managerCode") String managerCode);

    interface BranchManagerContact {
        String getManagerName();

        String getManagerPhoneNumber();
    }
}
