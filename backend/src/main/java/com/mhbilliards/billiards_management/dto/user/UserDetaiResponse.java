package com.mhbilliards.billiards_management.dto.user;

import com.mhbilliards.billiards_management.dto.base.BaseResponse;
import com.mhbilliards.billiards_management.enums.UserRole;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDetaiResponse extends BaseResponse {
    String username;
    String email;
    UserRole role;
    Boolean isActive;
}
