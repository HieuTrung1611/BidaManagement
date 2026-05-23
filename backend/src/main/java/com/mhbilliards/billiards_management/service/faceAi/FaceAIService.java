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

        System.out.println("🔵 [FACE-AI-SERVICE] Chuẩn bị gọi Face AI...");
        System.out.println("🔵 [FACE-AI-SERVICE] URL: " + faceAiUrl + "/face/embedding");
        System.out.println("🔵 [FACE-AI-SERVICE] File name: " + file.getOriginalFilename());
        System.out.println("🔵 [FACE-AI-SERVICE] File size: " + file.getSize() + " bytes");

        MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();

        bodyBuilder.part(
                "file",
                file.getResource());

        try {
            FaceEmbeddingResponse response = webClient.post()
                    .uri(faceAiUrl + "/face/embedding")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(
                            BodyInserters.fromMultipartData(
                                    bodyBuilder.build()))
                    .retrieve()
                    .bodyToMono(FaceEmbeddingResponse.class)
                    .block();

            System.out.println("✅ [FACE-AI-SERVICE] Face AI response received");
            return response;

        } catch (Exception e) {
            System.err.println("❌ [FACE-AI-SERVICE] Lỗi khi gọi Face AI: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Face AI service error: " + e.getMessage(), e);
        }
    }
}
