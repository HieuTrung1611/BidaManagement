package com.mhbilliards.billiards_management.service.tableBilliardType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.mhbilliards.billiards_management.dto.tableBilliardType.TableBilliardTypeRequest;
import com.mhbilliards.billiards_management.dto.tableBilliardType.TableBilliardTypeResponse;
import com.mhbilliards.billiards_management.entity.TableBilliardType;
import com.mhbilliards.billiards_management.mapper.TableTypeMapper;
import com.mhbilliards.billiards_management.repository.TableBilliardTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TableBilliardTypeServiceImpl implements TableBilliardTypeService {

    private final TableBilliardTypeRepository tableBilliardTypeRepository;
    private final TableTypeMapper tableBilliardTypeMapper;

    @Override
    public TableBilliardTypeResponse createTableBilliardType(TableBilliardTypeRequest request) {
        if (tableBilliardTypeRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException(
                    "Table billiard type with name " + request.getName() + " already exists");
        }

        TableBilliardType tableBilliardType = tableBilliardTypeMapper.toEntity(request);

        tableBilliardType = tableBilliardTypeRepository.save(tableBilliardType);
        return tableBilliardTypeMapper.toResponse(tableBilliardType);
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
        tableBilliardTypeMapper.updateEntity(request, tableBilliardType);
        tableBilliardType = tableBilliardTypeRepository.save(tableBilliardType);
        return tableBilliardTypeMapper.toResponse(tableBilliardType);
    }

    @Override
    public TableBilliardTypeResponse getTableBilliardTypeById(Long id) {
        TableBilliardType tableBilliardType = tableBilliardTypeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Table billiard type with id " + id + " not found"));
        return tableBilliardTypeMapper.toResponse(tableBilliardType);
    }

    @Override
    public Page<TableBilliardTypeResponse> getAllTableBilliardTypes(Pageable pageable) {
        return tableBilliardTypeRepository.findAll(pageable).map(tableBilliardTypeMapper::toResponse);
    }

    @Override
    public void deleteTableBilliardType(Long id) {
        TableBilliardType tableBilliardType = tableBilliardTypeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Table billiard type with id " + id + " not found"));
        tableBilliardTypeRepository.delete(tableBilliardType);
    }

}