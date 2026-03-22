package com.mhbilliards.billiards_management.security;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.mhbilliards.billiards_management.enums.UserRole;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import lombok.Getter;

@Component
@Getter
public class JwtUtil {
    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Value("${jwt.expiration}")
    private long EXPIRATION;

    public String generateToken(String username, UserRole role) throws JOSEException {
        // Header chứa thông tin về thuật toán ký và kiểu token.
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        // JWTClaimsSet là payload của JWT, chứa thông tin của token
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(username)
                .claim("role", role.name())
                .expirationTime(new Date(new Date().getTime() + EXPIRATION))
                .build();
        // JWSSigner chịu trách nhiệm ký token.
        JWSSigner signer = new MACSigner(SECRET_KEY);
        // SignedJWT là đối tượng JWT đã gộp header + payload.
        SignedJWT signedJWT = new SignedJWT(header, claimsSet);
        // Thực hiện ký token bằng key SECRET_KEY.
        signedJWT.sign(signer);

        return signedJWT.serialize();
    }

    public String getUsernameFromToken(String token) throws Exception {
        return parseAndVerify(token).getJWTClaimsSet().getSubject();
    }

    public UserRole getRoleFromToken(String token) throws Exception {
        String roleStr = (String) parseAndVerify(token)
                .getJWTClaimsSet()
                .getClaim("role");
        return UserRole.valueOf(roleStr);
    }

    public boolean validateToken(String token) {
        try {
            SignedJWT jwt = parseAndVerify(token);
            return jwt.getJWTClaimsSet()
                    .getExpirationTime()
                    .after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private SignedJWT parseAndVerify(String token) throws Exception {
        SignedJWT jwt = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(SECRET_KEY);

        if (!jwt.verify(verifier)) {
            throw new JOSEException("Invalid signature");
        }

        return jwt;
    }
}