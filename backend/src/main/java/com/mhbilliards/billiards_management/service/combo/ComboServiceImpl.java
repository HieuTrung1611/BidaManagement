package com.mhbilliards.billiards_management.service.combo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mhbilliards.billiards_management.dto.combo.ComboItemRequestDTO;
import com.mhbilliards.billiards_management.dto.combo.ComboResponseDTO;
import com.mhbilliards.billiards_management.dto.combo.CreateComboDTO;
import com.mhbilliards.billiards_management.dto.combo.UpdateComboDTO;
import com.mhbilliards.billiards_management.entity.Branch;
import com.mhbilliards.billiards_management.entity.Combo;
import com.mhbilliards.billiards_management.entity.ComboItem;
import com.mhbilliards.billiards_management.enums.ComboItemType;
import com.mhbilliards.billiards_management.mapper.ComboMapper;
import com.mhbilliards.billiards_management.repository.BranchRepository;
import com.mhbilliards.billiards_management.repository.ComboItemRepository;
import com.mhbilliards.billiards_management.repository.ComboRepository;
import com.mhbilliards.billiards_management.repository.EquipmentRepository;
import com.mhbilliards.billiards_management.repository.ProductRepository;
import com.mhbilliards.billiards_management.specification.ComboSpecification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ComboServiceImpl implements ComboService {

    private final ComboRepository comboRepository;
    private final BranchRepository branchRepository;
    private final ComboItemRepository comboItemRepository;
    private final ProductRepository productRepository;
    private final EquipmentRepository equipmentRepository;
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

        // Validate items exist
        validateItems(request.getItems());

        Combo combo = comboMapper.toEntity(request);
        combo.setBranch(branch);

        // Initialize items list if null
        if (combo.getItems() == null) {
            combo.setItems(new ArrayList<>());
        }

        // Create combo items
        List<ComboItem> comboItems = createComboItems(combo, request.getItems());
        
        // Add items to the collection (don't replace it)
        combo.getItems().addAll(comboItems);

        // Save combo with items (cascade will save items automatically)
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

        // Update items if provided
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            // Validate items exist
            validateItems(request.getItems());

            // Initialize items list if null
            if (combo.getItems() == null) {
                combo.setItems(new ArrayList<>());
            }

            // Clear existing items (orphanRemoval will delete them)
            combo.getItems().clear();

            // Create new items
            List<ComboItem> newItems = createComboItems(combo, request.getItems());
            
            // Add new items to the cleared collection
            combo.getItems().addAll(newItems);
        }

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

        // Enrich combo items with itemName
        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            dto.getItems().forEach(itemDTO -> {
                if (itemDTO.getItemType() == ComboItemType.PRODUCT) {
                    productRepository.findById(itemDTO.getItemId()).ifPresent(product -> {
                        itemDTO.setItemName(product.getName());
                        itemDTO.setUnit(product.getUnit());
                    });
                } else if (itemDTO.getItemType() == ComboItemType.EQUIPMENT) {
                    equipmentRepository.findById(itemDTO.getItemId()).ifPresent(equipment -> {
                        itemDTO.setItemName(equipment.getName());
                    });
                }
            });
        }

        return dto;
    }

    /**
     * Validate that all items in the request exist in the database
     */
    private void validateItems(List<ComboItemRequestDTO> items) {
        for (ComboItemRequestDTO item : items) {
            if (item.getItemType() == ComboItemType.PRODUCT) {
                if (!productRepository.existsById(item.getItemId())) {
                    throw new RuntimeException("Sản phẩm ID " + item.getItemId() + " không tồn tại");
                }
            } else if (item.getItemType() == ComboItemType.EQUIPMENT) {
                if (!equipmentRepository.existsById(item.getItemId())) {
                    throw new RuntimeException("Thiết bị ID " + item.getItemId() + " không tồn tại");
                }
            }
        }
    }

    /**
     * Create ComboItem entities from request DTOs
     */
    private List<ComboItem> createComboItems(Combo combo, List<ComboItemRequestDTO> itemRequests) {
        List<ComboItem> comboItems = new ArrayList<>();
        for (ComboItemRequestDTO itemRequest : itemRequests) {
            ComboItem comboItem = ComboItem.builder()
                    .combo(combo)
                    .itemType(itemRequest.getItemType())
                    .itemId(itemRequest.getItemId())
                    .quantity(itemRequest.getQuantity())
                    .build();
            comboItems.add(comboItem);
        }
        return comboItems;
    }
}
