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

/**
 * Entity để quản lý chi tiết liên kết giữa Combo và các Service bao gồm
 * Ví dụ: Combo "Happy Hour" có thể bao gồm 2 giờ chơi + 1 cốc nước uống
 */
@Entity
@Table(name = "combo_services")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ComboService extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "combo_id", nullable = false)
    Combo combo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    Service service;

    @Column(nullable = false)
    Integer quantity; // Số lượng dịch vụ trong combo
}
