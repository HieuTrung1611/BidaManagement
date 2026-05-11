package com.mhbilliards.billiards_management.service.combo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mhbilliards.billiards_management.dto.combo.ComboResponseDTO;
import com.mhbilliards.billiards_management.dto.combo.CreateComboDTO;
import com.mhbilliards.billiards_management.dto.combo.UpdateComboDTO;
import com.mhbilliards.billiards_management.entity.Branch;
import com.mhbilliards.billiards_management.entity.Combo;
import com.mhbilliards.billiards_management.mapper.ComboMapper;
import com.mhbilliards.billiards_management.repository.BranchRepository;
import com.mhbilliards.billiards_management.repository.ComboRepository;
import com.mhbilliards.billiards_management.specification.ComboSpecification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ComboServiceImpl implements ComboService {

    private final ComboRepository comboRepository;
    private final BranchRepository branchRepository;
    private final ComboMapper comboMapper;

    @Override
    @Transactional
    public ComboResponseDTO createCombo(CreateComboDTO request) {
        // Validate branch exists
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new RuntimeException("Chi nhánh không tồn tại"));

        // Validate discounted price < regular price
        if (request.getDiscountedPrice() >= request.getRegularPrice()) {
            throw new IllegalArgumentException("Giá combo phải nhỏ hơn giá gốc");
        }

        Combo combo = comboMapper.toEntity(request);
        combo.setBranch(branch);

        Combo savedCombo = comboRepository.save(combo);
        return toResponseDTOWithCalculations(savedCombo);
    }

    @Override
    @Transactional(readOnly = true)
    public ComboResponseDTO getComboById(Long id) {
        Combo combo = comboRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Combo không tồn tại"));
        return toResponseDTOWithCalculations(combo);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ComboResponseDTO> searchCombos(String keyword, Long branchId, Boolean isActive, Pageable pageable) {
        Specification<Combo> spec = Specification.where(ComboSpecification.hasKeyword(keyword))
                .and(ComboSpecification.hasBranchId(branchId))
                .and(ComboSpecification.isActive(isActive));

        Page<Combo> combos = comboRepository.findAll(spec, pageable);
        return combos.map(this::toResponseDTOWithCalculations);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComboResponseDTO> getCombosByBranch(Long branchId) {
        List<Combo> combos = comboRepository.findByBranchId(branchId);
        return combos.stream()
                .map(this::toResponseDTOWithCalculations)
                .toList();
    }

    @Override
    @Transactional
    public ComboResponseDTO updateCombo(Long id, UpdateComboDTO request) {
        Combo combo = comboRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Combo không tồn tại"));

        // Validate discounted price < regular price if provided
        Double newDiscountedPrice = request.getDiscountedPrice() != null
                ? request.getDiscountedPrice()
                : combo.getDiscountedPrice();
        Double newRegularPrice = request.getRegularPrice() != null
                ? request.getRegularPrice()
                : combo.getRegularPrice();

        if (newDiscountedPrice >= newRegularPrice) {
            throw new IllegalArgumentException("Giá combo phải nhỏ hơn giá gốc");
        }

        comboMapper.updateEntity(request, combo);
        Combo updatedCombo = comboRepository.save(combo);
        return toResponseDTOWithCalculations(updatedCombo);
    }

    @Override
    @Transactional
    public void deleteCombo(Long id) {
        if (!comboRepository.existsById(id)) {
            throw new RuntimeException("Combo không tồn tại");
        }
        comboRepository.deleteById(id);
    }

    private ComboResponseDTO toResponseDTOWithCalculations(Combo combo) {
        ComboResponseDTO dto = comboMapper.toResponseDTO(combo);

        // Calculate savings
        Double savingsAmount = combo.getRegularPrice() - combo.getDiscountedPrice();
        Integer savingsPercent = combo.getRegularPrice() > 0
                ? (int) Math.round((savingsAmount / combo.getRegularPrice()) * 100)
                : 0;

        dto.setSavingsAmount(savingsAmount);
        dto.setSavingsPercent(savingsPercent);

        return dto;
    }
}
