package com.mhbilliards.billiards_management.service.faceAi;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import com.mhbilliards.billiards_management.dto.customer.FaceEmbeddingResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FaceAIService {

    private final WebClient webClient;
    @Value("${face.ai.url}")
    private String faceAiUrl;

    public FaceEmbeddingResponse createEmbedding(
            MultipartFile file) {

        MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();

        bodyBuilder.part(
                "file",
                file.getResource());

        return webClient.post()
                .uri(faceAiUrl + "/face/embedding")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(
                        BodyInserters.fromMultipartData(
                                bodyBuilder.build()))
                .retrieve()
                .bodyToMono(FaceEmbeddingResponse.class)
                .block();
    }
}
