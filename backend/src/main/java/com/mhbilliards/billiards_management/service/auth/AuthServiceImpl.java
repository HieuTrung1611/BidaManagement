package com.mhbilliards.billiards_management.service.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mhbilliards.billiards_management.dto.auth.LoginRequest;
import com.mhbilliards.billiards_management.dto.auth.RegisterRequest;
import com.mhbilliards.billiards_management.dto.auth.UserInfoResponse;
import com.mhbilliards.billiards_management.entity.User;
import com.mhbilliards.billiards_management.enums.UserRole;
import com.mhbilliards.billiards_management.repository.UserRepository;
import com.mhbilliards.billiards_management.security.JwtUtil;
import com.nimbusds.jose.JOSEException;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void register(RegisterRequest req) {

        if (userRepository.existsByUsername(req.getUsername())) {
            throw new RuntimeException("username đã tồn tại");
        }

        // gán dữ liệu từ request vào entity, mã hoá password trước khi lưu
        User user = User.builder()
                .username(req.getUsername())
                .password(passwordEncoder.encode(req.getPassword()))
                .email(req.getEmail())
                .role(UserRole.USER) // Mặc định là USER role
                .build();

        // lưu vào database
        userRepository.save(user);
    }

    @Override
    public void login(LoginRequest req, HttpServletResponse httpRes) {
        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("username không tồn tại"));

        if (user.getIsActive() == Boolean.FALSE) {
            throw new RuntimeException("Tài khoản đã bị vô hiệu hóa");
        }

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu không hợp lệ");
        }

        try {
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
            addJwtCookie(httpRes, token);

            // addJwtCookie(response, token); (nếu có)
        } catch (JOSEException e) {
            throw new RuntimeException("Lỗi khi tạo JWT token", e);
        }

    }

    @Override
    public UserInfoResponse getUserInfoFromToken(String token) throws Exception {
        // Validate token trước khi parse
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn");
        }

        // Extract username và role từ token
        String username = jwtUtil.getUsernameFromToken(token);
        String role = jwtUtil.getRoleFromToken(token).name();

        // Verify user vẫn tồn tại trong database (optional but recommended for
        // security)
        if (!userRepository.existsByUsername(username)) {
            throw new RuntimeException("Người dùng không tồn tại");
        }

        return UserInfoResponse.builder()
                .username(username)
                .role(role)
                .build();
    }

    @Override
    public void logout(HttpServletResponse httpRes) {
        Cookie cookie = new Cookie("JWT_TOKEN", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0); // xóa cookie
        httpRes.addCookie(cookie);
    }

    private void addJwtCookie(HttpServletResponse httpRes, String token) {
        Cookie cookie = new Cookie("JWT_TOKEN", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge((int) (jwtUtil.getEXPIRATION() / 1000));

        httpRes.addCookie(cookie);
    }
}
