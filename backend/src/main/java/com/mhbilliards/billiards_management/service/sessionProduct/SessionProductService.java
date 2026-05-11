package com.mhbilliards.billiards_management.service.sessionProduct;

import com.mhbilliards.billiards_management.dto.sessionProduct.CreateSessionProductDTO;
import com.mhbilliards.billiards_management.dto.sessionProduct.SessionProductResponseDTO;

import java.util.List;

public interface SessionProductService {
    SessionProductResponseDTO addProductToSession(CreateSessionProductDTO request);

    SessionProductResponseDTO getSessionProductById(Long id);

    List<SessionProductResponseDTO> getProductsBySessionId(Long sessionId);

    void deleteSessionProduct(Long id);
}
