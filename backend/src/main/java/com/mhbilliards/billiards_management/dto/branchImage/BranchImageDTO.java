package com.mhbilliards.billiards_management.dto.branchImage;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class BranchImageDTO {
    Long id;
    String url;
    String publicId;
}
