import { ApiResponse, PageResponse, PaginationParams } from "@/types/base";
import {
    ITableBilliardTypeRequest,
    ITableBilliardTypeResponse,
} from "@/types/tableBilliardType";
import axiosClient from "./axiosClient";

const API_URL = "/table-billiard-types";

const tableBilliardTypeService = {
    createTableBilliardType: async (
        req: ITableBilliardTypeRequest,
    ): Promise<ApiResponse<ITableBilliardTypeResponse>> => {
        const res = await axiosClient.post(API_URL, req);
        return res.data;
    },

    updateTableBilliardType: async (
        id: number,
        req: ITableBilliardTypeRequest,
    ): Promise<ApiResponse<ITableBilliardTypeResponse>> => {
        const res = await axiosClient.put(`${API_URL}/${id}`, req);
        return res.data;
    },

    getTableBilliardTypeById: async (
        id: number,
    ): Promise<ApiResponse<ITableBilliardTypeResponse>> => {
        const res = await axiosClient.get(`${API_URL}/${id}`);
        return res.data;
    },

    getPageTableBilliardTypes: async (
        params: PaginationParams,
    ): Promise<ApiResponse<PageResponse<ITableBilliardTypeResponse>>> => {
        const res = await axiosClient.get(API_URL, {
            params: {
                page: params.page ?? 0,
                size: params.size ?? 10,
                sortBy: params.sortBy ?? "createdAt",
                sortDirection: params.sortDirection ?? "desc",
            },
        });
        return res.data;
    },

    getAllTableBilliardTypes: async (): Promise<
        ApiResponse<ITableBilliardTypeResponse[]>
    > => {
        const res = await axiosClient.get(`${API_URL}/all`);
        return res.data;
    },

    deleteTableBilliardType: async (id: number): Promise<ApiResponse<null>> => {
        const res = await axiosClient.delete(`${API_URL}/${id}`);
        return res.data;
    },
};

export default tableBilliardTypeService;
