package com.mhbilliards.billiards_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.SessionEquipment;

@Repository
public interface SessionEquipmentRepository
        extends JpaRepository<SessionEquipment, Long>, JpaSpecificationExecutor<SessionEquipment> {

    @Query("SELECT se FROM SessionEquipment se WHERE se.session.id = :sessionId")
    List<SessionEquipment> findBySessionId(@Param("sessionId") Long sessionId);

    @Query("SELECT se FROM SessionEquipment se WHERE se.session.id = :sessionId AND se.endTime IS NULL")
    List<SessionEquipment> findActiveRentalsBySessionId(@Param("sessionId") Long sessionId);
}
