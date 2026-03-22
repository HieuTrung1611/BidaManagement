package com.mhbilliards.billiards_management.dto.tableBilliardZone;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TableBilliardZoneResponse {
    Long id;
    String name;
    String description;
}
