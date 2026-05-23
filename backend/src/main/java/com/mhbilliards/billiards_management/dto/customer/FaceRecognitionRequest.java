package com.mhbilliards.billiards_management.dto.customer;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FaceRecognitionRequest {
    private List<Double> embedding; // Face embedding từ ảnh quét
    private Double threshold; // Ngưỡng so sánh (mặc định 0.6)
}
