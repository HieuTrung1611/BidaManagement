package com.mhbilliards.billiards_management.service.session;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.mhbilliards.billiards_management.dto.session.SelfServiceStartSessionDTO;
import com.mhbilliards.billiards_management.dto.session.SessionResponseDTO;
import com.mhbilliards.billiards_management.dto.session.SessionWithDetailsDTO;
import com.mhbilliards.billiards_management.dto.session.StartSessionDTO;
import com.mhbilliards.billiards_management.enums.SessionStatus;
import com.mhbilliards.billiards_management.enums.PaymentStatus;

public interface BilliardSessionService {
    /**
     * Bắt đầu phiên chơi mới
     */
    SessionResponseDTO startSession(StartSessionDTO request);

    /**
     * Kết thúc phiên chơi
     */
    SessionResponseDTO endSession(Long sessionId);

    /**
     * Lấy session theo ID
     */
    SessionResponseDTO getSessionById(Long id);

    /**
     * Tìm kiếm sessions với filters
     */
    Page<SessionResponseDTO> searchSessions(Long tableId, Long customerId, SessionStatus status,
            Long branchId, Pageable pageable);

    /**
     * Lấy tất cả sessions theo branch
     */
    List<SessionResponseDTO> getSessionsByBranch(Long branchId);

    /**
     * Lấy sessions đang active (ONGOING) của một branch
     */
    List<SessionResponseDTO> getActiveSessions(Long branchId);

    /**
     * Lấy sessions theo branch + ngày, kèm chi tiết sản phẩm/combo/thiết bị
     */
    List<SessionWithDetailsDTO> getSessionsWithDetailsByBranch(Long branchId, LocalDate date);

    /**
     * Lấy session với chi tiết đầy đủ theo ID
     */
    SessionWithDetailsDTO getSessionWithDetailsById(Long sessionId);

    /**
     * Bắt đầu phiên chơi tự phục vụ (khách hàng tự quét mặt và chọn bàn)
     */
    SessionResponseDTO startSelfServiceSession(SelfServiceStartSessionDTO request);

    /**
     * Lấy danh sách sessions chưa thanh toán (DEBT) cho branch
     */
    List<SessionResponseDTO> getUnpaidSessions(Long branchId);

    /**
     * Cập nhật trạng thái thanh toán của session
     */
    SessionResponseDTO updatePaymentStatus(Long sessionId, PaymentStatus status);
}

