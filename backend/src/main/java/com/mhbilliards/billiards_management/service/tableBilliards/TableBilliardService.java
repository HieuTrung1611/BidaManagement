package com.mhbilliards.billiards_management.service.tableBilliards;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.mhbilliards.billiards_management.dto.tableBilliard.TableBilliardRequest;
import com.mhbilliards.billiards_management.dto.tableBilliard.TableBilliardResponse;

public interface TableBilliardService {
    TableBilliardResponse createTableBilliard(TableBilliardRequest request);

    TableBilliardResponse updateTableBilliard(Long id, TableBilliardRequest request);

    TableBilliardResponse getTableBilliardById(Long id);

    Page<TableBilliardResponse> getAllTableBilliards(Long branchId, Pageable pageable);

    List<TableBilliardResponse> getAllTableBilliardsNoPaging(Long branchId);

    void deleteTableBilliard(Long id);
}
