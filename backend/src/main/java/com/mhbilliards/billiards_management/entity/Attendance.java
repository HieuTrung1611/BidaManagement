package com.mhbilliards.billiards_management.entity;

import java.time.LocalDate;

import com.mhbilliards.billiards_management.enums.AttendanceStatus;

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
@Table(name = "attendances")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Attendance extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    Employee employee;

    @Column(nullable = false)
    LocalDate attendanceDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    AttendanceStatus status;

    String notes; // Ghi chú thêm

    @Column(nullable = false)
    @Builder.Default
    Integer workingHours = 0; // Số giờ làm việc
}
