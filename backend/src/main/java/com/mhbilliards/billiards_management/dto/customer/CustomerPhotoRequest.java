package com.mhbilliards.billiards_management.dto.customer;

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
public class CustomerPhotoRequest {
    @NotBlank(message = "URL ảnh không được để trống")
    String photoUrl; // URL hoặc đường dẫn ảnh khách hàng
}
