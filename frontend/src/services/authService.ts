import { ILoginReq } from "@/types/auth";
import axiosClient from "./axiosClient";
import { ApiResponse } from "@/types/base";

const API_URL = "/auth";

const authService = {
    login: async (req: ILoginReq): Promise<ApiResponse<null>> => {
        const res = await axiosClient.post<ApiResponse<null>>(
            `${API_URL}/login`,
            req,
        );
        return res.data;
    },
    logout: async (): Promise<ApiResponse<null>> => {
        const res = await axiosClient.post(`${API_URL}/logout`);
        return res.data;
    },

    getCurrentUser: async (): Promise<
        ApiResponse<{ username: string; role: string }>
    > => {
        const res = await axiosClient.get(`${API_URL}/current-user`);
        return res.data;
    },
};

export default authService;
