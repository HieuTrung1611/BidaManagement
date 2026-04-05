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
@Table(name = "combos")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Combo extends BaseEntity {
    @Column(nullable = false)
    String name; // Tên combo

    String description;

    @Column(nullable = false)
    Integer durationHours; // Số giờ chơi

    @Column(nullable = false)
    Double price; // Giá combo

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @Builder.Default
    Boolean isActive = true;
}
