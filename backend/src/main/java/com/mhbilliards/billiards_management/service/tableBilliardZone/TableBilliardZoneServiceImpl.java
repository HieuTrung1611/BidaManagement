package com.mhbilliards.billiards_management.service.tableBilliardZone;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.mhbilliards.billiards_management.dto.tableBilliardZone.TableBilliardZoneRequest;
import com.mhbilliards.billiards_management.dto.tableBilliardZone.TableBilliardZoneResponse;
import com.mhbilliards.billiards_management.entity.TableBilliardZone;
import com.mhbilliards.billiards_management.repository.TableBilliardZoneRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TableBilliardZoneServiceImpl implements TableBilliardZoneService {

    private final TableBilliardZoneRepository tableBilliardZoneRepository;

    public TableBilliardZoneResponse mapToResponse(TableBilliardZone tableBilliardZone) {
        return TableBilliardZoneResponse.builder()
                .id(tableBilliardZone.getId())
                .name(tableBilliardZone.getName())
                .description(tableBilliardZone.getDescription())
                .build();
    }

    private TableBilliardZone mapToEntity(TableBilliardZoneRequest request) {
        return TableBilliardZone.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
    }

    private void updateEntity(TableBilliardZone tableBilliardZone, TableBilliardZoneRequest request) {
        tableBilliardZone.setName(request.getName());
        tableBilliardZone.setDescription(request.getDescription());
    }

    @Override
    public TableBilliardZoneResponse createTableBilliardZone(TableBilliardZoneRequest request) {
        if (tableBilliardZoneRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException(
                    "Table billiard zone with name " + request.getName() + " already exists");
        }
        TableBilliardZone tableBilliardZone = mapToEntity(request);
        tableBilliardZone = tableBilliardZoneRepository.save(tableBilliardZone);
        return mapToResponse(tableBilliardZone);
    }

    @Override
    public TableBilliardZoneResponse updateTableBilliardZone(Long id, TableBilliardZoneRequest request) {
        TableBilliardZone tableBilliardZone = tableBilliardZoneRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Table billiard zone with id " + id + " not found"));
        if (!tableBilliardZone.getName().equals(request.getName())
                && tableBilliardZoneRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException(
                    "Table billiard zone with name " + request.getName() + " already exists");
        }
        updateEntity(tableBilliardZone, request);
        tableBilliardZone = tableBilliardZoneRepository.save(tableBilliardZone);
        return mapToResponse(tableBilliardZone);
    }

    @Override
    public TableBilliardZoneResponse getTableBilliardZoneById(Long id) {
        TableBilliardZone tableBilliardZone = tableBilliardZoneRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Table billiard zone with id " + id + " not found"));
        return mapToResponse(tableBilliardZone);
    }

    @Override
    public Page<TableBilliardZoneResponse> getAllTableBilliardZones(Pageable pageable) {
        return tableBilliardZoneRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public void deleteTableBilliardZone(Long id) {
        TableBilliardZone tableBilliardZone = tableBilliardZoneRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Table billiard zone with id " + id + " not found"));
        tableBilliardZoneRepository.delete(tableBilliardZone);
    }

}
