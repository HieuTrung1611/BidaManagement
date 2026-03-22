package com.mhbilliards.billiards_management.utils;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ResponseUtil {
    private static <T> ApiResponse<T> build(boolean success, T data, String message, HttpStatus status) {
        return ApiResponse.<T>builder()
                .success(success)
                .data(data)
                .message(message)
                .status(status.value())
                .timestamp(Instant.now().toEpochMilli())
                .build();
    }

    public static <T> ResponseEntity<ApiResponse<T>> success(T data, String message) {
        return ResponseEntity.ok(build(true, data, message, HttpStatus.OK));
    }

    public static <T> ResponseEntity<ApiResponse<T>> created(T data, String message) {
        return ResponseEntity.status(HttpStatus.CREATED).body(build(true, data, message, HttpStatus.CREATED));
    }

    public static <T> ResponseEntity<ApiResponse<T>> fail(String message, HttpStatus status) {
        return ResponseEntity.status(status).body(build(false, null, message, status));
    }
}
