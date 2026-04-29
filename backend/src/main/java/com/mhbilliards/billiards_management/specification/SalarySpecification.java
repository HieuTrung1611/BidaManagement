package com.mhbilliards.billiards_management.specification;

import org.springframework.data.jpa.domain.Specification;

import com.mhbilliards.billiards_management.entity.Salary;

import jakarta.persistence.criteria.Join;

public class SalarySpecification {

    public static Specification<Salary> hasSalaryMonth(String salaryMonth) {
        return (root, query, cb) -> {
            if (salaryMonth == null || salaryMonth.trim().isEmpty()) {
                return cb.conjunction();
            }
            return cb.equal(root.get("salaryMonth"), salaryMonth.trim());
        };
    }

    public static Specification<Salary> hasBranchId(Long branchId) {
        return (root, query, cb) -> {
            if (branchId == null) {
                return cb.conjunction();
            }
            Join<Object, Object> employeeJoin = root.join("employee");
            Join<Object, Object> branchJoin = employeeJoin.join("branch");
            return cb.equal(branchJoin.get("id"), branchId);
        };
    }

    public static Specification<Salary> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.trim().isEmpty()) {
                return cb.conjunction();
            }

            String like = "%" + keyword.toLowerCase().trim() + "%";
            Join<Object, Object> employeeJoin = root.join("employee");
            Join<Object, Object> branchJoin = employeeJoin.join("branch");

            return cb.or(
                    cb.like(cb.lower(branchJoin.get("name")), like),
                    cb.like(cb.lower(employeeJoin.get("name")), like),
                    cb.like(employeeJoin.get("id").as(String.class), like));
        };
    }
}
