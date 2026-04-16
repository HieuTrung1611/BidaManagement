package com.mhbilliards.billiards_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findByUsername(String username); // tìm user theo username (dùng cho login)

    boolean existsByUsername(String username); // kiểm tra xem username đã tồn tại chưa (dùng cho register)

    boolean existsByEmail(String email); // kiểm tra xem email đã tồn tại chưa (dùng cho register)
}
