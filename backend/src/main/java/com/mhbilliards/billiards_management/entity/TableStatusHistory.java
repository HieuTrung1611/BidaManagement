package com.mhbilliards.billiards_management.entity;

import java.time.LocalDateTime;

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

/**
 * Entity để theo dõi lịch sử thay đổi trạng thái của bàn billiard
 */
@Entity
@Table(name = "table_status_histories")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TableStatusHistory extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id", nullable = false)
    TableBilliard table;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    TableStatus oldStatus; // Trạng thái cũ

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    TableStatus newStatus; // Trạng thái mới

    @Column(nullable = false)
    LocalDateTime changedAt; // Thời gian thay đổi

    String reason; // Lý do thay đổi

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;
}
