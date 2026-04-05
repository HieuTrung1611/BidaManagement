package com.mhbilliards.billiards_management.dto.tableBilliard;

import com.mhbilliards.billiards_management.dto.branch.BranchResponse;
import com.mhbilliards.billiards_management.dto.tableBilliardType.TableBilliardTypeResponse;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TableBilliardResponse {
    Long id;
    String name;
    String description;
    TableBilliardTypeResponse type;
    Double pricePerHour;
    BranchResponse branch;
}
