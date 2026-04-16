import axiosClient from "./axiosClient";
import { ApiResponse, PageResponse, PaginationParams } from "@/types/base";
import { IShiftRequest, IShiftResponse } from "@/types/shift";

const API_URL = "/shifts";

const shiftService = {
    createShift: async (req: IShiftRequest): Promise<ApiResponse<null>> => {
        const res = await axiosClient.post(API_URL, req);
        return res.data;
    },

    updateShift: async (
        id: number,
        req: IShiftRequest,
    ): Promise<ApiResponse<null>> => {
        const res = await axiosClient.put(`${API_URL}/${id}`, req);
        return res.data;
    },

    getShiftById: async (id: number): Promise<ApiResponse<IShiftResponse>> => {
        const res = await axiosClient.get(`${API_URL}/${id}`);
        return res.data;
    },

    getAllShifts: async (
        params?: PaginationParams,
    ): Promise<ApiResponse<PageResponse<IShiftResponse>>> => {
        const res = await axiosClient.get(API_URL, {
            params: {
                page: params?.page ?? 0,
                size: params?.size ?? 20,
                sort: `${params?.sortBy ?? "id"},${params?.sortDirection ?? "asc"}`,
            },
        });
        return res.data;
    },

    deleteShiftById: async (id: number): Promise<ApiResponse<null>> => {
        const res = await axiosClient.delete(`${API_URL}/${id}`);
        return res.data;
    },
};

export default shiftService;
