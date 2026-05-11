package com.mhbilliards.billiards_management.service.product;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mhbilliards.billiards_management.dto.product.CreateProductDTO;
import com.mhbilliards.billiards_management.dto.product.ProductResponseDTO;
import com.mhbilliards.billiards_management.dto.product.UpdateProductDTO;
import com.mhbilliards.billiards_management.entity.Branch;
import com.mhbilliards.billiards_management.entity.Product;
import com.mhbilliards.billiards_management.enums.ProductType;
import com.mhbilliards.billiards_management.mapper.ProductMapper;
import com.mhbilliards.billiards_management.repository.BranchRepository;
import com.mhbilliards.billiards_management.repository.ProductRepository;
import com.mhbilliards.billiards_management.specification.ProductSpecification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final BranchRepository branchRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional
    public ProductResponseDTO createProduct(CreateProductDTO request) {
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new RuntimeException("Chi nhánh không tồn tại"));

        Product product = productMapper.toEntity(request);
        product.setBranch(branch);
        if (request.getIsActive() == null) {
            product.setIsActive(true);
        }

        Product savedProduct = productRepository.save(product);
        return productMapper.toResponseDTO(savedProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        return productMapper.toResponseDTO(product);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> searchProducts(String keyword, ProductType type, Long branchId, Pageable pageable) {
        Specification<Product> spec = Specification.where(ProductSpecification.hasKeyword(keyword))
                .and(ProductSpecification.hasType(type))
                .and(ProductSpecification.hasBranchId(branchId));

        Page<Product> products = productRepository.findAll(spec, pageable);
        return products.map(productMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getProductsByBranch(Long branchId) {
        List<Product> products = productRepository.findByBranchIdAndIsActiveTrue(branchId);
        return productMapper.toResponseDTOList(products);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getLowStockProducts(Long branchId) {
        List<Product> products = productRepository.findLowStockProducts(branchId);
        return productMapper.toResponseDTOList(products);
    }

    @Override
    @Transactional
    public ProductResponseDTO updateProduct(Long id, UpdateProductDTO request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        productMapper.updateEntity(request, product);

        Product updatedProduct = productRepository.save(product);
        return productMapper.toResponseDTO(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        productRepository.delete(product);
    }

    @Override
    @Transactional
    public ProductResponseDTO updateStockQuantity(Long id, Integer quantity, boolean isAddition) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        if (isAddition) {
            product.setStockQuantity(product.getStockQuantity() + quantity);
        } else {
            if (product.getStockQuantity() < quantity) {
                throw new RuntimeException("Số lượng tồn kho không đủ");
            }
            product.setStockQuantity(product.getStockQuantity() - quantity);
        }

        Product updatedProduct = productRepository.save(product);
        return productMapper.toResponseDTO(updatedProduct);
    }
}
