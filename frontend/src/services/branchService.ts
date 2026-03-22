import { IBranchRequest, IBranchResponse } from "@/types/branch";
import axiosClient from "./axiosClient";
import { ApiResponse, PageResponse, PaginationParams } from "@/types/base";

const API_URL = "/branches";

const branchService = {
    createBranch: async (
        req: IBranchRequest,
        images?: File[],
    ): Promise<ApiResponse<null>> => {
        const formData = new FormData();

        // Append branch data as JSON blob
        formData.append(
            "req",
            new Blob([JSON.stringify(req)], { type: "application/json" }),
        );

        // Append images if provided
        if (images && images.length > 0) {
            images.forEach((image) => {
                formData.append("images", image);
            });
        }

        const res = await axiosClient.post(API_URL, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    },
    updateBranchById: async (
        id: number,
        req: IBranchRequest,
        images?: File[],
    ): Promise<ApiResponse<null>> => {
        const formData = new FormData();

        // Append branch data as JSON blob
        formData.append(
            "req",
            new Blob([JSON.stringify(req)], { type: "application/json" }),
        );

        // Append images if provided
        if (images && images.length > 0) {
            images.forEach((image) => {
                formData.append("images", image);
            });
        }

        const res = await axiosClient.put(`${API_URL}/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    },
    getBracnhById: async (
        id: number,
    ): Promise<ApiResponse<IBranchResponse>> => {
        const res = await axiosClient.get(`${API_URL}/${id}`);
        return res.data;
    },
    getAllBranch: async (): Promise<ApiResponse<IBranchResponse[]>> => {
        const res = await axiosClient.get(API_URL);
        return res.data;
    },
    searchBranches: async (
        keyword: string = "",
        params: PaginationParams,
    ): Promise<ApiResponse<PageResponse<IBranchResponse>>> => {
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
    deleteBranchById: async (id: number): Promise<ApiResponse<null>> => {
        const res = await axiosClient.delete(`${API_URL}/${id}`);
        return res.data;
    },
    restoreBranchById: async (id: number): Promise<ApiResponse<null>> => {
        const res = await axiosClient.put(`${API_URL}/${id}/restore`);
        return res.data;
    },
    permanentDeleteBranchById: async (
        id: number,
    ): Promise<ApiResponse<null>> => {
        const res = await axiosClient.delete(`${API_URL}/${id}/permanent`);
        return res.data;
    },
};

export default branchService;
