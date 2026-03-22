package com.mhbilliards.billiards_management.service.auth;

import com.mhbilliards.billiards_management.dto.auth.LoginRequest;
import com.mhbilliards.billiards_management.dto.auth.RegisterRequest;
import com.mhbilliards.billiards_management.dto.auth.UserInfoResponse;

import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    void register(RegisterRequest req);

    UserInfoResponse getUserInfoFromToken(String token) throws Exception;

    void login(LoginRequest req, HttpServletResponse httpRes);

    void logout(HttpServletResponse httpRes);
}
