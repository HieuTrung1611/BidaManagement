import {
    ICustomerRankOption,
    ICustomerRequest,
    ICustomerResponse,
} from "@/types/customer";
import axiosClient from "./axiosClient";
import { ApiResponse, PageResponse, PaginationParams } from "@/types/base";

const API_URL = "/customers";

const customerService = {
    createCustomer: async (
        req: ICustomerRequest,
    ): Promise<ApiResponse<ICustomerResponse>> => {
        const res = await axiosClient.post(API_URL, req);
        return res.data;
    },

    updateCustomer: async (
        id: number,
        req: ICustomerRequest,
    ): Promise<ApiResponse<ICustomerResponse>> => {
        const res = await axiosClient.put(`${API_URL}/${id}`, req);
        return res.data;
    },

    getCustomerById: async (
        id: number,
    ): Promise<ApiResponse<ICustomerResponse>> => {
        const res = await axiosClient.get(`${API_URL}/${id}`);
        return res.data;
    },

    getAllCustomers: async (
        keyword: string = "",
        params: PaginationParams,
    ): Promise<ApiResponse<PageResponse<ICustomerResponse>>> => {
        const res = await axiosClient.get(API_URL, {
            params: {
                keyword: keyword,
                page: params.page ?? 0,
                size: params.size ?? 10,
                sortBy: params.sortBy ?? "id",
                sortDirection: params.sortDirection ?? "DESC",
            },
        });
        return res.data;
    },

    deleteCustomer: async (id: number): Promise<ApiResponse<null>> => {
        const res = await axiosClient.delete(`${API_URL}/${id}`);
        return res.data;
    },

    deactivateCustomer: async (id: number): Promise<ApiResponse<null>> => {
        const res = await axiosClient.post(`${API_URL}/${id}/deactivate`);
        return res.data;
    },

    reactivateCustomer: async (id: number): Promise<ApiResponse<null>> => {
        const res = await axiosClient.post(`${API_URL}/${id}/reactivate`);
        return res.data;
    },

    uploadCustomerPhoto: async (
        id: number,
        file: File,
    ): Promise<ApiResponse<ICustomerResponse>> => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axiosClient.post(
            `${API_URL}/${id}/upload-photo`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );
        return res.data;
    },

    updateCustomerNotes: async (
        id: number,
        notes: string,
    ): Promise<ApiResponse<ICustomerResponse>> => {
        const res = await axiosClient.put(`${API_URL}/${id}/notes`, {
            notes,
        });
        return res.data;
    },

    recordCustomerVisit: async (
        id: number,
    ): Promise<ApiResponse<ICustomerResponse>> => {
        const res = await axiosClient.post(`${API_URL}/${id}/record-visit`);
        return res.data;
    },

    getRanks: async (): Promise<ApiResponse<ICustomerRankOption[]>> => {
        const res = await axiosClient.get(`${API_URL}/ranks`);
        return res.data;
    },

    recognizeFace: async (
        file: File,
        branchId?: number,
    ): Promise<
        ApiResponse<{
            matched: boolean;
            customer?: ICustomerResponse;
            similarity?: number;
            message: string;
        }>
    > => {
        const formData = new FormData();
        formData.append("file", file);
        if (branchId) {
            formData.append("branchId", branchId.toString());
        }

        const res = await axiosClient.post(
            `${API_URL}/recognize-face`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );
        return res.data;
    },
};

export default customerService;
