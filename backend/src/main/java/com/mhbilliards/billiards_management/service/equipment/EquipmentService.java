package com.mhbilliards.billiards_management.service.equipment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.mhbilliards.billiards_management.dto.equipment.CreateEquipmentDTO;
import com.mhbilliards.billiards_management.dto.equipment.EquipmentResponseDTO;
import com.mhbilliards.billiards_management.dto.equipment.UpdateEquipmentDTO;
import com.mhbilliards.billiards_management.enums.EquipmentType;

import java.util.List;

public interface EquipmentService {
    EquipmentResponseDTO createEquipment(CreateEquipmentDTO request);

    EquipmentResponseDTO getEquipmentById(Long id);

    Page<EquipmentResponseDTO> searchEquipments(String keyword, EquipmentType type, Long branchId, Pageable pageable);

    List<EquipmentResponseDTO> getEquipmentsByBranch(Long branchId);

    List<EquipmentResponseDTO> getAvailableEquipments(Long branchId);

    EquipmentResponseDTO updateEquipment(Long id, UpdateEquipmentDTO request);

    void deleteEquipment(Long id);

    EquipmentResponseDTO updateAvailableQuantity(Long id, Integer quantity, boolean isReturn);
}
