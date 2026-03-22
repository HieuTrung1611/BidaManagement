import {
    IEmployeePositionRequest,
    IEmployeePositionResponse,
} from "@/types/employeePosition";
import axiosClient from "./axiosClient";
import { ApiResponse, PageResponse, PaginationParams } from "@/types/base";
import { get } from "http";

const API_URL = "/employee-positions";

const employeePositionService = {
    createEmployeePosition: async (
        req: IEmployeePositionRequest,
    ): Promise<ApiResponse<null>> => {
        const res = await axiosClient.post(API_URL, req);
        return res.data;
    },

    updateEmployeePosition: async (
        id: number,
        req: IEmployeePositionRequest,
    ): Promise<ApiResponse<null>> => {
        const res = await axiosClient.put(`${API_URL}/${id}`, req);
        return res.data;
    },

    getEmployeePositionById: async (
        id: number,
    ): Promise<ApiResponse<IEmployeePositionResponse>> => {
        const res = await axiosClient.get(`${API_URL}/${id}`);
        return res.data;
    },

    getAllEmployeePositionsByKeyword: async (
        keyword: string,
    ): Promise<ApiResponse<IEmployeePositionResponse[]>> => {
        const res = await axiosClient.get(`${API_URL}`, {
            params: {
                keyword: keyword,
            },
        });
        return res.data;
    },

    deleteEmployeePositionById: async (
        id: number,
    ): Promise<ApiResponse<null>> => {
        const res = await axiosClient.delete(`${API_URL}/${id}`);
        return res.data;
    },
};

export default employeePositionService;
