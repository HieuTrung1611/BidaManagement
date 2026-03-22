package com.mhbilliards.billiards_management.controller;

import java.util.List;

import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mhbilliards.billiards_management.dto.user.UserCreationRequest;
import com.mhbilliards.billiards_management.dto.user.UserDetaiResponse;
import com.mhbilliards.billiards_management.dto.user.UserResponse;
import com.mhbilliards.billiards_management.dto.user.UserUpdationRequest;
import com.mhbilliards.billiards_management.service.user.UserService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody UserCreationRequest request) {
        UserResponse response = userService.createUser(request);
        return ResponseUtil.created(response, "Create user successfully");
        // return ResponseEntitystatus(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdationRequest request) {
        UserResponse response = userService.updateUser(id, request);
        return ResponseUtil.success(response, "Update user successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseUtil.success(null, "Delete user successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDetaiResponse>> getUserById(@PathVariable Long id) {
        UserDetaiResponse response = userService.getUserById(id);
        return ResponseUtil.success(response, "Get user information successfully");
    }

    @PatchMapping("/{id}/toggle-activation")
    public ResponseEntity<ApiResponse<Void>> toggleUserActivation(@PathVariable Long id) {
        userService.toggleUserActivation(id);
        return ResponseUtil.success(null, "Toggle user activation successfully");
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers(@Param("keyword") String keyword) {
        List<UserResponse> responses = userService.getAllUsers(keyword);
        return ResponseUtil.success(responses, "Get all users successfully");
    }
}
