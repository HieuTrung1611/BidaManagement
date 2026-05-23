package com.mhbilliards.billiards_management.service.customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.mhbilliards.billiards_management.dto.customer.CustomerRequest;
import com.mhbilliards.billiards_management.dto.customer.CustomerResponse;
import com.mhbilliards.billiards_management.dto.customer.FaceRecognitionResponse;

public interface CustomerService {
    CustomerResponse createCustomer(CustomerRequest request);

    CustomerResponse getCustomerById(Long id);

    Page<CustomerResponse> searchCustomers(String keyword, Long branchId, Pageable pageable);

    CustomerResponse updateCustomer(Long id, CustomerRequest request);

    void deleteCustomer(Long id);

    void deactivateCustomer(Long id);

    void reactivateCustomer(Long id);

    CustomerResponse updateCustomerNotes(Long id, String notes);

    CustomerResponse recordCustomerVisit(Long id);

    CustomerResponse uploadCustomerPhoto(Long id, MultipartFile file);

    // Face Recognition for Self-Service
    FaceRecognitionResponse recognizeFaceFromImage(MultipartFile file, Long branchId);
}
