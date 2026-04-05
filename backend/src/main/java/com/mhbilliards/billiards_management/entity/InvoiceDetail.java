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

@Entity
@Table(name = "invoice_details")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvoiceDetail extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    Invoice invoice;

    @Column(nullable = false)
    String itemDescription; // Mô tả mục (giờ chơi, dịch vụ, combo...)

    @Column(nullable = false)
    Integer quantity;

    @Column(nullable = false)
    Double unitPrice;

    @Column(nullable = false)
    Double totalPrice; // = quantity * unitPrice

    String notes;
}
