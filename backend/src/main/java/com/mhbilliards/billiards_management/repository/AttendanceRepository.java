package com.mhbilliards.billiards_management.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.Attendance;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByEmployeeIdAndAttendanceDate(Long employeeId, LocalDate attendanceDate);

    @Query("""
            select a
            from Attendance a
            join fetch a.employee e
            join fetch e.branch
            join fetch e.position
            where a.attendanceDate = :attendanceDate
            and (:branchId is null or e.branch.id = :branchId)
            order by e.branch.name asc, e.name asc
            """)
    List<Attendance> findDetailedByAttendanceDate(@Param("attendanceDate") LocalDate attendanceDate,
            @Param("branchId") Long branchId);

    @Query("""
            select a
            from Attendance a
            join fetch a.employee e
            join fetch e.branch
            join fetch e.position
            where a.attendanceDate between :startDate and :endDate
            and (:branchId is null or e.branch.id = :branchId)
            order by e.branch.name asc, e.name asc, a.attendanceDate asc
            """)
    List<Attendance> findDetailedByDateRange(@Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("branchId") Long branchId);
}