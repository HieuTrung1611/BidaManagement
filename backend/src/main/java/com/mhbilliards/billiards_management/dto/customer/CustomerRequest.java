package com.mhbilliards.billiards_management.dto.customer;

import com.mhbilliards.billiards_management.enums.CustomerRank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
public class CustomerRequest {
    @NotBlank(message = "Tên khách hàng không được để trống")
    String name;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    String email;

    @NotBlank(message = "Số điện thoại không được để trống")
    String phoneNumber;

    String address;

    String customerNotes; // Ghi chú về sở thích, phong cách chơi

    CustomerRank rank; // Hạng khách hàng (tuỳ chọn, dùng khi cập nhật)
}
