package com.mhbilliards.billiards_management.service.branch;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.mhbilliards.billiards_management.dto.branch.BranchRequest;
import com.mhbilliards.billiards_management.dto.branch.BranchResponse;

public interface BranchService {
    BranchResponse createBranch(BranchRequest req);

    BranchResponse updateBranch(Long id, BranchRequest req);

    BranchResponse getBranchById(Long id);

    Page<BranchResponse> getAllBranches(Pageable pageable);

    void deleteBranch(Long id);
}
