package com.mhbilliards.billiards_management.entity;

import java.time.LocalDateTime;

import com.mhbilliards.billiards_management.enums.SessionStatus;
import com.mhbilliards.billiards_management.enums.TableStatus;

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
@Table(name = "billiard_sessions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BilliardSession extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id", nullable = false)
    TableBilliard table;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    Customer customer;

    @Column(nullable = false)
    LocalDateTime startTime;

    LocalDateTime endTime;

    @Column(nullable = false)
    @Builder.Default
    Double durationHours = 0.0; // Thời lượng chơi tính bằng giờ

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    SessionStatus status = SessionStatus.ONGOING;

    @Column(nullable = false)
    @Builder.Default
    Double totalAmount = 0.0; // Tổng tiền phát sinh

    String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;
}
