import axiosClient from "./axiosClient";
import {
    IBilliardSessionResponse,
    IInvoiceDTO,
    ISessionComboRequest,
    ISessionEquipmentRequest,
    ISessionProductRequest,
    SessionStatus,
} from "@/types/session";
import { ApiResponse, PageResponse, PaginationParams } from "@/types/base";

const API_URL = "/billiard-sessions";

const sessionService = {
    // Start session (bật bàn)
    startSession: async (
        tableId: number,
        customerId?: number,
    ): Promise<ApiResponse<IBilliardSessionResponse>> => {
        const res = await axiosClient.post(`${API_URL}/start`, null, {
            params: { tableId, customerId },
        });
        return res.data;
    },

    // End session (tắt bàn)
    endSession: async (
        sessionId: number,
    ): Promise<ApiResponse<IBilliardSessionResponse>> => {
        const res = await axiosClient.patch(`${API_URL}/${sessionId}/end`);
        return res.data;
    },

    // Get session by ID
    getSessionById: async (
        id: number,
    ): Promise<ApiResponse<IBilliardSessionResponse>> => {
        const res = await axiosClient.get(`${API_URL}/${id}`);
        return res.data;
    },

    // Get all sessions
    getAllSessions: async (
        tableId?: number,
        customerId?: number,
        status?: SessionStatus,
        branchId?: number,
        params?: PaginationParams,
    ): Promise<ApiResponse<PageResponse<IBilliardSessionResponse>>> => {
        const res = await axiosClient.get(API_URL, {
            params: {
                tableId,
                customerId,
                status,
                branchId,
                page: params?.page ?? 0,
                size: params?.size ?? 10,
                sort: `${params?.sortBy ?? "createdAt"},${params?.sortDirection ?? "desc"}`,
            },
        });
        return res.data;
    },

    // Add combo to session
    addCombo: async (
        sessionId: number,
        req: ISessionComboRequest,
    ): Promise<ApiResponse<null>> => {
        const res = await axiosClient.post(
            `${API_URL}/${sessionId}/combos`,
            req,
        );
        return res.data;
    },

    // Add product to session
    addProduct: async (
        sessionId: number,
        req: ISessionProductRequest,
    ): Promise<ApiResponse<null>> => {
        const res = await axiosClient.post(
            `${API_URL}/${sessionId}/products`,
            req,
        );
        return res.data;
    },

    // Add equipment rental to session
    rentEquipment: async (
        sessionId: number,
        req: ISessionEquipmentRequest,
    ): Promise<ApiResponse<null>> => {
        const res = await axiosClient.post(
            `${API_URL}/${sessionId}/equipments`,
            req,
        );
        return res.data;
    },

    // Return equipment
    returnEquipment: async (
        sessionEquipmentId: number,
    ): Promise<ApiResponse<null>> => {
        const res = await axiosClient.patch(
            `/session-equipments/${sessionEquipmentId}/return`,
        );
        return res.data;
    },

    // Generate invoice
    generateInvoice: async (
        sessionId: number,
    ): Promise<ApiResponse<IInvoiceDTO>> => {
        const res = await axiosClient.get(`/invoices/${sessionId}`);
        return res.data;
    },
};

export default sessionService;
