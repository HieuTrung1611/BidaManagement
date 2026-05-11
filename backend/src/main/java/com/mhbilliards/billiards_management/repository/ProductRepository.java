package com.mhbilliards.billiards_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.Product;
import com.mhbilliards.billiards_management.enums.ProductType;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @Query("SELECT p FROM Product p WHERE p.branch.id = :branchId AND p.isActive = true")
    List<Product> findByBranchIdAndIsActiveTrue(@Param("branchId") Long branchId);

    @Query("SELECT p FROM Product p WHERE p.type = :type AND p.branch.id = :branchId AND p.isActive = true")
    List<Product> findByTypeAndBranchIdAndIsActiveTrue(@Param("type") ProductType type,
            @Param("branchId") Long branchId);

    @Query("SELECT p FROM Product p WHERE p.stockQuantity < 10 AND p.branch.id = :branchId AND p.isActive = true")
    List<Product> findLowStockProducts(@Param("branchId") Long branchId);
}
