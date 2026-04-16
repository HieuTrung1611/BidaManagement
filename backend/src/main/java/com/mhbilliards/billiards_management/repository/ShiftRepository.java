package com.mhbilliards.billiards_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.Shift;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {
    boolean existsByCode(String code);
}
