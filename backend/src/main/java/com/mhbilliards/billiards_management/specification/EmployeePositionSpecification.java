package com.mhbilliards.billiards_management.specification;

import org.springframework.data.jpa.domain.Specification;

import com.mhbilliards.billiards_management.entity.EmployeePosition;

public class EmployeePositionSpecification {
        public static Specification<EmployeePosition> hasKeyword(String keyword) {

                return (root, query, cb) -> {

                        if (keyword == null || keyword.trim().isEmpty()) {

                                return cb.conjunction();
                        }

                        String like = "%" + keyword.toLowerCase().trim() + "%";

                        return cb.or(

                                        cb.like(cb.lower(root.get("name")), like),
                                        cb.like(cb.lower(root.get("code")), like),
                                        cb.like(root.get("hourlyRate").as(String.class), like),
                                        cb.like(root.get("id").as(String.class), like)

                        );

                };
        }
}
