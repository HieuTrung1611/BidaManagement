import useSWR from "swr";
import invoiceService from "@/services/invoiceService";
import {
    IInvoiceDTO,
    IInvoice,
    IInvoiceListParams,
    IRevenueReport,
} from "@/types/invoice";

/**
 * Hook to generate invoice preview
 */
export const useInvoicePreview = (sessionId: number | null | undefined) => {
    const { data, error, isLoading, mutate } = useSWR<IInvoiceDTO>(
        sessionId ? `/invoices/preview/${sessionId}` : null,
        () => (sessionId ? invoiceService.generateInvoice(sessionId) : null),
        {
            revalidateOnFocus: false,
            revalidateOnMount: true,
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
    const { data, error, isLoading, mutate } = useSWR<IInvoice>(
        id ? `/invoices/${id}` : null,
        () => (id ? invoiceService.getInvoiceById(id) : null),
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
    const { data, error, isLoading, mutate } = useSWR<IInvoice>(
        sessionId ? `/invoices/session/${sessionId}` : null,
        () =>
            sessionId ? invoiceService.getInvoiceBySessionId(sessionId) : null,
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
    const { data, error, isLoading, mutate } = useSWR(
        params.branchId ? [`/invoices`, params] : null,
        () => invoiceService.getInvoices(params),
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
    const { data, error, isLoading, mutate } = useSWR<IRevenueReport>(
        branchId ? [`/invoices/revenue`, branchId, startDate, endDate] : null,
        () =>
            branchId
                ? invoiceService.getRevenue(branchId, startDate, endDate)
                : null,
    );

    return {
        revenue: data,
        isLoading,
        isError: error,
        mutate,
    };
};
