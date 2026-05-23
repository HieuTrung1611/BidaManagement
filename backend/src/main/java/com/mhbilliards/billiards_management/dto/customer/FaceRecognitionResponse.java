package com.mhbilliards.billiards_management.dto.customer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FaceRecognitionResponse {
    private Boolean matched;
    private CustomerResponse customer;
    private Double similarity; // Độ tương đồng (0-1)
    private String message;
}
