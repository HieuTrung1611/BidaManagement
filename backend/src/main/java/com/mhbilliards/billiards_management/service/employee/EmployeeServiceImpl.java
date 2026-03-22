package com.mhbilliards.billiards_management.service.employee;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.mhbilliards.billiards_management.dto.employee.EmployeeDetailResponse;
import com.mhbilliards.billiards_management.dto.employee.EmployeeRequest;
import com.mhbilliards.billiards_management.dto.employee.EmployeeResponse;
import com.mhbilliards.billiards_management.dto.employeePosition.EmployeePositionResponse;
import com.mhbilliards.billiards_management.entity.Employee;
import com.mhbilliards.billiards_management.entity.EmployeePosition;
import com.mhbilliards.billiards_management.repository.EmployeePositionRepository;
import com.mhbilliards.billiards_management.repository.EmployeeRepository;
import com.mhbilliards.billiards_management.specification.EmployeeSpecification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeePositionRepository employeePositionRepository;

    private EmployeePositionResponse convertEmployeePosition(EmployeePosition position) {
        return EmployeePositionResponse.builder()
                .id(position.getId())
                .name(position.getName())
                .code(position.getCode())
                .hourlyRate(position.getHourlyRate())

                .build();
    }

    private EmployeeResponse convertToResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .name(employee.getName())
                .email(employee.getEmail())
                .phoneNumber(employee.getPhoneNumber())
                .dob(employee.getDob())
                .address(employee.getAddress())
                .position(convertEmployeePosition(employee.getPosition()))
                .build();
    }

    private EmployeeDetailResponse convertToDetailResponse(Employee employee) {
        return EmployeeDetailResponse.builder()
                .id(employee.getId())
                .name(employee.getName())
                .email(employee.getEmail())
                .phoneNumber(employee.getPhoneNumber())
                .dob(employee.getDob())
                .address(employee.getAddress())
                .createdAt(employee.getCreatedAt())
                .updatedAt(employee.getUpdatedAt())
                .createdBy(employee.getCreatedBy())
                .updatedBy(employee.getUpdatedBy())
                .position(convertEmployeePosition(employee.getPosition()))
                .build();
    }

    private Employee convertToEntity(EmployeeRequest request) {
        return Employee.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .dob(request.getDob())
                .address(request.getAddress())
                .position(employeePositionRepository.getReferenceById(request.getPositionId()))
                .build();
    }

    @Override
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (employeeRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already exists");
        }

        Employee employee = convertToEntity(request);
        Employee savedEmployee = employeeRepository.save(employee);
        return convertToResponse(savedEmployee);
    }

    @Override
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        if (!employee.getEmail().equals(request.getEmail())
                && employeeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (!employee.getPhoneNumber().equals(request.getPhoneNumber())
                && employeeRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Phone number already exists");
        }

        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setPhoneNumber(request.getPhoneNumber());
        employee.setDob(request.getDob());
        employee.setAddress(request.getAddress());
        employee.setPosition(employeePositionRepository.getReferenceById(request.getPositionId()));
        Employee updatedEmployee = employeeRepository.save(employee);
        return convertToResponse(updatedEmployee);
    }

    @Override
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee not found with id: " + id);
        }
        employeeRepository.deleteById(id);
    }

    @Override
    public EmployeeDetailResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        return convertToDetailResponse(employee);
    }

    @Override
    public Page<EmployeeResponse> getAllEmployees(String keyword, Pageable pageable) {
        Page<Employee> employees = employeeRepository.findAll(EmployeeSpecification.hasKeyword(keyword), pageable);
        return employees.map(this::convertToResponse);
    }

}
