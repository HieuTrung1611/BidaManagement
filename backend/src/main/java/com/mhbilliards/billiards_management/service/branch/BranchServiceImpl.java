package com.mhbilliards.billiards_management.service.branch;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.mhbilliards.billiards_management.dto.branch.BranchRequest;
import com.mhbilliards.billiards_management.dto.branch.BranchResponse;
import com.mhbilliards.billiards_management.entity.Branch;
import com.mhbilliards.billiards_management.repository.BranchRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BranchServiceImpl implements BranchService {

    private final BranchRepository branchRepository;

    public BranchResponse mapToResponse(Branch branch) {
        return BranchResponse.builder()
                .id(branch.getId())
                .name(branch.getName())
                .address(branch.getAddress())
                .description(branch.getDescription())
                .build();
    }

    private Branch mapToEntity(BranchRequest req) {
        Branch branch = new Branch();
        branch.setName(req.getName());
        branch.setAddress(req.getAddress());
        branch.setPhoneNumber(req.getPhoneNumber());
        branch.setDescription(req.getDescription());
        return branch;
    }

    private void updateEntity(Branch branch, BranchRequest req) {
        branch.setName(req.getName());
        branch.setAddress(req.getAddress());
        branch.setPhoneNumber(req.getPhoneNumber());
        branch.setDescription(req.getDescription());
    }

    @Override
    public BranchResponse createBranch(BranchRequest req) {
        if (branchRepository.existsByName(req.getName())) {
            throw new IllegalArgumentException("Branch with name " + req.getName() + " already exists");
        }

        Branch branch = mapToEntity(req);
        branch = branchRepository.save(branch);
        return mapToResponse(branch);
    }

    @Override
    public BranchResponse updateBranch(Long id, BranchRequest req) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Branch with id " + id + " not found"));

        if (!branch.getName().equals(req.getName()) && branchRepository.existsByName(req.getName())) {
            throw new IllegalArgumentException("Branch with name " + req.getName() + " already exists");
        }

        updateEntity(branch, req);
        branch = branchRepository.save(branch);
        return mapToResponse(branch);
    }

    @Override
    public BranchResponse getBranchById(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Branch with id " + id + " not found"));
        return mapToResponse(branch);
    }

    @Override
    public Page<BranchResponse> getAllBranches(Pageable pageable) {
        Page<Branch> branches = branchRepository.findAll(pageable);
        return branches.map(this::mapToResponse);
    }

    @Override
    public void deleteBranch(Long id) {
        if (!branchRepository.existsById(id)) {
            throw new IllegalArgumentException("Branch with id " + id + " not found");
        }
        branchRepository.deleteById(id);
    }

}
