package com.mhbilliards.billiards_management.service.employeePosition;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mhbilliards.billiards_management.dto.employeePosition.EmployeePositionDetailResponse;
import com.mhbilliards.billiards_management.dto.employeePosition.EmployeePositionRequest;
import com.mhbilliards.billiards_management.dto.employeePosition.EmployeePositionResponse;
import com.mhbilliards.billiards_management.entity.EmployeePosition;
import com.mhbilliards.billiards_management.repository.EmployeePositionRepository;
import com.mhbilliards.billiards_management.specification.EmployeePositionSpecification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmployeePositionServiceImpl implements EmployeePositionService {

    private final EmployeePositionRepository employeePositionRepository;

    private EmployeePositionDetailResponse convertToDetailResponse(EmployeePosition position) {
        return EmployeePositionDetailResponse.builder()
                .id(position.getId())
                .code(position.getCode())
                .name(position.getName())
                .hourlyRate(position.getHourlyRate())
                .createdAt(position.getCreatedAt())
                .updatedAt(position.getUpdatedAt())
                .createdBy(position.getCreatedBy())
                .updatedBy(position.getUpdatedBy())
                .build();
    }

    private EmployeePositionResponse convertToResponse(EmployeePosition position) {
        return EmployeePositionResponse.builder()
                .id(position.getId())
                .code(position.getCode())
                .name(position.getName())
                .hourlyRate(position.getHourlyRate())
                .build();
    }

    EmployeePosition convertToEntity(EmployeePositionRequest request) {
        return EmployeePosition.builder()
                .name(request.getName())
                .code(request.getCode())
                .hourlyRate(request.getHourlyRate())
                .build();
    }

    EmployeePosition updateEntityFromRequest(EmployeePosition position, EmployeePositionRequest request) {
        position.setName(request.getName());
        position.setHourlyRate(request.getHourlyRate());
        position.setCode(request.getCode());
        return position;
    }

    @Override
    public EmployeePositionResponse createEmployeePosition(EmployeePositionRequest request) {

        if (employeePositionRepository.existsByName(request.getName())) {
            throw new RuntimeException("Position name already exists");
        }

        if (employeePositionRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Position code already exists");
        }

        EmployeePosition position = convertToEntity(request);

        EmployeePosition savedPosition = employeePositionRepository.save(position);
        return convertToResponse(savedPosition);
    }

    @Override
    public EmployeePositionResponse updateEmployeePosition(Long id, EmployeePositionRequest request) {
        EmployeePosition position = employeePositionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Position not found"));

        if (!position.getName().equals(request.getName())
                && employeePositionRepository.existsByName(request.getName())) {
            throw new RuntimeException("Position name already exists");
        }

        position = updateEntityFromRequest(position, request);
        EmployeePosition updatedPosition = employeePositionRepository.save(position);
        return convertToResponse(updatedPosition);
    }

    @Override
    public void deleteEmployeePosition(Long id) {
        EmployeePosition position = employeePositionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Position not found"));
        employeePositionRepository.delete(position);
    }

    @Override
    public EmployeePositionDetailResponse getEmployeePositionById(Long id) {
        EmployeePosition position = employeePositionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Position not found"));
        return convertToDetailResponse(position);
    }

    @Override
    public List<EmployeePositionResponse> getAllEmployeePositionsByKeyword(String keyword) {
        List<EmployeePosition> positions = employeePositionRepository
                .findAll(EmployeePositionSpecification.hasKeyword(keyword));
        return positions.stream()
                .map(this::convertToResponse)
                .toList();

    }

}
