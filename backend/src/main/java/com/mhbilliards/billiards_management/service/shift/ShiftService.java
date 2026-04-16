package com.mhbilliards.billiards_management.service.shift;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.mhbilliards.billiards_management.dto.shift.ShiftRequest;
import com.mhbilliards.billiards_management.dto.shift.ShiftResponse;

public interface ShiftService {
    ShiftResponse createShift(ShiftRequest request);

    ShiftResponse updateShift(Long id, ShiftRequest request);

    ShiftResponse getShiftById(Long id);

    Page<ShiftResponse> getAllShifts(Pageable pageable);

    void deleteShift(Long id);
}
