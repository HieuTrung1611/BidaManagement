package com.mhbilliards.billiards_management.entity;

import com.mhbilliards.billiards_management.enums.ServiceType;

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
@Table(name = "services")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Service extends BaseEntity {
    @Column(nullable = false)
    String name; // Tên dịch vụ

    String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ServiceType type;

    @Column(nullable = false)
    Double price; // Giá dịch vụ

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @Builder.Default
    Boolean isActive = true;
}
