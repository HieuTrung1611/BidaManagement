package com.mhbilliards.billiards_management.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mhbilliards.billiards_management.dto.auth.LoginRequest;
import com.mhbilliards.billiards_management.dto.auth.RegisterRequest;
import com.mhbilliards.billiards_management.dto.auth.UserInfoResponse;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import com.mhbilliards.billiards_management.service.auth.AuthService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@RequestBody RegisterRequest req) {
        authService.register(req);
        return ResponseUtil.success(null, "Đăng ký thành công");
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Void>> login(@RequestBody LoginRequest req,
            HttpServletResponse httpRes) {
        authService.login(req, httpRes);
        return ResponseUtil.success(null, "Đăng nhập thành công");
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse httpRes) {
        authService.logout(httpRes);
        return ResponseUtil.success(null, "Đăng xuất thành công");
    }

    @GetMapping("/current-user")
    public ResponseEntity<ApiResponse<UserInfoResponse>> getCurrentUser(HttpServletRequest request) {
        try {
            // Lấy token từ cookie
            String token = getTokenFromCookie(request);

            if (token == null) {
                return ResponseUtil.fail("Token không tồn tại", HttpStatus.UNAUTHORIZED);
            }

            UserInfoResponse userInfo = authService.getUserInfoFromToken(token);
            return ResponseUtil.success(userInfo, "Lấy thông tin user thành công");

        } catch (Exception e) {
            return ResponseUtil.fail("Token không hợp lệ: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    private String getTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("JWT_TOKEN".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

}
