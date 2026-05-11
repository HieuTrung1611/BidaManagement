package com.mhbilliards.billiards_management.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

/**
 * Entity quản lý thiết bị cho thuê trong session
 * Tính tiền theo số giờ thực tế thuê
 */
@Entity
@Table(name = "session_equipments")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SessionEquipment extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    BilliardSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id", nullable = false)
    Equipment equipment;

    @Column(nullable = false)
    Integer quantity; // Số lượng thuê

    @Column(nullable = false)
    LocalDateTime startTime; // Thời điểm bắt đầu thuê

    LocalDateTime endTime; // Thời điểm trả (nullable nếu chưa trả)

    @Column(nullable = false)
    Double hourlyRate; // Giá thuê/giờ tại thời điểm thuê

    Double totalAmount; // Tính khi trả: (endTime - startTime) * hourlyRate * quantity
}
