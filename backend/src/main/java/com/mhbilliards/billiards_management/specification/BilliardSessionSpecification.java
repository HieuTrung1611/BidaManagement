package com.mhbilliards.billiards_management.specification;

import org.springframework.data.jpa.domain.Specification;

import com.mhbilliards.billiards_management.entity.BilliardSession;
import com.mhbilliards.billiards_management.enums.SessionStatus;

public class BilliardSessionSpecification {

    public static Specification<BilliardSession> hasTableId(Long tableId) {
        return (root, query, cb) -> {
            if (tableId == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("table").get("id"), tableId);
        };
    }

    public static Specification<BilliardSession> hasCustomerId(Long customerId) {
        return (root, query, cb) -> {
            if (customerId == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("customer").get("id"), customerId);
        };
    }

    public static Specification<BilliardSession> hasStatus(SessionStatus status) {
        return (root, query, cb) -> {
            if (status == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("status"), status);
        };
    }

    public static Specification<BilliardSession> hasBranchId(Long branchId) {
        return (root, query, cb) -> {
            if (branchId == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("branch").get("id"), branchId);
        };
    }
}
