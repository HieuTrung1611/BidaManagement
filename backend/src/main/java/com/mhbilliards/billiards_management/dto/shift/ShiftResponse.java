package com.mhbilliards.billiards_management.dto.shift;

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
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ShiftResponse {
    Long id;
    String name; // Tên ca làm việc, ví dụ: "Ca sáng", "Ca chiều", "Ca tối"
    String code;
    String description; // Mô tả chi tiết về ca làm việc
    String startTime; // Thời gian bắt đầu ca làm việc, định dạng "HH:mm"
    String endTime; // Thời gian kết thúc ca làm việc, định dạng "HH:mm"
}
