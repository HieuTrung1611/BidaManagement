package com.mhbilliards.billiards_management.entity;

import java.time.LocalDate;
import java.time.YearMonth;

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
@Table(name = "salaries")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Salary extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    Employee employee;

    @Column(nullable = false)
    String salaryMonth; // Format: YYYY-MM

    @Column(nullable = false)
    Double baseSalary; // Lương cơ bản

    @Column(nullable = false)
    @Builder.Default
    Double bonus = 0.0; // Thưởng

    @Column(nullable = false)
    @Builder.Default
    Double deduction = 0.0; // Khấu trừ

    @Column(nullable = false)
    Double totalSalary; // Tổng lương

    Integer workingDays; // Số ngày làm việc

    Integer workingHours; // Số giờ làm việc

    @Column(nullable = false)
    @Builder.Default
    Boolean isPaid = false; // Đã thanh toán chưa

    String notes;
}
