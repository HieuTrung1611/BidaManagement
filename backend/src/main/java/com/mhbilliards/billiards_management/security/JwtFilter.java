package com.mhbilliards.billiards_management.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final CustomUserDetailService userDetailsService;

    // // Bỏ qua các endpoint public
    // @Override
    // protected boolean shouldNotFilter(HttpServletRequest request) throws
    // ServletException {
    // String path = request.getServletPath();
    // return path.startsWith("/auth/"); // tất cả đường dẫn auth sẽ không check JWT
    // }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain filterChain)
            throws ServletException, IOException {
        String token = null;
        if (req.getCookies() != null) {
            for (Cookie cookie : req.getCookies()) {
                if ("JWT_TOKEN".equals(cookie.getName())) {
                    token = cookie.getValue();
                }
            }
        }
        if (token != null) {
            try {
                String username = jwtUtil.getUsernameFromToken(token);
                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    // This will also check if user is active
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    if (jwtUtil.validateToken(token)) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            } catch (UsernameNotFoundException e) {
                // Check if user is deactivated, then clear token
                if (e.getMessage().contains("deactivated")) {
                    clearJwtCookie(res);
                }
            } catch (Exception e) {
                clearJwtCookie(res);

                res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

                res.setContentType("application/json");

                res.getWriter().write(
                        "{\"message\":\"Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.\"}");

                return; // QUAN TRỌNG
            }
        }

        filterChain.doFilter(req, res);
    }

    /**
     * Clear JWT cookie when user is deactivated
     */
    private void clearJwtCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("JWT_TOKEN", null);
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);
    }
}
