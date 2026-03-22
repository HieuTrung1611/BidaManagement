package com.mhbilliards.billiards_management.service.tableBilliardType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.mhbilliards.billiards_management.dto.tableBilliardType.TableBilliardTypeRequest;
import com.mhbilliards.billiards_management.dto.tableBilliardType.TableBilliardTypeResponse;
import com.mhbilliards.billiards_management.entity.TableBilliardType;
import com.mhbilliards.billiards_management.repository.TableBilliardTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TableBilliardTypeServiceImpl implements TableBilliardTypeService {

    private final TableBilliardTypeRepository tableBilliardTypeRepository;

    public TableBilliardTypeResponse mapToResponse(TableBilliardType tableBilliardType) {
        return TableBilliardTypeResponse.builder()
                .id(tableBilliardType.getId())
                .name(tableBilliardType.getName())
                .description(tableBilliardType.getDescription())
                .costPrice(tableBilliardType.getCostPrice())
                .supplier(tableBilliardType.getSupplier())
                .supplierPhone(tableBilliardType.getSupplierPhone())
                .build();
    }

    private TableBilliardType mapToEntity(TableBilliardTypeRequest request) {
        return TableBilliardType.builder()
                .name(request.getName())
                .description(request.getDescription())
                .costPrice(request.getCostPrice())
                .supplier(request.getSupplier())
                .supplierPhone(request.getSupplierPhone())
                .build();
    }

    private void updateEntity(TableBilliardType tableBilliardType, TableBilliardTypeRequest request) {
        tableBilliardType.setName(request.getName());
        tableBilliardType.setDescription(request.getDescription());
        tableBilliardType.setCostPrice(request.getCostPrice());
        tableBilliardType.setSupplier(request.getSupplier());
        tableBilliardType.setSupplierPhone(request.getSupplierPhone());
    }

    @Override
    public TableBilliardTypeResponse createTableBilliardType(TableBilliardTypeRequest request) {
        if (tableBilliardTypeRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException(
                    "Table billiard type with name " + request.getName() + " already exists");
        }
        TableBilliardType tableBilliardType = mapToEntity(request);
        tableBilliardType = tableBilliardTypeRepository.save(tableBilliardType);
        return mapToResponse(tableBilliardType);
    }

    @Override
    public TableBilliardTypeResponse updateTableBilliardType(Long id, TableBilliardTypeRequest request) {
        TableBilliardType tableBilliardType = tableBilliardTypeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Table billiard type with id " + id + " not found"));
        if (!tableBilliardType.getName().equals(request.getName())
                && tableBilliardTypeRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException(
                    "Table billiard type with name " + request.getName() + " already exists");
        }
        updateEntity(tableBilliardType, request);
        tableBilliardType = tableBilliardTypeRepository.save(tableBilliardType);
        return mapToResponse(tableBilliardType);
    }

    @Override
    public TableBilliardTypeResponse getTableBilliardTypeById(Long id) {
        TableBilliardType tableBilliardType = tableBilliardTypeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Table billiard type with id " + id + " not found"));
        return mapToResponse(tableBilliardType);
    }

    @Override
    public Page<TableBilliardTypeResponse> getAllTableBilliardTypes(Pageable pageable) {
        return tableBilliardTypeRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public void deleteTableBilliardType(Long id) {
        TableBilliardType tableBilliardType = tableBilliardTypeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Table billiard type with id " + id + " not found"));
        tableBilliardTypeRepository.delete(tableBilliardType);
    }

}