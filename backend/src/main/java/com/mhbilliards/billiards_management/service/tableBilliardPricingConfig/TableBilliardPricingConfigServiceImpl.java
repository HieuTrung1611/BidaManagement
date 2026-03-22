package com.mhbilliards.billiards_management.service.tableBilliardPricingConfig;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.mhbilliards.billiards_management.dto.tableBilliardPricingConfig.TableBilliardPricingConfigRequest;
import com.mhbilliards.billiards_management.dto.tableBilliardPricingConfig.TableBilliardPricingConfigResponse;
import com.mhbilliards.billiards_management.entity.TableBilliardPricingConfig;
import com.mhbilliards.billiards_management.repository.TableBilliardPricingConfigRepository;
import com.mhbilliards.billiards_management.repository.TableBilliardTypeRepository;
import com.mhbilliards.billiards_management.repository.TableBilliardZoneRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TableBilliardPricingConfigServiceImpl implements TableBilliardPricingConfigService {

    private final TableBilliardPricingConfigRepository tableBilliardPricingConfigRepository;
    private final TableBilliardTypeRepository tableBilliardTypeRepository;
    private final TableBilliardZoneRepository tableBilliardZoneRepository;

    private TableBilliardPricingConfigResponse mapToResponse(TableBilliardPricingConfig tableBilliardPricingConfig) {
        return TableBilliardPricingConfigResponse.builder().id(tableBilliardPricingConfig.getId())
                .pricePerHour(tableBilliardPricingConfig.getPricePerHours())
                .tableBilliardTypeId(tableBilliardPricingConfig.getType().getId())
                .tableBilliardZoneId(tableBilliardPricingConfig.getZone().getId()).build();
    }

    private TableBilliardPricingConfig mapToEntity(TableBilliardPricingConfigRequest request) {
        TableBilliardPricingConfig tableBilliardPricingConfig = new TableBilliardPricingConfig();
        tableBilliardPricingConfig.setPricePerHours(request.getPricePerHour());
        tableBilliardPricingConfig
                .setType(tableBilliardTypeRepository.getReferenceById(request.getTableBilliardTypeId()));
        tableBilliardPricingConfig
                .setZone(tableBilliardZoneRepository.getReferenceById(request.getTableBilliardZoneId()));
        return tableBilliardPricingConfig;
    }

    @Override
    public TableBilliardPricingConfigResponse createTableBilliardPricingConfig(
            TableBilliardPricingConfigRequest request) {
        TableBilliardPricingConfig tableBilliardPricingConfig = mapToEntity(request);
        TableBilliardPricingConfig savedConfig = tableBilliardPricingConfigRepository.save(tableBilliardPricingConfig);
        return mapToResponse(savedConfig);
    }

    @Override
    public TableBilliardPricingConfigResponse getTableBilliardPricingConfigById(Long id) {
        TableBilliardPricingConfig tableBilliardPricingConfig = tableBilliardPricingConfigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TableBilliardPricingConfig not found with id: " + id));
        return mapToResponse(tableBilliardPricingConfig);
    }

    @Override
    public Page<TableBilliardPricingConfigResponse> getAllTableBilliardPricingConfigs(Pageable pageable) {
        Page<TableBilliardPricingConfig> tableBilliardPricingConfigs = tableBilliardPricingConfigRepository
                .findAll(pageable);
        return tableBilliardPricingConfigs.map(this::mapToResponse);
    }

    @Override
    public TableBilliardPricingConfigResponse updateTableBilliardPricingConfig(Long id,
            TableBilliardPricingConfigRequest request) {
        TableBilliardPricingConfig existingConfig = tableBilliardPricingConfigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TableBilliardPricingConfig not found with id: " + id));
        existingConfig.setPricePerHours(request.getPricePerHour());
        existingConfig.setType(tableBilliardTypeRepository.getReferenceById(request.getTableBilliardTypeId()));
        existingConfig.setZone(tableBilliardZoneRepository.getReferenceById(request.getTableBilliardZoneId()));
        TableBilliardPricingConfig updatedConfig = tableBilliardPricingConfigRepository.save(existingConfig);
        return mapToResponse(updatedConfig);
    }

    @Override
    public void deleteTableBilliardPricingConfig(Long id) {
        TableBilliardPricingConfig existingConfig = tableBilliardPricingConfigRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TableBilliardPricingConfig not found with id: " + id));
        tableBilliardPricingConfigRepository.delete(existingConfig);
    }

}
