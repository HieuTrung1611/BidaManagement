package com.mhbilliards.billiards_management.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mhbilliards.billiards_management.dto.branch.BranchCreationRequest;
import com.mhbilliards.billiards_management.dto.branch.BranchDetailResponse;
import com.mhbilliards.billiards_management.dto.branch.BranchResponse;
import com.mhbilliards.billiards_management.dto.branch.BranchUpdationRequest;
import com.mhbilliards.billiards_management.service.branch.BranchService;
import com.mhbilliards.billiards_management.utils.ApiResponse;
import com.mhbilliards.billiards_management.utils.ResponseUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/branches")
@RequiredArgsConstructor
public class BranchController {
    private final BranchService branchService;

    @PostMapping()
    public ResponseEntity<ApiResponse<BranchResponse>> createBranch(
            @Valid @RequestPart("data") BranchCreationRequest req,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        BranchResponse res = branchService.createBranch(req, images);
        return ResponseUtil.created(res, "Tạo chi nhánh thành công");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BranchResponse>> updateBranch(@PathVariable Long id,
            @Valid @RequestPart("data") BranchUpdationRequest req,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        BranchResponse res = branchService.updateBranch(id, req, images);
        return ResponseUtil.success(res, "Cập nhật chi nhánh thành công");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BranchDetailResponse>> getBranchById(@PathVariable Long id) {
        BranchDetailResponse res = branchService.getBranchById(id);
        return ResponseUtil.success(res, "Lấy chi nhánh thành công");
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<List<BranchResponse>>> getAllBranches() {
        List<BranchResponse> res = branchService.getAllBranches();
        return ResponseUtil.success(res, "Lấy tất cả chi nhánh thành công");
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<BranchResponse>>> searchBranches(@RequestParam String keyword,
            Pageable pageable) {
        Page<BranchResponse> res = branchService.searchBranch(keyword, pageable);
        return ResponseUtil.success(res, "Lấy tất cả chi nhánh thành công");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBranch(@PathVariable Long id) {
        branchService.deleteBranch(id);
        return ResponseUtil.success(null, "Xóa chi nhánh thành công");
    }
}
