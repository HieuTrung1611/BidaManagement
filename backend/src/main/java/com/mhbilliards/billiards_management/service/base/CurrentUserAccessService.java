package com.mhbilliards.billiards_management.service.base;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.mhbilliards.billiards_management.entity.Employee;
import com.mhbilliards.billiards_management.entity.User;
import com.mhbilliards.billiards_management.enums.UserRole;
import com.mhbilliards.billiards_management.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CurrentUserAccessService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("Không xác định được người dùng hiện tại");
        }

        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại trong hệ thống"));
    }

    public boolean hasGlobalBranchAccess() {
        UserRole role = getCurrentUser().getRole();
        return role == UserRole.ADMIN || role == UserRole.ACCOUNTANT;
    }

    public boolean isManager() {
        return getCurrentUser().getRole() == UserRole.MANAGER;
    }

    public Long resolveAccessibleBranchId(Long requestedBranchId) {
        if (!isManager()) {
            return requestedBranchId;
        }

        Long managedBranchId = getManagedBranchId();
        if (requestedBranchId != null && !managedBranchId.equals(requestedBranchId)) {
            throw new AccessDeniedException("Quản lý chỉ được thao tác trên chi nhánh mình quản lý");
        }

        return managedBranchId;
    }

    public void assertCanManageEmployee(Employee employee) {
        if (employee == null || employee.getBranch() == null) {
            throw new RuntimeException("Nhân viên không có thông tin chi nhánh hợp lệ");
        }

        if (isManager() && !getManagedBranchId().equals(employee.getBranch().getId())) {
            throw new AccessDeniedException("Quản lý chỉ được thao tác nhân viên thuộc chi nhánh mình quản lý");
        }
    }

    public Long getManagedBranchId() {
        User user = getCurrentUser();
        if (user.getRole() != UserRole.MANAGER) {
            throw new AccessDeniedException("Chỉ quản lý mới có chi nhánh quản lý mặc định");
        }

        if (user.getBranch() == null || user.getBranch().getId() == null) {
            throw new RuntimeException("Tài khoản quản lý chưa được gán chi nhánh");
        }

        return user.getBranch().getId();
    }
}