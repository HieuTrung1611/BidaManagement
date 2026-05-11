package com.mhbilliards.billiards_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.ComboItem;

@Repository
public interface ComboItemRepository extends JpaRepository<ComboItem, Long>, JpaSpecificationExecutor<ComboItem> {

    @Query("SELECT ci FROM ComboItem ci WHERE ci.combo.id = :comboId")
    List<ComboItem> findByComboId(@Param("comboId") Long comboId);

    @Modifying
    @Query("DELETE FROM ComboItem ci WHERE ci.combo.id = :comboId")
    void deleteByComboId(@Param("comboId") Long comboId);
}
