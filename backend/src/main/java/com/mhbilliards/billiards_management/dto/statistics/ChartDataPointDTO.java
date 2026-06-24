package com.mhbilliards.billiards_management.dto.statistics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Một điểm dữ liệu trong biểu đồ
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChartDataPointDTO {
    private String label;   // Nhãn: "Tháng 1", "Tuần 23", "01/06"
    private Double value;   // Giá trị doanh thu
    private Long count;     // Số lượng phiên / hóa đơn
}
