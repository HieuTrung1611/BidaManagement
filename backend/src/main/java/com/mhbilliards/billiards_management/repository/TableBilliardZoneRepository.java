package com.mhbilliards.billiards_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.TableBilliardZone;

@Repository
public interface TableBilliardZoneRepository extends JpaRepository<TableBilliardZone, Long> {
    boolean existsByName(String name);
}
