package com.mhbilliards.billiards_management.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder.Default;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

/**
 * Entity quản lý combo (gói ưu đãi các sản phẩm/thiết bị)
 * Combo KHÔNG bao gồm giờ chơi (Option A)
 * Giờ chơi được tính riêng từ BilliardSession
 */
@Entity
@Table(name = "combos")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Combo extends BaseEntity {
    @Column(nullable = false)
    String name; // Tên combo: "Happy Hour", "Combo Sinh viên"

    String description;

    @Column(nullable = false)
    Double regularPrice; // Tổng giá thường (nếu mua lẻ từng item)

    @Column(nullable = false)
    Double discountedPrice; // Giá ưu đãi combo (thấp hơn regularPrice)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;

    @Default
    @Column(nullable = false)
    Boolean isActive = true; // Trạng thái hoạt động

    @OneToMany(mappedBy = "combo", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    List<ComboItem> items; // Danh sách items trong combo

}
