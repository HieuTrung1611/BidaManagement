package com.mhbilliards.billiards_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.TableBilliard;

@Repository
public interface TableBilliardRepository extends JpaRepository<TableBilliard, Long> {
    boolean existsByName(String name);
}
