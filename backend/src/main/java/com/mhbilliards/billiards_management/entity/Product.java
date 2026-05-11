package com.mhbilliards.billiards_management.entity;

import com.mhbilliards.billiards_management.enums.ProductType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder.Default;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

/**
 * Entity quản lý sản phẩm (đồ ăn/uống) - có tồn kho
 */
@Entity
@Table(name = "products")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Product extends BaseEntity {
    @Column(nullable = false)
    String name;

    String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ProductType type; // FOOD, BEVERAGE

    @Column(nullable = false)
    Double purchasePrice; // Giá nhập

    @Column(nullable = false)
    Double salePrice; // Giá bán

    @Column(nullable = false)
    Integer stockQuantity; // Số lượng tồn kho

    String unit; // Đơn vị: chai, ly, phần, ...

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @Default
    @Column(nullable = false)
    Boolean isActive = true;
}
