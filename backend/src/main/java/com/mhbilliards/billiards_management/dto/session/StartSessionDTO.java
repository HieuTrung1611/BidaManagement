package com.mhbilliards.billiards_management.dto.session;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

/**
 * DTO để bắt đầu phiên chơi mới
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class StartSessionDTO {
    @NotNull(message = "Table ID is required")
    Long tableId;

    // Optional: for member benefits/discounts
    Long customerId;

    String notes;
}
