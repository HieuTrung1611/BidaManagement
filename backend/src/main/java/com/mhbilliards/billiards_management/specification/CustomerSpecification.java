package com.mhbilliards.billiards_management.specification;

import org.springframework.data.jpa.domain.Specification;

import com.mhbilliards.billiards_management.entity.Customer;
import com.mhbilliards.billiards_management.enums.CustomerRank;

public class CustomerSpecification {

    public static Specification<Customer> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.trim().isEmpty()) {
                return cb.conjunction();
            }

            String likePattern = "%" + keyword.toLowerCase().trim() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("name")), likePattern),
                    cb.like(cb.lower(root.get("email")), likePattern),
                    cb.like(cb.lower(root.get("phoneNumber")), likePattern),
                    cb.like(root.get("id").as(String.class), likePattern));
        };
    }

    public static Specification<Customer> hasBranchId(Long branchId) {
        return (root, query, cb) -> {
            if (branchId == null) {
                return cb.conjunction();
            }

            return cb.equal(root.get("branch").get("id"), branchId);
        };
    }

    public static Specification<Customer> hasRank(CustomerRank rank) {
        return (root, query, cb) -> {
            if (rank == null) {
                return cb.conjunction();
            }

            return cb.equal(root.get("rank"), rank);
        };
    }

    public static Specification<Customer> isActive(Boolean isActive) {
        return (root, query, cb) -> {
            if (isActive == null) {
                return cb.conjunction();
            }

            return cb.equal(root.get("isActive"), isActive);
        };
    }
}
