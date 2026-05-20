import { ApiResponse, PageResponse } from "@/types/base";
import axiosClient from "./axiosClient";
import {
    IInvoiceDTO,
    IInvoice,
    IInvoiceListParams,
    IRevenueReport,
} from "@/types/invoice";

const invoiceService = {
    /**
     * Generate invoice preview (không lưu DB)
     */
    generateInvoice: async (
        sessionId: number,
    ): Promise<ApiResponse<IInvoiceDTO>> => {
        const response = await axiosClient.get<ApiResponse<IInvoiceDTO>>(
            `/invoices/session/${sessionId}`,
        );
        return response.data;
    },

    /**
     * Get saved invoice by ID
     */
    getInvoiceById: async (id: number): Promise<ApiResponse<IInvoice>> => {
        const response = await axiosClient.get<ApiResponse<IInvoice>>(
            `/invoices/${id}`,
        );
        return response.data;
    },

    /**
     * Get saved invoice by session ID
     */
    getInvoiceBySessionId: async (
        sessionId: number,
    ): Promise<ApiResponse<IInvoice>> => {
        const response = await axiosClient.get<ApiResponse<IInvoice>>(
            `/invoices/session/${sessionId}/saved`,
        );
        return response.data;
    },

    /**
     * Get invoices list with filters
     */
    getInvoices: async (
        params: IInvoiceListParams,
    ): Promise<ApiResponse<PageResponse<IInvoice>>> => {
        const response = await axiosClient.get<
            ApiResponse<PageResponse<IInvoice>>
        >(`/invoices`, { params });
        return response.data;
    },

    /**
     * Get revenue report
     */
    getRevenue: async (
        branchId: number,
        startDate?: string,
        endDate?: string,
    ): Promise<ApiResponse<IRevenueReport>> => {
        const response = await axiosClient.get<ApiResponse<IRevenueReport>>(
            `/invoices/revenue`,
            {
                params: { branchId, startDate, endDate },
            },
        );
        return response.data;
    },
};

export default invoiceService;
