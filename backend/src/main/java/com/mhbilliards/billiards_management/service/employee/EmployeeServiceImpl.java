package com.mhbilliards.billiards_management.service.employee;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.mhbilliards.billiards_management.dto.employee.EmployeeRequest;
import com.mhbilliards.billiards_management.dto.employee.EmployeeResponse;
import com.mhbilliards.billiards_management.entity.Employee;
import com.mhbilliards.billiards_management.mapper.EmployeeMapper;
import com.mhbilliards.billiards_management.repository.BranchRepository;
import com.mhbilliards.billiards_management.repository.EmployeePositionRepository;
import com.mhbilliards.billiards_management.repository.EmployeeRepository;
import com.mhbilliards.billiards_management.repository.ShiftRepository;
import com.mhbilliards.billiards_management.specification.EmployeeSpecification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeePositionRepository employeePositionRepository;
    private final BranchRepository branchRepository;
    private final ShiftRepository shiftRepository;
    private final EmployeeMapper employeeMapper;

    @Override
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }
        if (employeeRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Số điện thoại đã tồn tại");
        }
        if (!employeePositionRepository.existsById(request.getPositionId())) {
            throw new RuntimeException("Không tìm thấy chức vụ với id: " + request.getPositionId());
        }
        if (!branchRepository.existsById(request.getBranchId())) {
            throw new RuntimeException("Không tìm thấy chi nhánh với id: " + request.getBranchId());
        }
        if (!shiftRepository.existsById(request.getShiftId())) {
            throw new RuntimeException("Không tìm thấy ca làm việc với id: " + request.getShiftId());
        }

        Employee employee = employeeMapper.toEntity(request);
        Employee savedEmployee = employeeRepository.save(employee);
        return employeeMapper.toResponse(savedEmployee);
    }

    @Override
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với id: " + id));
        if (!employee.getEmail().equals(request.getEmail())
                && employeeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }
        if (!employee.getPhoneNumber().equals(request.getPhoneNumber())
                && employeeRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Số điện thoại đã tồn tại");
        }
        if (!employeePositionRepository.existsById(request.getPositionId())) {
            throw new RuntimeException("Không tìm thấy chức vụ với id: " + request.getPositionId());
        }
        if (!branchRepository.existsById(request.getBranchId())) {
            throw new RuntimeException("Không tìm thấy chi nhánh với id: " + request.getBranchId());
        }
        if (!shiftRepository.existsById(request.getShiftId())) {
            throw new RuntimeException("Không tìm thấy ca làm việc với id: " + request.getShiftId());
        }

        employeeMapper.updateEntity(request, employee);
        employee.setPosition(employeePositionRepository.getReferenceById(request.getPositionId()));
        employee.setBranch(branchRepository.getReferenceById(request.getBranchId()));
        employee.setShift(shiftRepository.getReferenceById(request.getShiftId()));
        Employee updatedEmployee = employeeRepository.save(employee);
        return employeeMapper.toResponse(updatedEmployee);
    }

    @Override
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy nhân viên với id: " + id);
        }
        employeeRepository.deleteById(id);
    }

    @Override
    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với id: " + id));
        return employeeMapper.toResponse(employee);
    }

    @Override
    public Page<EmployeeResponse> getAllEmployees(String keyword, Long branchId, Pageable pageable) {
        Specification<Employee> specification = Specification
                .where(EmployeeSpecification.hasKeyword(keyword))
                .and(EmployeeSpecification.hasBranchId(branchId));

        Page<Employee> employees = employeeRepository.findAll(specification, pageable);
        return employees.map(employeeMapper::toResponse);
    }

}
