import axiosClient from "./axiosClient";
import { IComboRequest, IComboResponse } from "@/types/combo";
import { ApiResponse, PageResponse, PaginationParams } from "@/types/base";

const API_URL = "/combos";

const comboService = {
    createCombo: async (req: IComboRequest): Promise<ApiResponse<null>> => {
        const res = await axiosClient.post(API_URL, req);
        return res.data;
    },
    updateCombo: async (
        id: number,
        req: IComboRequest,
    ): Promise<ApiResponse<null>> => {
        const res = await axiosClient.put(`${API_URL}/${id}`, req);
        return res.data;
    },
    getComboById: async (id: number): Promise<ApiResponse<IComboResponse>> => {
        const res = await axiosClient.get(`${API_URL}/${id}`);
        return res.data;
    },
    getAllCombos: async (
        keyword: string = "",
        branchId: number | null | undefined,
        isActive: boolean | null = null,
        params: PaginationParams,
    ): Promise<ApiResponse<PageResponse<IComboResponse>>> => {
        const res = await axiosClient.get(API_URL, {
            params: {
                keyword: keyword,
                branchId: branchId,
                isActive: isActive,
                page: params.page ?? 0,
                size: params.size ?? 10,
                sort: `${params.sortBy ?? "createdAt"},${params.sortDirection ?? "desc"}`,
            },
        });
        return res.data;
    },
    deleteCombo: async (id: number): Promise<ApiResponse<null>> => {
        const res = await axiosClient.delete(`${API_URL}/${id}`);
        return res.data;
    },
};

export default comboService;
