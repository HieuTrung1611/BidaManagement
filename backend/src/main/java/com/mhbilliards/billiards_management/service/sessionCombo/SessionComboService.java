package com.mhbilliards.billiards_management.service.sessionCombo;

import java.util.List;

import com.mhbilliards.billiards_management.dto.session.AddComboToSessionDTO;
import com.mhbilliards.billiards_management.dto.sessionCombo.SessionComboResponseDTO;

public interface SessionComboService {
    /**
     * Thêm combo vào session
     */
    SessionComboResponseDTO addComboToSession(AddComboToSessionDTO request);

    /**
     * Lấy danh sách combos trong session
     */
    List<SessionComboResponseDTO> getCombosBySessionId(Long sessionId);

    /**
     * Xóa combo khỏi session
     */
    void deleteSessionCombo(Long id);
}
