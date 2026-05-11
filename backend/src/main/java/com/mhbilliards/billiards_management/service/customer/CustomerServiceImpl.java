package com.mhbilliards.billiards_management.service.customer;

import java.io.IOException;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.mhbilliards.billiards_management.dto.customer.CustomerRequest;
import com.mhbilliards.billiards_management.dto.customer.CustomerResponse;
import com.mhbilliards.billiards_management.entity.Customer;
import com.mhbilliards.billiards_management.mapper.CustomerMapper;
import com.mhbilliards.billiards_management.repository.BranchRepository;
import com.mhbilliards.billiards_management.repository.CustomerRepository;
import com.mhbilliards.billiards_management.service.base.CurrentUserAccessService;
import com.mhbilliards.billiards_management.service.cloundinary.CloudinaryService;
import com.mhbilliards.billiards_management.specification.CustomerSpecification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final BranchRepository branchRepository;
    private final CustomerMapper customerMapper;
    private final CurrentUserAccessService currentUserAccessService;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional
    public CustomerResponse createCustomer(CustomerRequest request) {
        Long branchId = currentUserAccessService.resolveAccessibleBranchId(request.getBranchId());

        if (customerRepository.findByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email này đã được sử dụng");
        }

        if (customerRepository.findByPhoneNumberIgnoreCase(request.getPhoneNumber()).isPresent()) {
            throw new RuntimeException("Số điện thoại này đã được sử dụng");
        }

        branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Chi nhánh không tồn tại"));

        Customer customer = customerMapper.toEntity(request);
        customer.setBranch(branchRepository.getReferenceById(branchId));
        customer.setIsActive(true);

        Customer savedCustomer = customerRepository.save(customer);
        return customerMapper.toResponse(customerRepository.findDetailedById(savedCustomer.getId())
                .orElseThrow(() -> new RuntimeException("Không thể lấy khách hàng vừa tạo")));
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findDetailedById(id)
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));

        currentUserAccessService.resolveAccessibleBranchId(customer.getBranch().getId());

        return customerMapper.toResponse(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerResponse> searchCustomers(String keyword, Long branchId, Pageable pageable) {
        Long accessibleBranchId = currentUserAccessService.resolveAccessibleBranchId(branchId);

        Specification<Customer> specification = Specification
                .where(CustomerSpecification.hasBranchId(accessibleBranchId))
                .and(CustomerSpecification.hasKeyword(keyword));

        Page<Customer> customers = customerRepository.findAll(specification, pageable);
        return customers.map(customerMapper::toResponse);
    }

    @Override
    @Transactional
    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {
        Customer customer = customerRepository.findDetailedById(id)
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));

        currentUserAccessService.resolveAccessibleBranchId(customer.getBranch().getId());

        // Check email uniqueness (excluding current customer)
        if (!customer.getEmail().equalsIgnoreCase(request.getEmail())
                && customerRepository.findByEmailIgnoreCaseAndIdNot(request.getEmail(), id).isPresent()) {
            throw new RuntimeException("Email này đã được sử dụng");
        }

        // Check phone uniqueness (excluding current customer)
        if (!customer.getPhoneNumber().equalsIgnoreCase(request.getPhoneNumber())
                && customerRepository.findByPhoneNumberIgnoreCaseAndIdNot(request.getPhoneNumber(), id).isPresent()) {
            throw new RuntimeException("Số điện thoại này đã được sử dụng");
        }

        customerMapper.updateEntity(request, customer);
        if (request.getRank() != null) {
            customer.setRank(request.getRank());
        }
        Customer updatedCustomer = customerRepository.save(customer);

        return customerMapper.toResponse(customerRepository.findDetailedById(updatedCustomer.getId())
                .orElseThrow(() -> new RuntimeException("Không thể lấy khách hàng sau cập nhật")));
    }

    @Override
    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findDetailedById(id)
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));

        currentUserAccessService.resolveAccessibleBranchId(customer.getBranch().getId());

        customerRepository.delete(customer);
    }

    @Override
    @Transactional
    public void deactivateCustomer(Long id) {
        Customer customer = customerRepository.findDetailedById(id)
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));

        currentUserAccessService.resolveAccessibleBranchId(customer.getBranch().getId());

        customer.setIsActive(false);
        customerRepository.save(customer);
    }

    @Override
    @Transactional
    public void reactivateCustomer(Long id) {
        Customer customer = customerRepository.findDetailedById(id)
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));

        currentUserAccessService.resolveAccessibleBranchId(customer.getBranch().getId());

        customer.setIsActive(true);
        customerRepository.save(customer);
    }

    @Override
    @Transactional
    public CustomerResponse uploadCustomerPhoto(Long id, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Vui lòng chọn ảnh để tải lên");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("File tải lên phải là ảnh");
        }

        Customer customer = customerRepository.findDetailedById(id)
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));

        currentUserAccessService.resolveAccessibleBranchId(customer.getBranch().getId());

        try {
            Map<String, Object> uploadResult = cloudinaryService.uploadFile(file);
            String uploadedUrl = (String) uploadResult.get("secure_url");
            if (uploadedUrl == null || uploadedUrl.isBlank()) {
                throw new RuntimeException("Không lấy được URL ảnh từ Cloudinary");
            }

            customer.setPhotoUrl(uploadedUrl);
            Customer updatedCustomer = customerRepository.save(customer);

            return customerMapper.toResponse(customerRepository.findDetailedById(updatedCustomer.getId())
                    .orElseThrow(() -> new RuntimeException("Không thể lấy khách hàng sau upload ảnh")));
        } catch (IOException e) {
            throw new RuntimeException("Upload ảnh lên Cloudinary thất bại", e);
        }
    }

    @Override
    @Transactional
    public CustomerResponse updateCustomerNotes(Long id, String notes) {
        Customer customer = customerRepository.findDetailedById(id)
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));

        currentUserAccessService.resolveAccessibleBranchId(customer.getBranch().getId());

        customer.setCustomerNotes(notes);
        Customer updatedCustomer = customerRepository.save(customer);

        return customerMapper.toResponse(customerRepository.findDetailedById(updatedCustomer.getId())
                .orElseThrow(() -> new RuntimeException("Không thể lấy khách hàng sau cập nhật ghi chú")));
    }

    @Override
    @Transactional
    public CustomerResponse recordCustomerVisit(Long id) {
        Customer customer = customerRepository.findDetailedById(id)
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));

        currentUserAccessService.resolveAccessibleBranchId(customer.getBranch().getId());

        customer.setVisitCount((customer.getVisitCount() != null ? customer.getVisitCount() : 0) + 1);
        customer.setLastVisitDate(java.time.LocalDateTime.now());
        Customer updatedCustomer = customerRepository.save(customer);

        return customerMapper.toResponse(customerRepository.findDetailedById(updatedCustomer.getId())
                .orElseThrow(() -> new RuntimeException("Không thể lấy khách hàng sau ghi lại lần ghé")));
    }
}
