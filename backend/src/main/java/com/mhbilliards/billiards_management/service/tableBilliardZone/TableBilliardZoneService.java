package com.mhbilliards.billiards_management.service.tableBilliardZone;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.mhbilliards.billiards_management.dto.tableBilliardZone.TableBilliardZoneRequest;
import com.mhbilliards.billiards_management.dto.tableBilliardZone.TableBilliardZoneResponse;

public interface TableBilliardZoneService {
    TableBilliardZoneResponse createTableBilliardZone(TableBilliardZoneRequest request);

    TableBilliardZoneResponse updateTableBilliardZone(Long id, TableBilliardZoneRequest request);

    TableBilliardZoneResponse getTableBilliardZoneById(Long id);

    Page<TableBilliardZoneResponse> getAllTableBilliardZones(Pageable pageable);

    void deleteTableBilliardZone(Long id);
}
