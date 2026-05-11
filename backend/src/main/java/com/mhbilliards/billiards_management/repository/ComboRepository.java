package com.mhbilliards.billiards_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.Combo;

@Repository
public interface ComboRepository extends JpaRepository<Combo, Long>, JpaSpecificationExecutor<Combo> {

    @Query("SELECT c FROM Combo c WHERE c.branch.id = :branchId")
    List<Combo> findByBranchId(@Param("branchId") Long branchId);
}
