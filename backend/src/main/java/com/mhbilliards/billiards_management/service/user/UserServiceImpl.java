package com.mhbilliards.billiards_management.service.user;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mhbilliards.billiards_management.dto.user.UserCreationRequest;
import com.mhbilliards.billiards_management.dto.user.UserDetaiResponse;
import com.mhbilliards.billiards_management.dto.user.UserResponse;
import com.mhbilliards.billiards_management.dto.user.UserUpdationRequest;
import com.mhbilliards.billiards_management.entity.Branch;
import com.mhbilliards.billiards_management.entity.User;
import com.mhbilliards.billiards_management.enums.UserRole;
import com.mhbilliards.billiards_management.repository.BranchRepository;
import com.mhbilliards.billiards_management.repository.UserRepository;
import com.mhbilliards.billiards_management.specification.UserSpecification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final BranchRepository branchRepository;

    // Conversion function: UserCreationRequest -> User Entity
    private User convertToEntity(UserCreationRequest request) {
        Branch branch = resolveBranch(request.getRole(), request.getBranchId());
        return User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .role(request.getRole())
                .branch(branch)
                .build();
    }

    // Conversion function: User Entity -> UserResponse
    private UserResponse convertToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .branchId(user.getBranch() != null ? user.getBranch().getId() : null)
                .build();
    }

    private UserDetaiResponse convertToDetailResponse(User user) {

        return UserDetaiResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .branchId(user.getBranch() != null ? user.getBranch().getId() : null)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .createdBy(user.getCreatedBy())
                .updatedBy(user.getUpdatedBy())
                .build();
    }

    private Branch resolveBranch(UserRole role, Long branchId) {
        if (role == UserRole.ADMIN) {
            return null;
        }
        if (branchId == null) {
            throw new RuntimeException("Branch is required for role: " + role);
        }
        return branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found with id: " + branchId));
    }

    private void validateManagerUniqueness(UserRole role, Long branchId, Long excludeUserId) {
        if (role != UserRole.MANAGER || branchId == null)
            return;
        boolean exists = excludeUserId == null
                ? userRepository.existsByBranch_IdAndRole(branchId, UserRole.MANAGER)
                : userRepository.existsByBranch_IdAndRoleAndIdNot(branchId, UserRole.MANAGER, excludeUserId);
        if (exists) {
            throw new RuntimeException("Chi nhánh này đã có quản lý, mỗi chi nhánh chỉ được có 1 quản lý");
        }
    }

    // Conversion function: Update existing User Entity from UserUpdationRequest
    private void updateEntityFromRequest(User user, UserUpdationRequest request) {
        user.setUsername(request.getUsername());
        // Only update password if it's provided and not empty
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setBranch(resolveBranch(request.getRole(), request.getBranchId()));
    }

    @Override
    public UserResponse createUser(UserCreationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        validateManagerUniqueness(request.getRole(), request.getBranchId(), null);
        User user = convertToEntity(request);
        User savedUser = userRepository.save(user);
        return convertToResponse(savedUser);
    }

    @Override
    public UserResponse updateUser(Long id, UserUpdationRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        validateManagerUniqueness(request.getRole(), request.getBranchId(), id);
        updateEntityFromRequest(user, request);
        User updatedUser = userRepository.save(user);
        return convertToResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public UserDetaiResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return convertToDetailResponse(user);
    }

    @Override
    public UserDetaiResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        return convertToDetailResponse(user);
    }

    @Override
    public List<UserResponse> getAllUsers(String keyword) {
        List<User> users = userRepository.findAll(UserSpecification.hasKeyword(keyword));
        return users.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void toggleUserActivation(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setIsActive(!user.getIsActive());
        userRepository.save(user);
    }
}
