package com.mhbilliards.billiards_management.service.user;

import java.util.List;

import com.mhbilliards.billiards_management.dto.user.UserCreationRequest;
import com.mhbilliards.billiards_management.dto.user.UserDetaiResponse;
import com.mhbilliards.billiards_management.dto.user.UserResponse;
import com.mhbilliards.billiards_management.dto.user.UserUpdationRequest;

public interface UserService {
    UserResponse createUser(UserCreationRequest request);

    UserResponse updateUser(Long id, UserUpdationRequest request);

    void deleteUser(Long id);

    UserDetaiResponse getUserById(Long id);

    UserDetaiResponse getUserByUsername(String username);

    List<UserResponse> getAllUsers(String keyword);

    void toggleUserActivation(Long id);
}
