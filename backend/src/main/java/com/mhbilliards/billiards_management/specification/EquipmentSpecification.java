package com.mhbilliards.billiards_management.specification;

import org.springframework.data.jpa.domain.Specification;

import com.mhbilliards.billiards_management.entity.Equipment;
import com.mhbilliards.billiards_management.enums.EquipmentType;

public class EquipmentSpecification {

    public static Specification<Equipment> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.trim().isEmpty()) {
                return cb.conjunction();
            }

            String likePattern = "%" + keyword.toLowerCase().trim() + "%";

            return cb.or(
                    cb.like(cb.lower(root.get("name")), likePattern),
                    cb.like(cb.lower(root.get("description")), likePattern));
        };
    }

    public static Specification<Equipment> hasType(EquipmentType type) {
        return (root, query, cb) -> {
            if (type == null) {
                return cb.conjunction();
            }

            return cb.equal(root.get("type"), type);
        };
    }

    public static Specification<Equipment> hasBranchId(Long branchId) {
        return (root, query, cb) -> {
            if (branchId == null) {
                return cb.conjunction();
            }

            return cb.equal(root.get("branch").get("id"), branchId);
        };
    }

    public static Specification<Equipment> isActive(Boolean isActive) {
        return (root, query, cb) -> {
            if (isActive == null) {
                return cb.conjunction();
            }

            return cb.equal(root.get("isActive"), isActive);
        };
    }
}
