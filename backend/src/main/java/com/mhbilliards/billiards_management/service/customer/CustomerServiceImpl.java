package com.mhbilliards.billiards_management.service.customer;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.mhbilliards.billiards_management.dto.customer.CustomerRequest;
import com.mhbilliards.billiards_management.dto.customer.CustomerResponse;
import com.mhbilliards.billiards_management.dto.customer.FaceEmbeddingResponse;
import com.mhbilliards.billiards_management.dto.customer.FaceRecognitionResponse;
import com.mhbilliards.billiards_management.entity.Customer;
import com.mhbilliards.billiards_management.enums.CustomerRank;
import com.mhbilliards.billiards_management.mapper.CustomerMapper;
import com.mhbilliards.billiards_management.repository.BranchRepository;
import com.mhbilliards.billiards_management.repository.CustomerRepository;
import com.mhbilliards.billiards_management.service.base.CurrentUserAccessService;
import com.mhbilliards.billiards_management.service.cloundinary.CloudinaryService;
import com.mhbilliards.billiards_management.service.faceAi.FaceAIService;
import com.mhbilliards.billiards_management.specification.CustomerSpecification;

import lombok.RequiredArgsConstructor;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final BranchRepository branchRepository;
    private final CustomerMapper customerMapper;
    private final CurrentUserAccessService currentUserAccessService;
    private final CloudinaryService cloudinaryService;
    private final FaceAIService faceAIService;
    private final ObjectMapper objectMapper;

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
        if (customer.getRank() == null) {
            customer.setRank(CustomerRank.BRONZE);
        }

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
    public CustomerResponse uploadCustomerPhoto(
            Long id,
            MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Vui lòng chọn ảnh để tải lên");
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                !contentType.startsWith("image/")) {

            throw new RuntimeException(
                    "File tải lên phải là ảnh");
        }

        Customer customer = customerRepository
                .findDetailedById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Khách hàng không tồn tại"));

        currentUserAccessService.resolveAccessibleBranchId(
                customer.getBranch().getId());

        String uploadedUrl = null;
        String embeddingJson = null;

        try {
            // 1. Upload cloudinary
            System.out.println("🔵 [UPLOAD] Bắt đầu upload ảnh lên Cloudinary...");
            Map<String, Object> uploadResult = cloudinaryService.uploadFile(file);
            uploadedUrl = (String) uploadResult.get("secure_url");

            if (uploadedUrl == null || uploadedUrl.isBlank()) {
                throw new RuntimeException("Không lấy được URL ảnh từ Cloudinary");
            }
            System.out.println("✅ [UPLOAD] Upload Cloudinary thành công: " + uploadedUrl);

            // 2. Call AI create embedding
            System.out.println("🔵 [FACE-AI] Bắt đầu tạo embedding từ Face AI...");
            try {
                FaceEmbeddingResponse embeddingResponse = faceAIService.createEmbedding(file);

                if (embeddingResponse == null || embeddingResponse.getEmbedding() == null) {
                    throw new RuntimeException("Face AI không trả về embedding");
                }

                embeddingJson = objectMapper.writeValueAsString(
                        embeddingResponse.getEmbedding());

                System.out.println("✅ [FACE-AI] Tạo embedding thành công");

            } catch (Exception aiException) {
                System.err.println("❌ [FACE-AI] Lỗi khi tạo embedding: " + aiException.getMessage());
                aiException.printStackTrace();

                // Vẫn lưu ảnh nhưng không có embedding
                System.out.println("⚠️ [FACE-AI] Tiếp tục lưu ảnh mà không có embedding");
                embeddingJson = null;
            }

            // 3. Save DB
            System.out.println("🔵 [DATABASE] Lưu thông tin vào database...");
            customer.setPhotoUrl(uploadedUrl);
            customer.setFaceEmbedding(embeddingJson);

            Customer updatedCustomer = customerRepository.save(customer);
            System.out.println("✅ [DATABASE] Lưu database thành công");

            return customerMapper.toResponse(
                    customerRepository.findDetailedById(
                            updatedCustomer.getId()).orElseThrow(
                                    () -> new RuntimeException(
                                            "Không thể lấy khách hàng sau upload ảnh")));

        } catch (IOException e) {
            System.err.println("❌ [CLOUDINARY] Lỗi upload Cloudinary: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Upload ảnh lên Cloudinary thất bại", e);

        } catch (Exception e) {
            System.err.println("❌ [GENERAL] Lỗi chung: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Upload ảnh thất bại: " + e.getMessage(), e);
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

    @Override
    @Transactional(readOnly = true)
    public FaceRecognitionResponse recognizeFaceFromImage(MultipartFile file, Long branchId) {
        System.out.println("🔵 [FACE-RECOGNITION] Starting face recognition for branch: " + branchId);

        // Kiểm tra branch access
        currentUserAccessService.resolveAccessibleBranchId(branchId);

        try {
            // 1. Gọi Face AI để lấy embedding từ ảnh
            System.out.println("🔵 [FACE-RECOGNITION] Calling Face AI to extract embedding...");
            FaceEmbeddingResponse embeddingResponse = faceAIService.createEmbedding(file);

            if (!embeddingResponse.getSuccess() || embeddingResponse.getEmbedding() == null) {
                System.out.println("❌ [FACE-RECOGNITION] Face AI failed to extract embedding");
                return FaceRecognitionResponse.builder()
                        .matched(false)
                        .message("Không thể phát hiện khuôn mặt trong ảnh")
                        .build();
            }

            List<Double> inputEmbedding = embeddingResponse.getEmbedding();
            System.out.println("🔵 [FACE-RECOGNITION] Got embedding with " + inputEmbedding.size() + " dimensions");

            // 2. Lấy tất cả khách hàng có faceEmbedding trong branch
            List<Customer> customersWithFace = customerRepository.findAll(
                    CustomerSpecification.hasBranch(branchId)
                            .and(CustomerSpecification.hasFaceEmbedding()));
            System.out.println(
                    "🔵 [FACE-RECOGNITION] Found " + customersWithFace.size() + " customers with face embeddings");

            if (customersWithFace.isEmpty()) {
                return FaceRecognitionResponse.builder()
                        .matched(false)
                        .message("Không có khách hàng nào với dữ liệu khuôn mặt trong chi nhánh này")
                        .build();
            }

            // 3. So sánh với từng khách hàng và tìm người khớp nhất
            double threshold = 0.6; // Ngưỡng similarity cho Facenet512
            Customer bestMatch = null;
            double bestSimilarity = 0.0;

            ObjectMapper objectMapper = new ObjectMapper();
            for (Customer customer : customersWithFace) {
                try {
                    // Parse faceEmbedding từ JSON string
                    List<Double> storedEmbedding = objectMapper.readValue(
                            customer.getFaceEmbedding(),
                            objectMapper.getTypeFactory().constructCollectionType(List.class, Double.class));

                    // Tính cosine similarity
                    double similarity = calculateCosineSimilarity(inputEmbedding, storedEmbedding);
                    System.out.println("🔵 [FACE-RECOGNITION] Customer " + customer.getId() + " (" + customer.getName()
                            + "): similarity = " + similarity);

                    if (similarity > bestSimilarity) {
                        bestSimilarity = similarity;
                        bestMatch = customer;
                    }
                } catch (Exception e) {
                    System.err.println("⚠️ [FACE-RECOGNITION] Error parsing embedding for customer " + customer.getId()
                            + ": " + e.getMessage());
                }
            }

            // 4. Kiểm tra threshold và trả kết quả
            if (bestMatch != null && bestSimilarity >= threshold) {
                System.out.println("✅ [FACE-RECOGNITION] Match found: Customer " + bestMatch.getId()
                        + " with similarity " + bestSimilarity);
                CustomerResponse customerResponse = customerMapper.toResponse(
                        customerRepository.findDetailedById(bestMatch.getId())
                                .orElseThrow(() -> new RuntimeException("Không thể tải thông tin khách hàng")));

                return FaceRecognitionResponse.builder()
                        .matched(true)
                        .customer(customerResponse)
                        .similarity(bestSimilarity)
                        .message("Nhận diện thành công!")
                        .build();
            } else {
                System.out.println("❌ [FACE-RECOGNITION] No match found. Best similarity was: " + bestSimilarity);
                return FaceRecognitionResponse.builder()
                        .matched(false)
                        .similarity(bestSimilarity)
                        .message("Không tìm thấy khách hàng phù hợp (độ tương đồng thấp)")
                        .build();
            }

        } catch (Exception e) {
            System.err.println("❌ [FACE-RECOGNITION] Error during recognition: " + e.getMessage());
            e.printStackTrace();
            return FaceRecognitionResponse.builder()
                    .matched(false)
                    .message("Lỗi khi nhận diện khuôn mặt: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Tính cosine similarity giữa 2 vectors
     * Kết quả: 0 = hoàn toàn khác, 1 = hoàn toàn giống
     */
    private double calculateCosineSimilarity(List<Double> vec1, List<Double> vec2) {
        if (vec1.size() != vec2.size()) {
            throw new IllegalArgumentException("Vectors must have the same size");
        }

        double dotProduct = 0.0;
        double norm1 = 0.0;
        double norm2 = 0.0;

        for (int i = 0; i < vec1.size(); i++) {
            dotProduct += vec1.get(i) * vec2.get(i);
            norm1 += vec1.get(i) * vec1.get(i);
            norm2 += vec2.get(i) * vec2.get(i);
        }

        if (norm1 == 0.0 || norm2 == 0.0) {
            return 0.0;
        }

        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }
}
