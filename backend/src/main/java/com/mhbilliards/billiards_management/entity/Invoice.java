package com.mhbilliards.billiards_management.entity;

import java.time.LocalDateTime;

import com.mhbilliards.billiards_management.enums.InvoiceStatus;

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
@Table(name = "invoices")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Invoice extends BaseEntity {
    @Column(unique = true, nullable = false)
    String invoiceNumber; // Số hóa đơn

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    BilliardSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    Customer customer;

    @Column(nullable = false)
    LocalDateTime invoiceDate;

    @Column(nullable = false)
    @Builder.Default
    Double subtotal = 0.0; // Tổng tiền trước giảm giá

    @Column(nullable = false)
    @Builder.Default
    Double discountPercent = 0.0; // Giảm giá theo rank của khách hàng

    @Column(nullable = false)
    @Builder.Default
    Double discountAmount = 0.0; // Số tiền giảm

    @Column(nullable = false)
    @Builder.Default
    Double totalAmount = 0.0; // Tổng tiền sau giảm giá

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    InvoiceStatus status = InvoiceStatus.PENDING;

    String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    Branch branch;
}
