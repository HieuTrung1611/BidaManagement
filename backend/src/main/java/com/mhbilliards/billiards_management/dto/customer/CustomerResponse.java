package com.mhbilliards.billiards_management.dto.customer;

import com.mhbilliards.billiards_management.enums.CustomerRank;
import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerResponse {
    Long id;
    String name;
    String email;
    String phoneNumber;
    String address;
    CustomerRank rank;
    Long totalSpent;
    Boolean isActive;
    String photoUrl; // Ảnh khách hàng
    Integer visitCount; // Số lần ghé
    LocalDateTime lastVisitDate; // Ngày ghé gần nhất
    String customerNotes; // Ghi chú
}
