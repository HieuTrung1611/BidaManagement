package com.mhbilliards.billiards_management.entity;

import com.mhbilliards.billiards_management.enums.ComboItemType;

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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

/**
 * Entity quản lý các item trong combo (thay thế ComboService)
 * Combo có thể bao gồm Product (đồ ăn/uống) hoặc Equipment (thiết bị)
 */
@Entity
@Table(name = "combo_items")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ComboItem extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "combo_id", nullable = false)
    Combo combo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ComboItemType itemType; // PRODUCT, EQUIPMENT

    @Column(nullable = false)
    Long itemId; // ID của Product hoặc Equipment

    @Column(nullable = false)
    Integer quantity; // Số lượng item trong combo
}
