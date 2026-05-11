package com.mhbilliards.billiards_management.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
import org.springframework.web.multipart.MultipartFile;

import com.mhbilliards.billiards_management.dto.customer.CustomerNotesRequest;
import com.mhbilliards.billiards_management.dto.customer.CustomerRankOption;
import com.mhbilliards.billiards_management.dto.customer.CustomerRequest;
import com.mhbilliards.billiards_management.dto.customer.CustomerResponse;
import com.mhbilliards.billiards_management.enums.CustomerRank;
import com.mhbilliards.billiards_management.service.customer.CustomerService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/ranks")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<CustomerRankOption>>> getCustomerRanks() {
        List<CustomerRankOption> ranks = Arrays.stream(CustomerRank.values())
                .map(r -> new CustomerRankOption(r.name(), r.getDisplayName(), r.getDiscountPercent()))
                .toList();
        return ResponseUtil.success(ranks, "Lấy danh sách hạng khách hàng thành công");
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<CustomerResponse>> createCustomer(@Valid @RequestBody CustomerRequest request) {
        CustomerResponse response = customerService.createCustomer(request);
        return ResponseUtil.created(response, "Tạo khách hàng thành công");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerById(@PathVariable Long id) {
        CustomerResponse response = customerService.getCustomerById(id);
        return ResponseUtil.success(response, "Lấy khách hàng thành công");
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Page<CustomerResponse>>> searchCustomers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long branchId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction sortDirection) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<CustomerResponse> response = customerService.searchCustomers(keyword, branchId, pageable);
        return ResponseUtil.success(response, "Tìm kiếm khách hàng thành công");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<CustomerResponse>> updateCustomer(@PathVariable Long id,
            @Valid @RequestBody CustomerRequest request) {
        CustomerResponse response = customerService.updateCustomer(id, request);
        return ResponseUtil.success(response, "Cập nhật khách hàng thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseUtil.success(null, "Xóa khách hàng thành công");
    }

    @PostMapping("/{id}/deactivate")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> deactivateCustomer(@PathVariable Long id) {
        customerService.deactivateCustomer(id);
        return ResponseUtil.success(null, "Hủy kích hoạt khách hàng thành công");
    }

    @PostMapping("/{id}/reactivate")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> reactivateCustomer(@PathVariable Long id) {
        customerService.reactivateCustomer(id);
        return ResponseUtil.success(null, "Kích hoạt lại khách hàng thành công");
    }

    @PostMapping("/{id}/upload-photo")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<CustomerResponse>> uploadCustomerPhoto(@PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        CustomerResponse response = customerService.uploadCustomerPhoto(id, file);
        return ResponseUtil.success(response, "Tải lên ảnh khách hàng thành công");
    }

    @PutMapping("/{id}/notes")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<CustomerResponse>> updateCustomerNotes(@PathVariable Long id,
            @Valid @RequestBody CustomerNotesRequest request) {
        CustomerResponse response = customerService.updateCustomerNotes(id, request.getNotes());
        return ResponseUtil.success(response, "Cập nhật ghi chú khách hàng thành công");
    }

    @PostMapping("/{id}/record-visit")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<CustomerResponse>> recordCustomerVisit(@PathVariable Long id) {
        CustomerResponse response = customerService.recordCustomerVisit(id);
        return ResponseUtil.success(response, "Ghi lại lần ghé khách hàng thành công");
    }
}
