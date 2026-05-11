package com.mhbilliards.billiards_management.service.comboItem;

import com.mhbilliards.billiards_management.dto.comboItem.ComboItemResponseDTO;
import com.mhbilliards.billiards_management.dto.comboItem.CreateComboItemDTO;
import com.mhbilliards.billiards_management.dto.comboItem.UpdateComboItemDTO;

import java.util.List;

public interface ComboItemService {
    ComboItemResponseDTO addItemToCombo(CreateComboItemDTO request);

    ComboItemResponseDTO getComboItemById(Long id);

    List<ComboItemResponseDTO> getComboItemsByComboId(Long comboId);

    ComboItemResponseDTO updateComboItem(Long id, UpdateComboItemDTO request);

    void deleteComboItem(Long id);

    void deleteAllItemsByComboId(Long comboId);
}
