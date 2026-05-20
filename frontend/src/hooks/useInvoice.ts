import useSWR from "swr";
import invoiceService from "@/services/invoiceService";
import {
    IInvoiceDTO,
    IInvoice,
    IInvoiceListParams,
    IRevenueReport,
} from "@/types/invoice";
import { PageResponse } from "@/types/base";

// Fetcher functions
const generateInvoiceFetcher = async (
    sessionId: number,
): Promise<IInvoiceDTO> => {
    const res = await invoiceService.generateInvoice(sessionId);
    if (!res.data) {
        throw new Error("Không thể tạo preview hóa đơn");
    }
    return res.data;
};

const getInvoiceByIdFetcher = async (id: number): Promise<IInvoice> => {
    const res = await invoiceService.getInvoiceById(id);
    if (!res.data) {
        throw new Error("Không tìm thấy hóa đơn");
    }
    return res.data;
};

const getInvoiceBySessionIdFetcher = async (
    sessionId: number,
): Promise<IInvoice> => {
    const res = await invoiceService.getInvoiceBySessionId(sessionId);
    if (!res.data) {
        throw new Error("Không tìm thấy hóa đơn cho phiên chơi này");
    }
    return res.data;
};

const getInvoicesFetcher = async (
    params: IInvoiceListParams,
): Promise<PageResponse<IInvoice>> => {
    const res = await invoiceService.getInvoices(params);
    if (!res.data) {
        throw new Error("Không thể tải danh sách hóa đơn");
    }
    return res.data;
};

const getRevenueFetcher = async (
    branchId: number,
    startDate?: string,
    endDate?: string,
): Promise<IRevenueReport> => {
    const res = await invoiceService.getRevenue(branchId, startDate, endDate);
    if (!res.data) {
        throw new Error("Không thể tải báo cáo doanh thu");
    }
    return res.data;
};

/**
 * Hook to generate invoice preview
 */
export const useInvoicePreview = (sessionId: number | null | undefined) => {
    const shouldFetch = sessionId !== undefined && sessionId !== null;

    const { data, error, isLoading, mutate } = useSWR<IInvoiceDTO>(
        shouldFetch ? `/invoices/preview/${sessionId}` : null,
        () => generateInvoiceFetcher(sessionId!),
        {
            revalidateOnFocus: false,
            revalidateOnMount: true,
            shouldRetryOnError: false,
        },
    );

    return {
        invoice: data,
        isLoading,
        isError: error,
        mutate,
    };
};

/**
 * Hook to get saved invoice by ID
 */
export const useInvoice = (id: number | null | undefined) => {
    const shouldFetch = id !== undefined && id !== null;

    const { data, error, isLoading, mutate } = useSWR<IInvoice>(
        shouldFetch ? `/invoices/${id}` : null,
        () => getInvoiceByIdFetcher(id!),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        },
    );

    return {
        invoice: data,
        isLoading,
        isError: error,
        mutate,
    };
};

/**
 * Hook to get saved invoice by session ID
 */
export const useInvoiceBySession = (sessionId: number | null | undefined) => {
    const shouldFetch = sessionId !== undefined && sessionId !== null;

    const { data, error, isLoading, mutate } = useSWR<IInvoice>(
        shouldFetch ? `/invoices/session/${sessionId}` : null,
        () => getInvoiceBySessionIdFetcher(sessionId!),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        },
    );

    return {
        invoice: data,
        isLoading,
        isError: error,
        mutate,
    };
};

/**
 * Hook to get invoices list
 */
export const useInvoices = (params: IInvoiceListParams) => {
    const shouldFetch = params.branchId !== undefined && params.branchId !== null;

    const { data, error, isLoading, mutate } = useSWR<PageResponse<IInvoice>>(
        shouldFetch ? [`/invoices`, params] : null,
        () => getInvoicesFetcher(params),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            keepPreviousData: true,
        },
    );

    return {
        invoices: data?.content || [],
        totalPages: data?.totalPages || 0,
        totalElements: data?.totalElements || 0,
        isLoading,
        isError: error,
        mutate,
    };
};

/**
 * Hook to get revenue report
 */
export const useRevenue = (
    branchId: number | null | undefined,
    startDate?: string,
    endDate?: string,
) => {
    const shouldFetch = branchId !== undefined && branchId !== null;

    const { data, error, isLoading, mutate } = useSWR<IRevenueReport>(
        shouldFetch ? [`/invoices/revenue`, branchId, startDate, endDate] : null,
        () => getRevenueFetcher(branchId!, startDate, endDate),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        },
    );

    return {
        revenue: data,
        isLoading,
        isError: error,
        mutate,
    };
};
