package com.mhbilliards.billiards_management.entity;

import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "shifts")
@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class Shift extends BaseEntity {
    String name; // Tên ca làm việc, ví dụ: "Ca sáng", "Ca chiều", "Ca tối"
    String code;
    String description; // Mô tả chi tiết về ca làm việc
    LocalTime startTime; // Thời gian bắt đầu ca làm việc
    LocalTime endTime; // Thời gian kết thúc ca làm việc

}
