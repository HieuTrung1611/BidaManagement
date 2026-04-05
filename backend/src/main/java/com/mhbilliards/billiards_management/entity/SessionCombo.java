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

@Entity
@Table(name = "session_combos")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SessionCombo extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    BilliardSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "combo_id", nullable = false)
    Combo combo;

    @Column(nullable = false)
    Integer quantity; // Số lượng combo

    @Column(nullable = false)
    Double price; // Giá combo tại thời điểm đặt

    @Column(nullable = false)
    Double totalAmount; // Tổng = quantity * price
}
