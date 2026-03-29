package com.mhbilliards.billiards_management.service.branch;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.mhbilliards.billiards_management.dto.branch.BranchCreationRequest;
import com.mhbilliards.billiards_management.dto.branch.BranchDetailResponse;
import com.mhbilliards.billiards_management.dto.branch.BranchResponse;
import com.mhbilliards.billiards_management.dto.branch.BranchUpdationRequest;

public interface BranchService {
    BranchResponse createBranch(BranchCreationRequest req, List<MultipartFile> images);

    BranchResponse updateBranch(Long id, BranchUpdationRequest req, List<MultipartFile> images);

    BranchDetailResponse getBranchById(Long id);

    List<BranchResponse> getAllBranches();

    Page<BranchResponse> searchBranch(String keyword, Pageable pageable);

    void deleteBranch(Long id);
}
