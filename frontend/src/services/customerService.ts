import { ICustomerRequest, ICustomerResponse } from "@/types/customer";
import axiosClient from "./axiosClient";
import { ApiResponse, PageResponse, PaginationParams } from "@/types/base";

const API_URL = "/customers";

const customerService = {
    createCustomer: async (
        req: ICustomerRequest,
    ): Promise<ApiResponse<null>> => {
        const res = await axiosClient.post(API_URL, req);
        return res.data;
    },

    updateCustomer: async (
        id: number,
        req: ICustomerRequest,
    ): Promise<ApiResponse<null>> => {
        const res = await axiosClient.put(`${API_URL}/${id}`, req);
        return res.data;
    },

    getCustomerById: async (
        id: number,
    ): Promise<ApiResponse<ICustomerResponse>> => {
        const res = await axiosClient.get(`${API_URL}/${id}`);
        return res.data;
    },

    getAllCustomersByKeyword: async (
        keyword: string,
        params: PaginationParams,
    ): Promise<ApiResponse<PageResponse<ICustomerResponse>>> => {
        const res = await axiosClient.get(`${API_URL}/search`, {
            params: {
                keyword: keyword,
                page: params.page ?? 0,
                size: params.size ?? 10,
                sortBy: params.sortBy ?? "id",
                sortDirection: params.sortDirection ?? "asc",
            },
        });
        return res.data;
    },

    softDeleteCustomerById: async (id: number): Promise<ApiResponse<null>> => {
        const res = await axiosClient.delete(`${API_URL}/${id}`);
        return res.data;
    },

    restoreCustomerById: async (id: number): Promise<ApiResponse<null>> => {
        const res = await axiosClient.put(`${API_URL}/${id}/restore`);
        return res.data;
    },

    permanentDeleteCustomerById: async (
        id: number,
    ): Promise<ApiResponse<null>> => {
        const res = await axiosClient.delete(`${API_URL}/${id}/permanent`);
        return res.data;
    },
};

export default customerService;
