package com.mhbilliards.billiards_management.entity;

import java.time.LocalDate;

import com.mhbilliards.billiards_management.enums.SalaryType;

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
@Table(name = "employees")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Employee extends BaseEntity {
    @Column(nullable = false)
    String name;

    @Column(unique = true, nullable = false)
    String email;

    @Column(unique = true, nullable = false)
    String phoneNumber;

    LocalDate dob;

    String address;

    @Column(unique = true)
    String identityNumber; // Chứng minh nhân dân / CCCD

    String bankAccount; // Số tài khoản ngân hàng

    String bankName; // Tên ngân hàng

    LocalDate hireDate; // Ngày bắt đầu làm việc

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    SalaryType salaryType = SalaryType.FIXED;

    @Column(nullable = false)
    @Builder.Default
    Double baseSalary = 0.0; // Lương cơ bản

    String emergencyContactName; // Tên người liên lạc khẩn cấp

    String emergencyContactPhone; // SĐT người liên lạc khẩn cấp

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id", nullable = false)
    EmployeePosition position;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @Builder.Default
    Boolean isActive = true;
}
