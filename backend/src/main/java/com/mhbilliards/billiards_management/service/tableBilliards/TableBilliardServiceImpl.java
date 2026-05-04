package com.mhbilliards.billiards_management.service.tableBilliards;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.mhbilliards.billiards_management.dto.tableBilliard.TableBilliardRequest;
import com.mhbilliards.billiards_management.dto.tableBilliard.TableBilliardResponse;
import com.mhbilliards.billiards_management.entity.TableBilliard;
import com.mhbilliards.billiards_management.mapper.TableMapper;
import com.mhbilliards.billiards_management.repository.BranchRepository;
import com.mhbilliards.billiards_management.repository.TableBilliardRepository;
import com.mhbilliards.billiards_management.repository.TableBilliardTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TableBilliardServiceImpl implements TableBilliardService {
    private final TableBilliardRepository tableBilliardRepository;
    private final TableBilliardTypeRepository tableBilliardTypeRepository;
    private final BranchRepository branchRepository;
    private final TableMapper tableMapper;

    @Override
    public TableBilliardResponse createTableBilliard(TableBilliardRequest request) {
        if (tableBilliardRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException(
                    "Tên bàn đã tồn tại! ");
        }

        TableBilliard tableBilliard = TableBilliard.builder()
                .name(request.getName())
                .description(request.getDescription())
                .type(tableBilliardTypeRepository.getReferenceById(request.getTypeId()))
                .branch(branchRepository.getReferenceById(request.getBranchId()))
                .build();
        tableBilliard = tableBilliardRepository.save(tableBilliard);
        return tableMapper.toResponse(tableBilliard);
    }

    @Override
    public TableBilliardResponse updateTableBilliard(Long id, TableBilliardRequest request) {
        TableBilliard tableBilliard = tableBilliardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Table billiard with id " + id + " not found"));
        if (!tableBilliard.getName().equals(request.getName())
                && tableBilliardRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException(
                    "Tên bàn đã tồn tại! ");
        }
        tableBilliard.setName(request.getName());
        tableBilliard.setDescription(request.getDescription());
        tableBilliard.setType(tableBilliardTypeRepository.getReferenceById(request.getTypeId()));
        tableBilliard.setBranch(branchRepository.getReferenceById(request.getBranchId()));
        tableBilliard = tableBilliardRepository.save(tableBilliard);
        return tableMapper.toResponse(tableBilliard);
    }

    @Override
    public TableBilliardResponse getTableBilliardById(Long id) {
        TableBilliard tableBilliard = tableBilliardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Table billiard with id " + id + " not found"));
        return tableMapper.toResponse(tableBilliard);
    }

    @Override
    public Page<TableBilliardResponse> getAllTableBilliards(Long branchId, Pageable pageable) {
        if (branchId != null) {
            return tableBilliardRepository.findByBranch_Id(branchId, pageable).map(tableMapper::toResponse);
        }
        return tableBilliardRepository.findAll(pageable).map(tableMapper::toResponse);
    }

    @Override
    public List<TableBilliardResponse> getAllTableBilliardsNoPaging(Long branchId) {
        List<TableBilliard> tables = branchId != null
                ? tableBilliardRepository.findByBranch_Id(branchId)
                : tableBilliardRepository.findAll();
        return tables.stream().map(tableMapper::toResponse).toList();
    }

    @Override
    public void deleteTableBilliard(Long id) {
        TableBilliard tableBilliard = tableBilliardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Table billiard with id " + id + " not found"));
        tableBilliardRepository.delete(tableBilliard);
    }

}
