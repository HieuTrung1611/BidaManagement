package com.mhbilliards.billiards_management.specification;

import org.springframework.data.jpa.domain.Specification;

import com.mhbilliards.billiards_management.entity.Employee;

public class EmployeeSpecification {
    public static Specification<Employee> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.trim().isEmpty()) {
                return cb.conjunction();
            }

            String likePattern = "%" + keyword.toLowerCase().trim() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("name")), likePattern),
                    cb.like(cb.lower(root.get("email")), likePattern),
                    cb.like(cb.lower(root.get("phoneNumber")), likePattern),
                    cb.like(cb.lower(root.get("address")), likePattern),
                    cb.like(root.get("id").as(String.class), likePattern));
        };
    }
}
