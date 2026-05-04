import { ApiResponse, PageResponse, PaginationParams } from "@/types/base";
import {
    ITableBilliardRequest,
    ITableBilliardResponse,
} from "@/types/tableBilliard";
import axiosClient from "./axiosClient";

const API_URL = "/table-billiard";

const tableBilliardService = {
    createTableBilliard: async (
        req: ITableBilliardRequest,
    ): Promise<ApiResponse<ITableBilliardResponse>> => {
        const res = await axiosClient.post(API_URL, req);
        return res.data;
    },

    updateTableBilliard: async (
        id: number,
        req: ITableBilliardRequest,
    ): Promise<ApiResponse<ITableBilliardResponse>> => {
        const res = await axiosClient.put(`${API_URL}/${id}`, req);
        return res.data;
    },

    getTableBilliardById: async (
        id: number,
    ): Promise<ApiResponse<ITableBilliardResponse>> => {
        const res = await axiosClient.get(`${API_URL}/${id}`);
        return res.data;
    },

    getAllTableBilliards: async (
        branchId?: number,
    ): Promise<ApiResponse<ITableBilliardResponse[]>> => {
        const res = await axiosClient.get(`${API_URL}/all`, {
            params: branchId ? { branchId } : {},
        });
        return res.data;
    },

    getPageTableBilliards: async (
        params: PaginationParams,
        branchId?: number,
    ): Promise<ApiResponse<PageResponse<ITableBilliardResponse>>> => {
        const res = await axiosClient.get(API_URL, {
            params: {
                ...(branchId ? { branchId } : {}),
                page: params.page ?? 0,
                size: params.size ?? 10,
                sortBy: params.sortBy ?? "createdAt",
                sortDirection: params.sortDirection ?? "desc",
            },
        });
        return res.data;
    },

    deleteTableBilliard: async (id: number): Promise<ApiResponse<null>> => {
        const res = await axiosClient.delete(`${API_URL}/${id}`);
        return res.data;
    },
};

export default tableBilliardService;
