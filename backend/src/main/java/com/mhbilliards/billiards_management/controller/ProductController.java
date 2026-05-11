package com.mhbilliards.billiards_management.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mhbilliards.billiards_management.dto.product.CreateProductDTO;
import com.mhbilliards.billiards_management.dto.product.ProductResponseDTO;
import com.mhbilliards.billiards_management.dto.product.UpdateProductDTO;
import com.mhbilliards.billiards_management.enums.ProductType;
import com.mhbilliards.billiards_management.service.product.ProductService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> createProduct(@Valid @RequestBody CreateProductDTO request) {
        ProductResponseDTO response = productService.createProduct(request);
        return ResponseUtil.created(response, "Tạo sản phẩm thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> getProductById(@PathVariable Long id) {
        ProductResponseDTO response = productService.getProductById(id);
        return ResponseUtil.success(response, "Lấy sản phẩm thành công");
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<Page<ProductResponseDTO>>> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ProductType type,
            @RequestParam(required = false) Long branchId,
            Pageable pageable) {

        Page<ProductResponseDTO> response = productService.searchProducts(keyword, type, branchId, pageable);
        return ResponseUtil.success(response, "Tìm kiếm sản phẩm thành công");
    }

    @GetMapping("/branch/{branchId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> getProductsByBranch(@PathVariable Long branchId) {
        List<ProductResponseDTO> response = productService.getProductsByBranch(branchId);
        return ResponseUtil.success(response, "Lấy danh sách sản phẩm theo chi nhánh thành công");
    }

    @GetMapping("/branch/{branchId}/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> getLowStockProducts(@PathVariable Long branchId) {
        List<ProductResponseDTO> response = productService.getLowStockProducts(branchId);
        return ResponseUtil.success(response, "Lấy danh sách sản phẩm sắp hết hàng thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> updateProduct(@PathVariable Long id,
            @Valid @RequestBody UpdateProductDTO request) {
        ProductResponseDTO response = productService.updateProduct(id, request);
        return ResponseUtil.success(response, "Cập nhật sản phẩm thành công");
    }

    @PutMapping("/{id}/stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> updateStockQuantity(
            @PathVariable Long id,
            @RequestParam Integer quantity,
            @RequestParam(defaultValue = "true") boolean isAddition) {
        ProductResponseDTO response = productService.updateStockQuantity(id, quantity, isAddition);
        return ResponseUtil.success(response, "Cập nhật số lượng tồn kho thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseUtil.success(null, "Xóa sản phẩm thành công");
    }
}
