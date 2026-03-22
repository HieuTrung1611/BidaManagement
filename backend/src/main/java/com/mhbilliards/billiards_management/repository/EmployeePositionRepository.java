
package com.mhbilliards.billiards_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.EmployeePosition;

@Repository
public interface EmployeePositionRepository
        extends JpaRepository<EmployeePosition, Long>, JpaSpecificationExecutor<EmployeePosition> {
    boolean existsByName(String name);

    boolean existsByCode(String code);
}
