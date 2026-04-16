import {
    IAttendanceDailyConfirmRequest,
    IAttendanceDailyResponse,
    IAttendanceDailyUpsertRequest,
} from "@/types/attendance";
import { ApiResponse } from "@/types/base";
import axiosClient from "./axiosClient";

const API_URL = "/attendances";

const attendanceService = {
    getDailyAttendance: async (
        attendanceDate: string,
        branchId?: number,
    ): Promise<ApiResponse<IAttendanceDailyResponse>> => {
        const res = await axiosClient.get(`${API_URL}/daily`, {
            params: {
                attendanceDate,
                ...(branchId ? { branchId } : {}),
            },
        });
        return res.data;
    },

    upsertDailyAttendance: async (
        req: IAttendanceDailyUpsertRequest,
    ): Promise<ApiResponse<IAttendanceDailyResponse>> => {
        const res = await axiosClient.post(`${API_URL}/daily`, req);
        return res.data;
    },

    confirmDailyAttendance: async (
        req: IAttendanceDailyConfirmRequest,
    ): Promise<ApiResponse<IAttendanceDailyResponse>> => {
        const res = await axiosClient.post(`${API_URL}/daily/confirm`, req);
        return res.data;
    },
};

export default attendanceService;
