package com.mhbilliards.billiards_management.service.sessionEquipment;

import com.mhbilliards.billiards_management.dto.sessionEquipment.CreateSessionEquipmentDTO;
import com.mhbilliards.billiards_management.dto.sessionEquipment.SessionEquipmentResponseDTO;

import java.util.List;

public interface SessionEquipmentService {
    SessionEquipmentResponseDTO rentEquipmentForSession(CreateSessionEquipmentDTO request);

    SessionEquipmentResponseDTO returnEquipment(Long id);

    SessionEquipmentResponseDTO getSessionEquipmentById(Long id);

    List<SessionEquipmentResponseDTO> getEquipmentsBySessionId(Long sessionId);

    List<SessionEquipmentResponseDTO> getActiveRentalsBySessionId(Long sessionId);

    void deleteSessionEquipment(Long id);
}
