package com.mhbilliards.billiards_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.TableBilliardPricingConfig;

@Repository
public interface TableBilliardPricingConfigRepository extends JpaRepository<TableBilliardPricingConfig, Long> {

}
