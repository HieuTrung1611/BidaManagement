package com.mhbilliards.billiards_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.TableBilliardType;

@Repository
public interface TableBilliardTypeRepository extends JpaRepository<TableBilliardType, Long> {
    boolean existsByName(String name);
}