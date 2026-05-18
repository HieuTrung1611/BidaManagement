package com.mhbilliards.billiards_management.dto.sessionCombo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/**
 * DTO response cho session combo
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class SessionComboResponseDTO {
    Long id;

    Long sessionId;

    Long comboId;
    String comboName;

    Integer quantity;
    Double price; // Giá tại thời điểm thêm
    Double totalAmount; // price * quantity
}
