package com.mhbilliards.billiards_management.service.tableBilliards;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.mhbilliards.billiards_management.dto.tableBilliard.TableBilliardRequest;
import com.mhbilliards.billiards_management.dto.tableBilliard.TableBilliardResponse;

public interface TableBilliardService {
    TableBilliardResponse createTableBilliard(TableBilliardRequest request);

    TableBilliardResponse updateTableBilliard(Long id, TableBilliardRequest request);

    TableBilliardResponse getTableBilliardById(Long id);

    Page<TableBilliardResponse> getAllTableBilliards(Pageable pageable);

    void deleteTableBilliard(Long id);
}
