package com.mhbilliards.billiards_management.service.tableBilliardPricingConfig;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.mhbilliards.billiards_management.dto.tableBilliardPricingConfig.TableBilliardPricingConfigRequest;
import com.mhbilliards.billiards_management.dto.tableBilliardPricingConfig.TableBilliardPricingConfigResponse;

public interface TableBilliardPricingConfigService {
    TableBilliardPricingConfigResponse createTableBilliardPricingConfig(TableBilliardPricingConfigRequest request);

    TableBilliardPricingConfigResponse getTableBilliardPricingConfigById(Long id);

    Page<TableBilliardPricingConfigResponse> getAllTableBilliardPricingConfigs(Pageable pageable);

    TableBilliardPricingConfigResponse updateTableBilliardPricingConfig(Long id,
            TableBilliardPricingConfigRequest request);

    void deleteTableBilliardPricingConfig(Long id);
}
