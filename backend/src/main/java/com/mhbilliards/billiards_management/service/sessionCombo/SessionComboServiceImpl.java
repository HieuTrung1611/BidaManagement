package com.mhbilliards.billiards_management.service.sessionCombo;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mhbilliards.billiards_management.dto.session.AddComboToSessionDTO;
import com.mhbilliards.billiards_management.dto.sessionCombo.SessionComboResponseDTO;
import com.mhbilliards.billiards_management.entity.BilliardSession;
import com.mhbilliards.billiards_management.entity.Combo;
import com.mhbilliards.billiards_management.entity.SessionCombo;
import com.mhbilliards.billiards_management.enums.SessionStatus;
import com.mhbilliards.billiards_management.mapper.SessionComboMapper;
import com.mhbilliards.billiards_management.repository.BilliardSessionRepository;
import com.mhbilliards.billiards_management.repository.ComboRepository;
import com.mhbilliards.billiards_management.repository.SessionComboRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SessionComboServiceImpl implements SessionComboService {

    private final SessionComboRepository sessionComboRepository;
    private final BilliardSessionRepository sessionRepository;
    private final ComboRepository comboRepository;
    private final SessionComboMapper sessionComboMapper;

    @Override
    @Transactional
    public SessionComboResponseDTO addComboToSession(AddComboToSessionDTO request) {
        // Validate session exists and is ONGOING
        BilliardSession session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session không tồn tại"));

        if (session.getStatus() != SessionStatus.ONGOING) {
            throw new IllegalStateException("Không thể thêm combo vào session đã kết thúc");
        }

        // Validate combo exists and is active
        Combo combo = comboRepository.findById(request.getComboId())
                .orElseThrow(() -> new RuntimeException("Combo không tồn tại"));

        if (!combo.getIsActive()) {
            throw new IllegalStateException("Combo không còn khả dụng");
        }

        // Calculate total amount
        BigDecimal price = BigDecimal.valueOf(combo.getDiscountedPrice());
        BigDecimal quantity = BigDecimal.valueOf(request.getQuantity());
        BigDecimal totalAmount = price.multiply(quantity).setScale(2, RoundingMode.HALF_UP);

        // Create session combo
        SessionCombo sessionCombo = SessionCombo.builder()
                .session(session)
                .combo(combo)
                .quantity(request.getQuantity())
                .price(combo.getDiscountedPrice())
                .totalAmount(totalAmount.doubleValue())
                .build();

        SessionCombo saved = sessionComboRepository.save(sessionCombo);
        return sessionComboMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionComboResponseDTO> getCombosBySessionId(Long sessionId) {
        List<SessionCombo> sessionCombos = sessionComboRepository.findBySessionId(sessionId);
        return sessionComboMapper.toResponseDTOList(sessionCombos);
    }

    @Override
    @Transactional
    public void deleteSessionCombo(Long id) {
        SessionCombo sessionCombo = sessionComboRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session combo không tồn tại"));

        if (sessionCombo.getSession().getStatus() != SessionStatus.ONGOING) {
            throw new IllegalStateException("Không thể xóa combo khỏi session đã kết thúc");
        }

        sessionComboRepository.delete(sessionCombo);
    }
}
