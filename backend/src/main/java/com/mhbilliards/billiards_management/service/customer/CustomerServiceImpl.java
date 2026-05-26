package com.mhbilliards.billiards_management.service.customer;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
import com.mhbilliards.billiards_management.repository.CustomerRepository;
import com.mhbilliards.billiards_management.service.cloundinary.CloudinaryService;
import com.mhbilliards.billiards_management.service.faceAi.FaceAIService;
import com.mhbilliards.billiards_management.specification.CustomerSpecification;

import lombok.RequiredArgsConstructor;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final CloudinaryService cloudinaryService;
    private final FaceAIService faceAIService;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public CustomerResponse createCustomer(CustomerRequest request) {
        if (customerRepository.findByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new RuntimeException("Đã tồn tại email này");
        }

        if (customerRepository.findByPhoneNumberIgnoreCase(request.getPhoneNumber()).isPresent()) {
            throw new RuntimeException("Đã tồn tại số điện thoại này");
        }

        Customer customer = customerMapper.toEntity(request);
        customer.setIsActive(true);
        if (customer.getRank() == null) {
            customer.setRank(CustomerRank.BRONZE);
        }

        Customer savedCustomer = customerRepository.save(customer);
        return customerMapper.toResponse(customerRepository.findDetailedById(savedCustomer.getId())
                .orElseThrow(() -> new RuntimeException("Đã tồn tại email này")));
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findDetailedById(id)
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));

        return customerMapper.toResponse(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerResponse> searchCustomers(String keyword, Long branchId, Pageable pageable) {
        Specification<Customer> specification = Specification
                .where(CustomerSpecification.hasKeyword(keyword));

        Page<Customer> customers = customerRepository.findAll(specification, pageable);
        return customers.map(customerMapper::toResponse);
    }

    @Override
    @Transactional
    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {
        Customer customer = customerRepository.findDetailedById(id)
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));

        // Check email uniqueness (excluding current customer)
        if (!customer.getEmail().equalsIgnoreCase(request.getEmail())
                && customerRepository.findByEmailIgnoreCaseAndIdNot(request.getEmail(), id).isPresent()) {
            throw new RuntimeException("Đã tồn tại email này");
        }

        // Check phone uniqueness (excluding current customer)
        if (!customer.getPhoneNumber().equalsIgnoreCase(request.getPhoneNumber())
                && customerRepository.findByPhoneNumberIgnoreCaseAndIdNot(request.getPhoneNumber(), id).isPresent()) {
            throw new RuntimeException("Đã tồn tại số điện thoại này");
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

        customerRepository.delete(customer);
    }

    @Override
    @Transactional
    public void deactivateCustomer(Long id) {
        Customer customer = customerRepository.findDetailedById(id)
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));

        customer.setIsActive(false);
        customerRepository.save(customer);
    }

    @Override
    @Transactional
    public void reactivateCustomer(Long id) {
        Customer customer = customerRepository.findDetailedById(id)
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));

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

        customer.setVisitCount((customer.getVisitCount() != null ? customer.getVisitCount() : 0) + 1);
        customer.setLastVisitDate(java.time.LocalDateTime.now());
        Customer updatedCustomer = customerRepository.save(customer);

        return customerMapper.toResponse(customerRepository.findDetailedById(updatedCustomer.getId())
                .orElseThrow(() -> new RuntimeException("Không thể lấy khách hàng sau ghi lại lần ghé")));
    }

    @Override
    @Transactional(readOnly = true)
    public FaceRecognitionResponse recognizeFaceFromImage(MultipartFile file, Long branchId) {
        System.out.println("🔵 [FACE-RECOGNITION] Starting face recognition (system-wide search)");

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

            // 2. Lấy tất cả khách hàng có faceEmbedding (toàn hệ thống)
            List<Customer> customersWithFace = customerRepository.findAll(
                    CustomerSpecification.hasFaceEmbedding());
            System.out.println(
                    "🔵 [FACE-RECOGNITION] Found " + customersWithFace.size()
                            + " customers with face embeddings (system-wide)");

            if (customersWithFace.isEmpty()) {
                return FaceRecognitionResponse.builder()
                        .matched(false)
                        .message("Không có khách hàng nào với dữ liệu khuôn mặt trong hệ thống")
                        .build();
            }

            // 3. So sánh với từng khách hàng và tìm người khớp nhất
            double threshold = 0.5; // Ngưỡng similarity cho Facenet512 (giảm từ 0.6 xuống 0.5)
            Customer bestMatch = null;
            double bestSimilarity = 0.0;
            List<Customer> duplicateMatches = new ArrayList<>();

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
                            + "): similarity = " + String.format("%.4f", similarity));

                    // Check for duplicate/very similar embeddings (>= 0.95 similarity)
                    if (similarity >= 0.95 && bestSimilarity >= 0.95 && Math.abs(similarity - bestSimilarity) < 0.01) {
                        duplicateMatches.add(customer);
                        System.out.println("⚠️ [FACE-RECOGNITION] Potential duplicate embedding detected for customer "
                                + customer.getId() + " (similarity: " + String.format("%.4f", similarity) + ")");
                    }

                    if (similarity > bestSimilarity) {
                        bestSimilarity = similarity;
                        bestMatch = customer;
                        duplicateMatches.clear(); // Reset duplicates when we find a better match
                    }
                } catch (Exception e) {
                    System.err.println("⚠️ [FACE-RECOGNITION] Error parsing embedding for customer " + customer.getId()
                            + ": " + e.getMessage());
                }
            }

            // 4. Kiểm tra threshold và trả kết quả
            if (bestMatch != null && bestSimilarity >= threshold) {
                System.out.println("✅ [FACE-RECOGNITION] Match found: Customer " + bestMatch.getId()
                        + " (" + bestMatch.getName() + ") with similarity " + String.format("%.4f", bestSimilarity));

                // Warning if duplicates detected
                if (!duplicateMatches.isEmpty()) {
                    System.out.println("⚠️ [FACE-RECOGNITION] WARNING: " + (duplicateMatches.size() + 1)
                            + " customers have very similar face embeddings. IDs: "
                            + bestMatch.getId() + ", "
                            + duplicateMatches.stream().map(c -> c.getId().toString())
                                    .collect(Collectors.joining(", ")));
                }

                CustomerResponse customerResponse = customerMapper.toResponse(
                        customerRepository.findDetailedById(bestMatch.getId())
                                .orElseThrow(() -> new RuntimeException("Không thể tải thông tin khách hàng")));

                String message = "Nhận diện thành công!";
                if (!duplicateMatches.isEmpty()) {
                    message += " (Cảnh báo: Có " + (duplicateMatches.size() + 1)
                            + " khách hàng có khuôn mặt giống nhau)";
                }

                return FaceRecognitionResponse.builder()
                        .matched(true)
                        .customer(customerResponse)
                        .similarity(bestSimilarity)
                        .message(message)
                        .build();
            } else {
                String detailMsg = bestSimilarity > 0
                        ? String.format("Độ tương đồng cao nhất: %.2f%% (cần >= %.0f%%)", bestSimilarity * 100,
                                threshold * 100)
                        : "Không tìm thấy khuôn mặt tương tự";
                System.out.println("❌ [FACE-RECOGNITION] No match found. Best similarity: "
                        + String.format("%.4f", bestSimilarity) + " (threshold: " + threshold + ")");
                return FaceRecognitionResponse.builder()
                        .matched(false)
                        .similarity(bestSimilarity)
                        .message("Không tìm thấy khách hàng phù hợp. " + detailMsg)
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
