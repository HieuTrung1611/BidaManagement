package com.mhbilliards.billiards_management.service.equipment;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mhbilliards.billiards_management.dto.equipment.CreateEquipmentDTO;
import com.mhbilliards.billiards_management.dto.equipment.EquipmentResponseDTO;
import com.mhbilliards.billiards_management.dto.equipment.UpdateEquipmentDTO;
import com.mhbilliards.billiards_management.entity.Branch;
import com.mhbilliards.billiards_management.entity.Equipment;
import com.mhbilliards.billiards_management.enums.EquipmentType;
import com.mhbilliards.billiards_management.mapper.EquipmentMapper;
import com.mhbilliards.billiards_management.repository.BranchRepository;
import com.mhbilliards.billiards_management.repository.EquipmentRepository;
import com.mhbilliards.billiards_management.specification.EquipmentSpecification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EquipmentServiceImpl implements EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final BranchRepository branchRepository;
    private final EquipmentMapper equipmentMapper;

    @Override
    @Transactional
    public EquipmentResponseDTO createEquipment(CreateEquipmentDTO request) {
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new RuntimeException("Chi nhánh không tồn tại"));

        Equipment equipment = equipmentMapper.toEntity(request);
        equipment.setBranch(branch);
        if (request.getIsActive() == null) {
            equipment.setIsActive(true);
        }

        Equipment savedEquipment = equipmentRepository.save(equipment);
        return equipmentMapper.toResponseDTO(savedEquipment);
    }

    @Override
    @Transactional(readOnly = true)
    public EquipmentResponseDTO getEquipmentById(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Thiết bị không tồn tại"));
        return equipmentMapper.toResponseDTO(equipment);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EquipmentResponseDTO> searchEquipments(String keyword, EquipmentType type, Long branchId,
            Pageable pageable) {
        Specification<Equipment> spec = Specification.where(EquipmentSpecification.hasKeyword(keyword))
                .and(EquipmentSpecification.hasType(type))
                .and(EquipmentSpecification.hasBranchId(branchId));

        Page<Equipment> equipments = equipmentRepository.findAll(spec, pageable);
        return equipments.map(equipmentMapper::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EquipmentResponseDTO> getEquipmentsByBranch(Long branchId) {
        List<Equipment> equipments = equipmentRepository.findByBranchIdAndIsActiveTrue(branchId);
        return equipmentMapper.toResponseDTOList(equipments);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EquipmentResponseDTO> getAvailableEquipments(Long branchId) {
        List<Equipment> equipments = equipmentRepository.findAvailableEquipments(branchId);
        return equipmentMapper.toResponseDTOList(equipments);
    }

    @Override
    @Transactional
    public EquipmentResponseDTO updateEquipment(Long id, UpdateEquipmentDTO request) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Thiết bị không tồn tại"));

        equipmentMapper.updateEntity(request, equipment);

        Equipment updatedEquipment = equipmentRepository.save(equipment);
        return equipmentMapper.toResponseDTO(updatedEquipment);
    }

    @Override
    @Transactional
    public void deleteEquipment(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Thiết bị không tồn tại"));
        equipmentRepository.delete(equipment);
    }

    @Override
    @Transactional
    public EquipmentResponseDTO updateAvailableQuantity(Long id, Integer quantity, boolean isReturn) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Thiết bị không tồn tại"));

        if (isReturn) {
            // Trả thiết bị: tăng available
            equipment.setAvailableQuantity(equipment.getAvailableQuantity() + quantity);
            if (equipment.getAvailableQuantity() > equipment.getTotalQuantity()) {
                equipment.setAvailableQuantity(equipment.getTotalQuantity());
            }
        } else {
            // Cho thuê: giảm available
            if (equipment.getAvailableQuantity() < quantity) {
                throw new RuntimeException("Số lượng thiết bị available không đủ");
            }
            equipment.setAvailableQuantity(equipment.getAvailableQuantity() - quantity);
        }

        Equipment updatedEquipment = equipmentRepository.save(equipment);
        return equipmentMapper.toResponseDTO(updatedEquipment);
    }
}
