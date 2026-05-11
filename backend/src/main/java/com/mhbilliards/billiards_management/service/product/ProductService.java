package com.mhbilliards.billiards_management.service.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.mhbilliards.billiards_management.dto.product.CreateProductDTO;
import com.mhbilliards.billiards_management.dto.product.ProductResponseDTO;
import com.mhbilliards.billiards_management.dto.product.UpdateProductDTO;
import com.mhbilliards.billiards_management.enums.ProductType;

import java.util.List;

public interface ProductService {
    ProductResponseDTO createProduct(CreateProductDTO request);

    ProductResponseDTO getProductById(Long id);

    Page<ProductResponseDTO> searchProducts(String keyword, ProductType type, Long branchId, Pageable pageable);

    List<ProductResponseDTO> getProductsByBranch(Long branchId);

    List<ProductResponseDTO> getLowStockProducts(Long branchId);

    ProductResponseDTO updateProduct(Long id, UpdateProductDTO request);

    void deleteProduct(Long id);

    ProductResponseDTO updateStockQuantity(Long id, Integer quantity, boolean isAddition);
}
