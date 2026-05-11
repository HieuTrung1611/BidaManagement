package com.mhbilliards.billiards_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.SessionCombo;

@Repository
public interface SessionComboRepository
        extends JpaRepository<SessionCombo, Long>, JpaSpecificationExecutor<SessionCombo> {

    @Query("SELECT sc FROM SessionCombo sc WHERE sc.session.id = :sessionId")
    List<SessionCombo> findBySessionId(@Param("sessionId") Long sessionId);
}
