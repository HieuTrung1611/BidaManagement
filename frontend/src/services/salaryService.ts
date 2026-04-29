import { ApiResponse } from "@/types/base";
import { ISalaryStatisticsResponse, ISalarySummaryResponse } from "@/types/salary";
import axiosClient from "./axiosClient";

const API_URL = "/salaries";

const salaryService = {
    getMonthlySalaries: async (
        salaryMonth?: string,
        branchId?: number,
    ): Promise<ApiResponse<ISalarySummaryResponse>> => {
        const res = await axiosClient.get(API_URL, {
            params: {
                ...(salaryMonth ? { salaryMonth } : {}),
                ...(branchId ? { branchId } : {}),
            },
        });

        return res.data;
    },

    calculateMonthlySalaries: async (
        salaryMonth?: string,
        branchId?: number,
    ): Promise<ApiResponse<ISalarySummaryResponse>> => {
        const res = await axiosClient.post(`${API_URL}/calculate`, null, {
            params: {
                ...(salaryMonth ? { salaryMonth } : {}),
                ...(branchId ? { branchId } : {}),
            },
        });

        return res.data;
    },

    getSalaryStatistics: async (
        salaryMonth?: string,
        branchId?: number,
        keyword?: string,
    ): Promise<ApiResponse<ISalaryStatisticsResponse>> => {
        const res = await axiosClient.get(`${API_URL}/statistics`, {
            params: {
                ...(salaryMonth ? { salaryMonth } : {}),
                ...(branchId ? { branchId } : {}),
                ...(keyword ? { keyword } : {}),
            },
        });

        return res.data;
    },
};

export default salaryService;
