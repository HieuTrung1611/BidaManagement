package com.mhbilliards.billiards_management.entity;

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
 * Entity để quản lý các chi phí hoặc phí tính theo phút/giờ chơi
 * Ví dụ: nếu chơi quá giờ, có thể áp dụng chi phí phụ
 */
@Entity
@Table(name = "extra_charges")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExtraCharge extends BaseEntity {
    @Column(nullable = false)
    String name; // Tên khoảng

    String description;

    @Column(nullable = false)
    Double chargeAmount; // Số tiền phụ phí

    @Column(nullable = false)
    String chargeType; // "PER_HOUR", "PER_MINUTE", "FIXED"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @Builder.Default
    Boolean isActive = true;
}
