package com.mhbilliards.billiards_management.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mhbilliards.billiards_management.dto.branch.BranchRequest;
import com.mhbilliards.billiards_management.dto.branch.BranchResponse;
import com.mhbilliards.billiards_management.service.branch.BranchService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/branches")
@RequiredArgsConstructor
public class BranchController {
    private final BranchService branchService;

    @PostMapping
    public ResponseEntity<ApiResponse<BranchResponse>> createBranch(@RequestBody BranchRequest req) {
        BranchResponse res = branchService.createBranch(req);
        return ResponseUtil.created(res, "Create branch successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BranchResponse>> updateBranch(@PathVariable Long id,
            @RequestBody BranchRequest req) {
        BranchResponse res = branchService.updateBranch(id, req);
        return ResponseUtil.success(res, "Update branch successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BranchResponse>> getBranchById(@PathVariable Long id) {
        BranchResponse res = branchService.getBranchById(id);
        return ResponseUtil.success(res, "Get branch successfully");
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<BranchResponse>>> getAllBranches(Pageable pageable) {
        Page<BranchResponse> res = branchService.getAllBranches(pageable);
        return ResponseUtil.success(res, "Get all branches successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBranch(@PathVariable Long id) {
        branchService.deleteBranch(id);
        return ResponseUtil.success(null, "Delete branch successfully");
    }
}
