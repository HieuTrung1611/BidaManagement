import axiosClient from "./axiosClient";
import { IEmployeeRequest, IEmployeeResponse } from "@/types/employee";
import { ApiResponse, PageResponse, PaginationParams } from "@/types/base";

const API_URL = "/employees";

const employeeService = {
    createEmployee: async (
        req: IEmployeeRequest,
    ): Promise<ApiResponse<null>> => {
        const res = await axiosClient.post(API_URL, req);
        return res.data;
    },
    updateEmployee: async (
        id: number,
        req: IEmployeeRequest,
    ): Promise<ApiResponse<null>> => {
        const res = await axiosClient.put(`${API_URL}/${id}`, req);
        return res.data;
    },
    getEmployeeById: async (
        id: number,
    ): Promise<ApiResponse<IEmployeeResponse>> => {
        const res = await axiosClient.get(`${API_URL}/${id}`);
        return res.data;
    },
    getAllEmployees: async (
        keyword: string = "",
        branchId: number | null | undefined,
        params: PaginationParams,
    ): Promise<ApiResponse<PageResponse<IEmployeeResponse>>> => {
        const res = await axiosClient.get(API_URL, {
            params: {
                keyword: keyword,
                branchId: branchId,
                page: params.page ?? 0,
                size: params.size ?? 10,
                sortBy: params.sortBy ?? "createdAt",
                sortDirection: params.sortDirection ?? "asc",
            },
        });
        return res.data;
    },
    deleteEmployee: async (id: number): Promise<ApiResponse<null>> => {
        const res = await axiosClient.delete(`${API_URL}/${id}`);
        return res.data;
    },
};

export default employeeService;
