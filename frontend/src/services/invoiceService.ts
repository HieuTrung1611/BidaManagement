import axiosClient from "./axiosClient";
import { IApiResponse, IPaginatedResponse } from "@/types/base";
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
    generateInvoice: async (sessionId: number): Promise<IInvoiceDTO> => {
        const response = await axiosClient.get<IApiResponse<IInvoiceDTO>>(
            `/invoices/session/${sessionId}`,
        );
        return response.data.data;
    },

    /**
     * Get saved invoice by ID
     */
    getInvoiceById: async (id: number): Promise<IInvoice> => {
        const response = await axiosClient.get<IApiResponse<IInvoice>>(
            `/invoices/${id}`,
        );
        return response.data.data;
    },

    /**
     * Get saved invoice by session ID
     */
    getInvoiceBySessionId: async (sessionId: number): Promise<IInvoice> => {
        const response = await axiosClient.get<IApiResponse<IInvoice>>(
            `/invoices/session/${sessionId}/saved`,
        );
        return response.data.data;
    },

    /**
     * Get invoices list with filters
     */
    getInvoices: async (
        params: IInvoiceListParams,
    ): Promise<IPaginatedResponse<IInvoice>> => {
        const response = await axiosClient.get<
            IApiResponse<IPaginatedResponse<IInvoice>>
        >(`/invoices`, { params });
        return response.data.data;
    },

    /**
     * Get revenue report
     */
    getRevenue: async (
        branchId: number,
        startDate?: string,
        endDate?: string,
    ): Promise<IRevenueReport> => {
        const response = await axiosClient.get<IApiResponse<IRevenueReport>>(
            `/invoices/revenue`,
            {
                params: { branchId, startDate, endDate },
            },
        );
        return response.data.data;
    },
};

export default invoiceService;
