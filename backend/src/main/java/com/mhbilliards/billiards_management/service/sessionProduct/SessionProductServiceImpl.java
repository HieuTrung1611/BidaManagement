package com.mhbilliards.billiards_management.service.sessionProduct;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mhbilliards.billiards_management.dto.sessionProduct.CreateSessionProductDTO;
import com.mhbilliards.billiards_management.dto.sessionProduct.SessionProductResponseDTO;
import com.mhbilliards.billiards_management.entity.BilliardSession;
import com.mhbilliards.billiards_management.entity.Product;
import com.mhbilliards.billiards_management.entity.SessionProduct;
import com.mhbilliards.billiards_management.mapper.SessionProductMapper;
import com.mhbilliards.billiards_management.repository.BilliardSessionRepository;
import com.mhbilliards.billiards_management.repository.ProductRepository;
import com.mhbilliards.billiards_management.repository.SessionProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SessionProductServiceImpl implements SessionProductService {

    private final SessionProductRepository sessionProductRepository;
    private final BilliardSessionRepository billiardSessionRepository;
    private final ProductRepository productRepository;
    private final SessionProductMapper sessionProductMapper;

    @Override
    @Transactional
    public SessionProductResponseDTO addProductToSession(CreateSessionProductDTO request) {
        BilliardSession session = billiardSessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session không tồn tại"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        // Check stock quantity
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Số lượng sản phẩm trong kho không đủ");
        }

        // Deduct stock quantity
        product.setStockQuantity(product.getStockQuantity() - request.getQuantity());
        productRepository.save(product);

        // Calculate total amount
        Double unitPrice = product.getSalePrice();
        Double totalAmount = unitPrice * request.getQuantity();

        SessionProduct sessionProduct = SessionProduct.builder()
                .session(session)
                .product(product)
                .quantity(request.getQuantity())
                .unitPrice(unitPrice)
                .totalAmount(totalAmount)
                .build();

        SessionProduct savedSessionProduct = sessionProductRepository.save(sessionProduct);
        return sessionProductMapper.toResponseDTO(savedSessionProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public SessionProductResponseDTO getSessionProductById(Long id) {
        SessionProduct sessionProduct = sessionProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session product không tồn tại"));
        return sessionProductMapper.toResponseDTO(sessionProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionProductResponseDTO> getProductsBySessionId(Long sessionId) {
        List<SessionProduct> sessionProducts = sessionProductRepository.findBySessionId(sessionId);
        return sessionProductMapper.toResponseDTOList(sessionProducts);
    }

    @Override
    @Transactional
    public void deleteSessionProduct(Long id) {
        SessionProduct sessionProduct = sessionProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session product không tồn tại"));

        // Return stock quantity
        Product product = sessionProduct.getProduct();
        product.setStockQuantity(product.getStockQuantity() + sessionProduct.getQuantity());
        productRepository.save(product);

        sessionProductRepository.delete(sessionProduct);
    }
}
