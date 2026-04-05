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
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/**
 * Entity để quản lý lịch sử thay đổi tồn kho
 * Theo dõi chi tiết qui những lần thêm/bớt hàng
 */
@Entity
@Table(name = "inventory_movements")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InventoryMovement extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_id", nullable = false)
    Inventory inventory;

    @Column(nullable = false)
    Integer quantityChange; // Lượng thay đổi (+/-)

    @Column(nullable = false)
    String movementType; // "IN", "OUT", "ADJUST"

    @Column(nullable = false)
    LocalDateTime movementDate;

    String reason; // Lý do thay đổi

    String reference; // Tham chiếu (SDT, Hóa đơn, ...)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;
}
