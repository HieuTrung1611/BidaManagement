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

        /**
         * Thống kê tổng lương theo từng tháng trong năm
         */
        @Query("""
                        select SUBSTRING(s.salaryMonth, 6, 2) as month,
                               SUM(s.totalSalary) as totalSalary,
                               SUM(CASE WHEN s.isPaid = true THEN s.totalSalary ELSE 0 END) as paidSalary,
                               SUM(CASE WHEN s.isPaid = false THEN s.totalSalary ELSE 0 END) as pendingSalary,
                               COUNT(s) as employeeCount
                        from Salary s
                        join s.employee e
                        where SUBSTRING(s.salaryMonth, 1, 4) = :year
                        and (:branchId is null or e.branch.id = :branchId)
                        group by SUBSTRING(s.salaryMonth, 6, 2)
                        order by SUBSTRING(s.salaryMonth, 6, 2)
                        """)
        List<Object[]> getMonthlySalaryStats(
                        @Param("year") String year,
                        @Param("branchId") Long branchId);

        /**
         * Tổng lương trong 1 tháng cụ thể
         */
        @Query("""
                        select SUM(s.totalSalary), 
                               SUM(CASE WHEN s.isPaid = true THEN s.totalSalary ELSE 0 END),
                               COUNT(distinct s.employee.id)
                        from Salary s
                        join s.employee e
                        where s.salaryMonth = :salaryMonth
                        and (:branchId is null or e.branch.id = :branchId)
                        """)
        List<Object[]> getSalarySummaryByMonth(
                        @Param("salaryMonth") String salaryMonth,
                        @Param("branchId") Long branchId);
}