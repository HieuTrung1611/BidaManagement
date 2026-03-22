package com.mhbilliards.billiards_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.Branch;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {
    boolean existsByName(String name);

}
