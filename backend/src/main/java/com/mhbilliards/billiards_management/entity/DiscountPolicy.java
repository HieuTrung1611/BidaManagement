package com.mhbilliards.billiards_management.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/**
 * Entity để quản lý chính sách giảm giá đặc biệt
 * Ngoài discount theo rank của khách hàng, có thể có các chương trình khuyến
 * mãi khác
 */
@Entity
@Table(name = "discount_policies")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DiscountPolicy extends BaseEntity {
    @Column(nullable = false)
    String name; // Tên chương trình khuyến mãi

    String description;

    @Column(nullable = false)
    Double discountPercent; // Phần trăm giảm

    @Column(nullable = false)
    LocalDate startDate;

    @Column(nullable = false)
    LocalDate endDate;

    Long minAmount; // Giá trị tối thiểu để áp dụng discount

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @Builder.Default
    Boolean isActive = true;
}
