package com.mhbilliards.billiards_management.service.comboItem;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mhbilliards.billiards_management.dto.comboItem.ComboItemResponseDTO;
import com.mhbilliards.billiards_management.dto.comboItem.CreateComboItemDTO;
import com.mhbilliards.billiards_management.dto.comboItem.UpdateComboItemDTO;
import com.mhbilliards.billiards_management.entity.Combo;
import com.mhbilliards.billiards_management.entity.ComboItem;
import com.mhbilliards.billiards_management.entity.Equipment;
import com.mhbilliards.billiards_management.entity.Product;
import com.mhbilliards.billiards_management.enums.ComboItemType;
import com.mhbilliards.billiards_management.repository.ComboItemRepository;
import com.mhbilliards.billiards_management.repository.ComboRepository;
import com.mhbilliards.billiards_management.repository.EquipmentRepository;
import com.mhbilliards.billiards_management.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ComboItemServiceImpl implements ComboItemService {

    private final ComboItemRepository comboItemRepository;
    private final ComboRepository comboRepository;
    private final ProductRepository productRepository;
    private final EquipmentRepository equipmentRepository;

    @Override
    @Transactional
    public ComboItemResponseDTO addItemToCombo(CreateComboItemDTO request) {
        Combo combo = comboRepository.findById(request.getComboId())
                .orElseThrow(() -> new RuntimeException("Combo không tồn tại"));

        // Validate that itemId exists in the correct table
        if (request.getItemType() == ComboItemType.PRODUCT) {
            productRepository.findById(request.getItemId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        } else if (request.getItemType() == ComboItemType.EQUIPMENT) {
            equipmentRepository.findById(request.getItemId())
                    .orElseThrow(() -> new RuntimeException("Thiết bị không tồn tại"));
        }

        ComboItem comboItem = ComboItem.builder()
                .combo(combo)
                .itemType(request.getItemType())
                .itemId(request.getItemId())
                .quantity(request.getQuantity())
                .build();

        ComboItem savedComboItem = comboItemRepository.save(comboItem);
        return mapToResponseDTO(savedComboItem);
    }

    @Override
    @Transactional(readOnly = true)
    public ComboItemResponseDTO getComboItemById(Long id) {
        ComboItem comboItem = comboItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Combo item không tồn tại"));
        return mapToResponseDTO(comboItem);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComboItemResponseDTO> getComboItemsByComboId(Long comboId) {
        List<ComboItem> comboItems = comboItemRepository.findByComboId(comboId);
        return comboItems.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ComboItemResponseDTO updateComboItem(Long id, UpdateComboItemDTO request) {
        ComboItem comboItem = comboItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Combo item không tồn tại"));

        if (request.getItemType() != null) {
            comboItem.setItemType(request.getItemType());
        }
        if (request.getItemId() != null) {
            // Validate new itemId
            if (comboItem.getItemType() == ComboItemType.PRODUCT) {
                productRepository.findById(request.getItemId())
                        .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
            } else if (comboItem.getItemType() == ComboItemType.EQUIPMENT) {
                equipmentRepository.findById(request.getItemId())
                        .orElseThrow(() -> new RuntimeException("Thiết bị không tồn tại"));
            }
            comboItem.setItemId(request.getItemId());
        }
        if (request.getQuantity() != null) {
            comboItem.setQuantity(request.getQuantity());
        }

        ComboItem updatedComboItem = comboItemRepository.save(comboItem);
        return mapToResponseDTO(updatedComboItem);
    }

    @Override
    @Transactional
    public void deleteComboItem(Long id) {
        ComboItem comboItem = comboItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Combo item không tồn tại"));
        comboItemRepository.delete(comboItem);
    }

    @Override
    @Transactional
    public void deleteAllItemsByComboId(Long comboId) {
        comboItemRepository.deleteByComboId(comboId);
    }

    private ComboItemResponseDTO mapToResponseDTO(ComboItem comboItem) {
        String itemName = resolveItemName(comboItem.getItemType(), comboItem.getItemId());
        String unit = null;

        if (comboItem.getItemType() == ComboItemType.PRODUCT) {
            Product product = productRepository.findById(comboItem.getItemId()).orElse(null);
            if (product != null) {
                unit = product.getUnit();
            }
        }

        return ComboItemResponseDTO.builder()
                .id(comboItem.getId())
                .comboId(comboItem.getCombo().getId())
                .itemType(comboItem.getItemType())
                .itemId(comboItem.getItemId())
                .itemName(itemName)
                .quantity(comboItem.getQuantity())
                .unit(unit)
                .createdAt(comboItem.getCreatedAt())
                .updatedAt(comboItem.getUpdatedAt())
                .build();
    }

    private String resolveItemName(ComboItemType itemType, Long itemId) {
        if (itemType == ComboItemType.PRODUCT) {
            return productRepository.findById(itemId)
                    .map(Product::getName)
                    .orElse("Unknown Product");
        } else if (itemType == ComboItemType.EQUIPMENT) {
            return equipmentRepository.findById(itemId)
                    .map(Equipment::getName)
                    .orElse("Unknown Equipment");
        }
        return "Unknown Item";
    }
}
