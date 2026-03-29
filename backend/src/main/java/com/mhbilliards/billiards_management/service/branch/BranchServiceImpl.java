package com.mhbilliards.billiards_management.service.branch;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.mhbilliards.billiards_management.dto.branch.BranchCreationRequest;
import com.mhbilliards.billiards_management.dto.branch.BranchDetailResponse;
import com.mhbilliards.billiards_management.dto.branch.BranchResponse;
import com.mhbilliards.billiards_management.dto.branch.BranchUpdationRequest;
import com.mhbilliards.billiards_management.entity.Branch;
import com.mhbilliards.billiards_management.entity.BranchImage;
import com.mhbilliards.billiards_management.mapper.BranchMapper;
import com.mhbilliards.billiards_management.repository.BranchRepository;
import com.mhbilliards.billiards_management.service.cloundinary.CloudinaryService;
import com.mhbilliards.billiards_management.specification.BranchSpecification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BranchServiceImpl implements BranchService {

    private static final String MANAGER_POSITION_CODE = "MANAGER";

    private final ExecutorService uploadExecutor = Executors.newFixedThreadPool(5);

    private final BranchRepository branchRepository;

    private final BranchMapper branchMapper;

    private final CloudinaryService cloudinaryService;

    @Override
    public BranchResponse createBranch(BranchCreationRequest req, List<MultipartFile> images) {
        if (branchRepository.existsByName(req.getName())) {
            throw new IllegalArgumentException("Tên chi nhánh đã tồn tại");
        }

        Branch branch = branchMapper.toEntity(req);

        List<String> uploadedPublicIds = Collections.synchronizedList(new ArrayList<>());

        // Upload ảnh lên Cloudinary song song (parallel)
        if (images != null && !images.isEmpty()) {
            try {
                // Tạo list các CompletableFuture để upload song song
                List<CompletableFuture<BranchImage>> uploadFutures = new ArrayList<>();

                for (MultipartFile image : images) {
                    CompletableFuture<BranchImage> future = CompletableFuture.supplyAsync(() -> {
                        try {
                            Map<String, Object> uploadResult = cloudinaryService.uploadFile(image);
                            String imageUrl = uploadResult.get("secure_url").toString();
                            String publicId = uploadResult.get("public_id").toString();
                            uploadedPublicIds.add(publicId);

                            return BranchImage.builder()
                                    .url(imageUrl)
                                    .branch(branch)
                                    .publicId(publicId)
                                    .build();
                        } catch (IOException e) {
                            throw new RuntimeException("Lỗi khi upload ảnh: " + e.getMessage());
                        }
                    }, uploadExecutor);

                    uploadFutures.add(future);
                }

                // Chờ tất cả uploads hoàn thành
                CompletableFuture<Void> allUploads = CompletableFuture.allOf(
                        uploadFutures.toArray(new CompletableFuture[0]));

                // Lấy kết quả
                allUploads.join();
                List<BranchImage> branchImages = uploadFutures.stream()
                        .map(CompletableFuture::join)
                        .collect(Collectors.toList());

                branch.setBranchImages(branchImages);
                branchRepository.saveAndFlush(branch);
            } catch (Exception e) {
                // rollback cloud images
                for (String publicId : uploadedPublicIds) {

                    try {

                        cloudinaryService.deleteFile(publicId);

                    } catch (Exception ex) {

                        System.out.println(
                                "Cannot delete image: " + publicId);

                    }

                }

                throw new RuntimeException(
                        "Lỗi khi upload ảnh: " + e.getMessage());
            }
        } else {

            branchRepository.save(branch);

        }
        BranchResponse response = branchMapper.toResponse(branch);
        return response;
    }

    @Override
    public BranchResponse updateBranch(Long id, BranchUpdationRequest req, List<MultipartFile> images) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Chi nhánh không tồn tại"));

        if (!branch.getName().equals(req.getName()) && branchRepository.existsByName(req.getName())) {
            throw new IllegalArgumentException("Tên chi nhánh đã tồn tại");
        }

        branchMapper.updateEntity(req, branch);
        // Xóa những ảnh mà user chọn xóa (nếu có)
        if (req.getDeleteImageIds() != null && !req.getDeleteImageIds().isEmpty()) {
            List<BranchImage> existingImages = branch.getBranchImages();
            if (existingImages != null && !existingImages.isEmpty()) {
                List<BranchImage> imagesToDelete = new ArrayList<>();

                for (Long imageId : req.getDeleteImageIds()) {
                    existingImages.stream()
                            .filter(img -> img.getId().equals(imageId))
                            .findFirst()
                            .ifPresent(image -> {
                                imagesToDelete.add(image);
                                // Xóa trên Cloudinary
                                try {
                                    String publicId = image.getPublicId();
                                    if (publicId != null) {
                                        cloudinaryService.deleteFile(publicId);
                                    }
                                } catch (IOException e) {
                                    System.err.println("Lỗi khi xóa ảnh: " + e.getMessage());
                                }
                            });
                }

                // Xóa khỏi collection
                existingImages.removeAll(imagesToDelete);
            }
        }

        // Thêm ảnh mới (nếu có)
        if (images != null && !images.isEmpty()) {
            try {
                List<CompletableFuture<BranchImage>> uploadFutures = new ArrayList<>();

                for (MultipartFile image : images) {
                    CompletableFuture<BranchImage> future = CompletableFuture.supplyAsync(() -> {
                        try {
                            Map<String, Object> uploadResult = cloudinaryService.uploadFile(image);
                            String imageUrl = uploadResult.get("secure_url").toString();
                            String publicId = uploadResult.get("public_id").toString();

                            return BranchImage.builder()
                                    .url(imageUrl)
                                    .publicId(publicId)
                                    .branch(branch)
                                    .build();
                        } catch (IOException e) {
                            throw new RuntimeException("Lỗi khi upload ảnh: " + e.getMessage());
                        }
                    }, uploadExecutor);

                    uploadFutures.add(future);
                }

                // Chờ tất cả uploads hoàn thành
                CompletableFuture<Void> allUploads = CompletableFuture.allOf(
                        uploadFutures.toArray(new CompletableFuture[0]));

                allUploads.join();
                List<BranchImage> newBranchImages = uploadFutures.stream()
                        .map(CompletableFuture::join)
                        .collect(Collectors.toList());

                // Add vào collection hiện tại (giữ lại ảnh cũ)
                if (branch.getBranchImages() == null) {
                    branch.setBranchImages(new ArrayList<>());
                }
                branch.getBranchImages().addAll(newBranchImages);
            } catch (Exception e) {
                throw new RuntimeException("Lỗi khi upload ảnh: " + e.getMessage());
            }
        }
        branchRepository.save(branch);
        BranchResponse res = branchMapper.toResponse(branch);
        res.setEmployeesCount(branch.getEmployees() == null ? 0 : branch.getEmployees().size());
        return res;
    }

    @Override
    public BranchDetailResponse getBranchById(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Chi nhánh không tồn tại"));
        BranchDetailResponse response = branchMapper.toDetailResponse(branch);
        branchRepository.findManagerContactByBranchId(id, MANAGER_POSITION_CODE)
                .ifPresent(manager -> {
                    response.setManagerName(manager.getManagerName());
                    response.setManagerPhoneNumber(manager.getManagerPhoneNumber());
                });
        response.setEmployeesCount(branch.getEmployees() == null ? 0 : branch.getEmployees().size());

        return response;
    }

    @Override
    public Page<BranchResponse> searchBranch(String keyword, Pageable pageable) {
        Page<Branch> branches = branchRepository.findAll(BranchSpecification.hasKeyword(keyword), pageable);
        return branches.map(branch -> {
            BranchResponse response = branchMapper.toResponse(branch);
            enrichManagerContact(branch.getId(), response);
            response.setEmployeesCount(branch.getEmployees() == null ? 0 : branch.getEmployees().size());
            return response;
        });
    }

    @Override
    public void deleteBranch(Long id) {
        if (!branchRepository.existsById(id)) {
            throw new IllegalArgumentException("Chi nhánh không tồn tại");
        }
        branchRepository.deleteById(id);
    }

    private void enrichManagerContact(Long branchId, BranchResponse response) {
        branchRepository.findManagerContactByBranchId(branchId, MANAGER_POSITION_CODE)
                .ifPresent(manager -> {
                    response.setManagerName(manager.getManagerName());
                    response.setManagerPhoneNumber(manager.getManagerPhoneNumber());
                });
    }

    @Override
    public List<BranchResponse> getAllBranches() {
        List<Branch> branches = branchRepository.findAll();
        return branches.stream().map(branch -> {
            BranchResponse response = branchMapper.toResponse(branch);
            enrichManagerContact(branch.getId(), response);
            response.setEmployeesCount(branch.getEmployees() == null ? 0 : branch.getEmployees().size());
            return response;
        }).collect(Collectors.toList());
    }

}
