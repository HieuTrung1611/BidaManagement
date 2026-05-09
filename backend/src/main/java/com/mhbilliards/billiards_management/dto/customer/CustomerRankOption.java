package com.mhbilliards.billiards_management.dto.customer;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CustomerRankOption {
    private String value;
    private String displayName;
    private Double discountPercent;
}
