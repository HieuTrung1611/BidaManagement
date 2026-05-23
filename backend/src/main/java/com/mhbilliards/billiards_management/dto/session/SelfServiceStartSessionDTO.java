package com.mhbilliards.billiards_management.dto.session;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SelfServiceStartSessionDTO {
    private Long tableId; // Bàn được chọn
    private Long customerId; // ID khách hàng sau khi nhận diện
    private String customerPhone; // Số điện thoại backup để liên hệ
    private String notes;
}
