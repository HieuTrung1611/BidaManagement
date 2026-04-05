package com.mhbilliards.billiards_management.entity;

import com.mhbilliards.billiards_management.enums.CustomerRank;

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
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "customers")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Customer extends BaseEntity {
    @Column(nullable = false)
    String name;

    @Column(unique = true, nullable = false)
    String email;

    @Column(unique = true, nullable = false)
    String phoneNumber;

    String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    CustomerRank rank = CustomerRank.BRONZE;

    @Column(nullable = false)
    @Builder.Default
    Long totalSpent = 0L; // Tổng tiền đã chi tiêu

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @Builder.Default
    Boolean isActive = true;
}
