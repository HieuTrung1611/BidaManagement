package com.mhbilliards.billiards_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.Equipment;
import com.mhbilliards.billiards_management.enums.EquipmentType;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long>, JpaSpecificationExecutor<Equipment> {

    @Query("SELECT e FROM Equipment e WHERE e.branch.id = :branchId AND e.isActive = true")
    List<Equipment> findByBranchIdAndIsActiveTrue(@Param("branchId") Long branchId);

    @Query("SELECT e FROM Equipment e WHERE e.type = :type AND e.branch.id = :branchId AND e.isActive = true")
    List<Equipment> findByTypeAndBranchIdAndIsActiveTrue(@Param("type") EquipmentType type,
            @Param("branchId") Long branchId);

    @Query("SELECT e FROM Equipment e WHERE e.availableQuantity > 0 AND e.branch.id = :branchId AND e.isActive = true")
    List<Equipment> findAvailableEquipments(@Param("branchId") Long branchId);
}
