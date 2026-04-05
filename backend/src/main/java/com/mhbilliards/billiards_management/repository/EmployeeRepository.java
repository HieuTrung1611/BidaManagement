package com.mhbilliards.billiards_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {
    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    Optional<Employee> findByEmail(String email);

    @Query("""
            select e
            from Employee e
            join fetch e.branch
            join fetch e.position
            where e.email = :email
            """)
    Optional<Employee> findDetailedByEmail(@Param("email") String email);

    @Query("""
            select e
            from Employee e
            join fetch e.branch
            join fetch e.position
            where e.id in :ids
            and e.isActive = true
            order by e.name asc
            """)
    List<Employee> findAllDetailedByIdIn(@Param("ids") List<Long> ids);

    @Query("""
            select e
            from Employee e
            join fetch e.branch
            join fetch e.position
            where (:branchId is null or e.branch.id = :branchId)
            and e.isActive = true
            order by e.branch.name asc, e.name asc
            """)
    List<Employee> findActiveEmployeesByBranchId(@Param("branchId") Long branchId);
}
