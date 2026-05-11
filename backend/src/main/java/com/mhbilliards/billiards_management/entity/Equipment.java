package com.mhbilliards.billiards_management.entity;

import com.mhbilliards.billiards_management.enums.EquipmentType;

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
 * Entity quản lý thiết bị cho thuê (gậy, phấn, găng tay...)
 */
@Entity
@Table(name = "equipments")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Equipment extends BaseEntity {
    @Column(nullable = false)
    String name; // VD: Gậy loại A, Gậy VIP, Phấn

    String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    EquipmentType type; // STICK, CHALK, GLOVES, ...

    @Column(nullable = false)
    Double rentalPricePerHour; // Giá thuê/giờ

    @Column(nullable = false)
    Integer totalQuantity; // Tổng số lượng thiết bị có

    @Column(nullable = false)
    Integer availableQuantity; // Số lượng đang available (không đang thuê)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @Default
    @Column(nullable = false)
    Boolean isActive = true;
}
