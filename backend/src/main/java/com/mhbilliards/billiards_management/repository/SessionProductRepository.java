package com.mhbilliards.billiards_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.SessionProduct;

@Repository
public interface SessionProductRepository
        extends JpaRepository<SessionProduct, Long>, JpaSpecificationExecutor<SessionProduct> {

    @Query("SELECT sp FROM SessionProduct sp WHERE sp.session.id = :sessionId")
    List<SessionProduct> findBySessionId(@Param("sessionId") Long sessionId);
}
