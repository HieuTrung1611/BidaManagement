package com.mhbilliards.billiards_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.User;
import com.mhbilliards.billiards_management.enums.UserRole;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findByUsername(String username); // tìm user theo username (dùng cho login)

    boolean existsByUsername(String username); // kiểm tra xem username đã tồn tại chưa (dùng cho register)

    boolean existsByEmail(String email); // kiểm tra xem email đã tồn tại chưa (dùng cho register)

    boolean existsByBranch_IdAndRole(Long branchId, UserRole role); // kiểm tra chi nhánh đã có quản lý chưa

    boolean existsByBranch_IdAndRoleAndIdNot(Long branchId, UserRole role, Long excludeId); // kiểm tra khi update (loại
                                                                                            // trừ chính user đó)
}
