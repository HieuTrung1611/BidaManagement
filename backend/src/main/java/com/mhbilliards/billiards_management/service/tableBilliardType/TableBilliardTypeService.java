package com.mhbilliards.billiards_management.service.tableBilliardType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.mhbilliards.billiards_management.dto.tableBilliardType.TableBilliardTypeRequest;
import com.mhbilliards.billiards_management.dto.tableBilliardType.TableBilliardTypeResponse;

public interface TableBilliardTypeService {
    TableBilliardTypeResponse createTableBilliardType(TableBilliardTypeRequest request);

    TableBilliardTypeResponse updateTableBilliardType(Long id, TableBilliardTypeRequest request);

    TableBilliardTypeResponse getTableBilliardTypeById(Long id);

    Page<TableBilliardTypeResponse> getAllTableBilliardTypes(Pageable pageable);

    void deleteTableBilliardType(Long id);
}