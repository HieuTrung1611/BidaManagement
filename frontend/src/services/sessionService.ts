import axiosClient from "./axiosClient";
import {
    IBilliardSessionResponse,
    ISessionComboRequest,
    ISessionComboResponse,
    ISessionEquipmentRequest,
    ISessionEquipmentResponse,
    ISessionProductRequest,
    ISessionProductResponse,
    ISessionWithDetails,
    IStartSessionRequest,
    SessionStatus,
} from "@/types/session";
import { IInvoiceDTO } from "@/types/invoice";
import { ApiResponse, PageResponse, PaginationParams } from "@/types/base";

const sessionService = {
    // Start session (bật bàn)
    startSession: async (
        req: IStartSessionRequest,
    ): Promise<ApiResponse<IBilliardSessionResponse>> => {
        const res = await axiosClient.post(`/sessions/start`, req);
        return res.data;
    },

    // End session (tắt bàn)
    endSession: async (
        sessionId: number,
    ): Promise<ApiResponse<IBilliardSessionResponse>> => {
        const res = await axiosClient.post(`/sessions/${sessionId}/end`);
        return res.data;
    },

    // Get session by ID
    getSessionById: async (
        id: number,
    ): Promise<ApiResponse<IBilliardSessionResponse>> => {
        const res = await axiosClient.get(`/sessions/${id}`);
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
        const res = await axiosClient.get(`/sessions`, {
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

    // Get sessions by branch
    getSessionsByBranch: async (
        branchId: number,
    ): Promise<ApiResponse<IBilliardSessionResponse[]>> => {
        const res = await axiosClient.get(`/sessions/branch/${branchId}`);
        return res.data;
    },

    // Get active sessions by branch
    getActiveSessions: async (
        branchId: number,
    ): Promise<ApiResponse<IBilliardSessionResponse[]>> => {
        const res = await axiosClient.get(
            `/sessions/branch/${branchId}/active`,
        );
        return res.data;
    },

    // Add combo to session
    addCombo: async (
        req: ISessionComboRequest,
    ): Promise<ApiResponse<ISessionComboResponse>> => {
        const res = await axiosClient.post(`/session-combos`, req);
        return res.data;
    },

    // Get combos in session
    getCombosBySession: async (
        sessionId: number,
    ): Promise<ApiResponse<ISessionComboResponse[]>> => {
        const res = await axiosClient.get(
            `/session-combos/session/${sessionId}`,
        );
        return res.data;
    },

    // Delete combo from session
    deleteSessionCombo: async (id: number): Promise<ApiResponse<null>> => {
        const res = await axiosClient.delete(`/session-combos/${id}`);
        return res.data;
    },

    // Add product to session
    addProduct: async (
        req: ISessionProductRequest,
    ): Promise<ApiResponse<ISessionProductResponse>> => {
        const res = await axiosClient.post(`/session-products`, req);
        return res.data;
    },

    // Get products in session
    getProductsBySession: async (
        sessionId: number,
    ): Promise<ApiResponse<ISessionProductResponse[]>> => {
        const res = await axiosClient.get(
            `/session-products/session/${sessionId}`,
        );
        return res.data;
    },

    // Delete product from session
    deleteSessionProduct: async (id: number): Promise<ApiResponse<null>> => {
        const res = await axiosClient.delete(`/session-products/${id}`);
        return res.data;
    },

    // Add equipment rental to session
    rentEquipment: async (
        req: ISessionEquipmentRequest,
    ): Promise<ApiResponse<ISessionEquipmentResponse>> => {
        const res = await axiosClient.post(`/session-equipments`, req);
        return res.data;
    },

    // Get equipments in session
    getEquipmentsBySession: async (
        sessionId: number,
    ): Promise<ApiResponse<ISessionEquipmentResponse[]>> => {
        const res = await axiosClient.get(
            `/session-equipments/session/${sessionId}`,
        );
        return res.data;
    },

    // Return equipment
    returnEquipment: async (id: number): Promise<ApiResponse<null>> => {
        const res = await axiosClient.patch(`/session-equipments/${id}/return`);
        return res.data;
    },

    // Delete equipment from session
    deleteSessionEquipment: async (id: number): Promise<ApiResponse<null>> => {
        const res = await axiosClient.delete(`/session-equipments/${id}`);
        return res.data;
    },

    // Generate invoice
    generateInvoice: async (
        sessionId: number,
    ): Promise<ApiResponse<IInvoiceDTO>> => {
        const res = await axiosClient.get(`/invoices/${sessionId}`);
        return res.data;
    },

    // Get session history with full details (products, combos, equipment) for a branch and date
    getSessionHistory: async (
        branchId: number,
        date?: string, // YYYY-MM-DD, defaults to today on backend
    ): Promise<ApiResponse<ISessionWithDetails[]>> => {
        const res = await axiosClient.get(
            `/sessions/branch/${branchId}/history`,
            { params: date ? { date } : {} },
        );
        return res.data;
    },

    // Get session with full details (products, combos, equipment) by ID
    getSessionWithDetails: async (
        sessionId: number,
    ): Promise<ApiResponse<ISessionWithDetails>> => {
        const res = await axiosClient.get(`/sessions/${sessionId}/details`);
        return res.data;
    },

    // Self-service: Start session after face recognition
    startSelfServiceSession: async (req: {
        tableId: number;
        customerId: number;
        customerPhone: string;
        notes?: string;
    }): Promise<ApiResponse<IBilliardSessionResponse>> => {
        const res = await axiosClient.post(`/sessions/self-service/start`, req);
        return res.data;
    },

    // Get unpaid sessions (for debt management)
    getUnpaidSessions: async (
        branchId: number,
    ): Promise<ApiResponse<IBilliardSessionResponse[]>> => {
        const res = await axiosClient.get(
            `/sessions/branch/${branchId}/unpaid`,
        );
        return res.data;
    },
};

export default sessionService;
