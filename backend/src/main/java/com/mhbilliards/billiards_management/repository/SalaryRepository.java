package com.mhbilliards.billiards_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.Salary;

@Repository
public interface SalaryRepository extends JpaRepository<Salary, Long>, JpaSpecificationExecutor<Salary> {
    Optional<Salary> findByEmployeeIdAndSalaryMonth(Long employeeId, String salaryMonth);

    @Query("""
            select s
            from Salary s
            join fetch s.employee e
            join fetch e.branch
            join fetch e.position
            where s.salaryMonth = :salaryMonth
            and (:branchId is null or e.branch.id = :branchId)
            order by e.branch.name asc, e.name asc
            """)
    List<Salary> findDetailedBySalaryMonth(@Param("salaryMonth") String salaryMonth,
            @Param("branchId") Long branchId);
}