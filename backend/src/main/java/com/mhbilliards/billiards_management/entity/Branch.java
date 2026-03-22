package com.mhbilliards.billiards_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "branches")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Branch extends BaseEntity {
    @Column(nullable = false, unique = true)
    String name;
    @Column(nullable = false)
    String address;
    @Column(nullable = false)
    String phoneNumber;
    String description;

    @Builder.Default
    @Column(nullable = false)
    Boolean isActive = true;
}
