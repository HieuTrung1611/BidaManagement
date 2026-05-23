package com.mhbilliards.billiards_management.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PaymentStatus {
    PAID("Đã thanh toán"),
    UNPAID("Chưa thanh toán"),
    PENDING("Đang chờ thanh toán"),
    DEBT("Nợ - Cần liên hệ");

    private final String displayName;
}
