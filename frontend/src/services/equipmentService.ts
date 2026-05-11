import axiosClient from "./axiosClient";
import {
    IEquipmentRequest,
    IEquipmentResponse,
    EquipmentType,
} from "@/types/equipment";
import { ApiResponse, PageResponse, PaginationParams } from "@/types/base";

const API_URL = "/equipments";

const equipmentService = {
    createEquipment: async (
        req: IEquipmentRequest,
    ): Promise<ApiResponse<null>> => {
        const res = await axiosClient.post(API_URL, req);
        return res.data;
    },
    updateEquipment: async (
        id: number,
        req: IEquipmentRequest,
    ): Promise<ApiResponse<null>> => {
        const res = await axiosClient.put(`${API_URL}/${id}`, req);
        return res.data;
    },
    getEquipmentById: async (
        id: number,
    ): Promise<ApiResponse<IEquipmentResponse>> => {
        const res = await axiosClient.get(`${API_URL}/${id}`);
        return res.data;
    },
    getAllEquipments: async (
        keyword: string = "",
        type: EquipmentType | null = null,
        branchId: number | null | undefined,
        isActive: boolean | null = null,
        params: PaginationParams,
    ): Promise<ApiResponse<PageResponse<IEquipmentResponse>>> => {
        const res = await axiosClient.get(API_URL, {
            params: {
                keyword: keyword,
                type: type,
                branchId: branchId,
                isActive: isActive,
                page: params.page ?? 0,
                size: params.size ?? 10,
                sort: `${params.sortBy ?? "createdAt"},${params.sortDirection ?? "desc"}`,
            },
        });
        return res.data;
    },
    deleteEquipment: async (id: number): Promise<ApiResponse<null>> => {
        const res = await axiosClient.delete(`${API_URL}/${id}`);
        return res.data;
    },
    getAvailableEquipments: async (
        branchId: number | null | undefined,
    ): Promise<ApiResponse<IEquipmentResponse[]>> => {
        const res = await axiosClient.get(`${API_URL}/available`, {
            params: { branchId },
        });
        return res.data;
    },
};

export default equipmentService;
