package com.mhbilliards.billiards_management.dto.customer;

import java.util.List;

import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class FaceEmbeddingResponse {
    Boolean success;

    List<Double> embedding;
}
