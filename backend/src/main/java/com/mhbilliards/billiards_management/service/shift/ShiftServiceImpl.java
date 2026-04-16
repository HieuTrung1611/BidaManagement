package com.mhbilliards.billiards_management.service.shift;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.mhbilliards.billiards_management.dto.shift.ShiftRequest;
import com.mhbilliards.billiards_management.dto.shift.ShiftResponse;
import com.mhbilliards.billiards_management.entity.Shift;
import com.mhbilliards.billiards_management.mapper.ShiftMapper;
import com.mhbilliards.billiards_management.repository.ShiftRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShiftServiceImpl implements ShiftService {

    private final ShiftRepository shiftRepository;
    private final ShiftMapper shiftMapper;

    @Override
    public ShiftResponse createShift(ShiftRequest request) {
        validateShiftTime(request);

        if (shiftRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Mã ca làm việc đã tồn tại");
        }

        Shift shift = shiftMapper.toEntity(request);
        shift = shiftRepository.save(shift);
        return shiftMapper.toResponse(shift);
    }

    @Override
    public ShiftResponse updateShift(Long id, ShiftRequest request) {
        validateShiftTime(request);

        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ca làm việc với id: " + id));

        if (!shift.getCode().equals(request.getCode()) && shiftRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Mã ca làm việc đã tồn tại");
        }

        shiftMapper.updateEntity(request, shift);
        shift = shiftRepository.save(shift);
        return shiftMapper.toResponse(shift);
    }

    @Override
    public ShiftResponse getShiftById(Long id) {
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ca làm việc với id: " + id));
        return shiftMapper.toResponse(shift);
    }

    @Override
    public Page<ShiftResponse> getAllShifts(Pageable pageable) {
        return shiftRepository.findAll(pageable).map(shiftMapper::toResponse);
    }

    @Override
    public void deleteShift(Long id) {
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ca làm việc với id: " + id));
        shiftRepository.delete(shift);
    }

    private void validateShiftTime(ShiftRequest request) {
        if (request.getStartTime() == null || request.getEndTime() == null) {
            throw new RuntimeException("Thời gian bắt đầu và kết thúc không được để trống");
        }

        if (request.getStartTime().equals(request.getEndTime())) {
            throw new RuntimeException("Thời gian bắt đầu và kết thúc không được trùng nhau");
        }
    }
}
