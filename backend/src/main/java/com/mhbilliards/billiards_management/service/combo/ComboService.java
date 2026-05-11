package com.mhbilliards.billiards_management.service.combo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.mhbilliards.billiards_management.dto.combo.ComboResponseDTO;
import com.mhbilliards.billiards_management.dto.combo.CreateComboDTO;
import com.mhbilliards.billiards_management.dto.combo.UpdateComboDTO;

public interface ComboService {
    ComboResponseDTO createCombo(CreateComboDTO request);

    ComboResponseDTO getComboById(Long id);

    Page<ComboResponseDTO> searchCombos(String keyword, Long branchId, Boolean isActive, Pageable pageable);

    List<ComboResponseDTO> getCombosByBranch(Long branchId);

    ComboResponseDTO updateCombo(Long id, UpdateComboDTO request);

    void deleteCombo(Long id);
}
