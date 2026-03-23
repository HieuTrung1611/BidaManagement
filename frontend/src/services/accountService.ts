import {
    IAccountDetailsResponse,
    IAccountRequest,
    IAccountResponse,
} from "@/types/account";
import axiosClient from "./axiosClient";
import { ApiResponse } from "@/types/base";

const API_URL = "/users";

const accountService = {
    getAllUsers: async (
        keyword?: string,
    ): Promise<ApiResponse<IAccountResponse[]>> => {
        const params = keyword ? { keyword } : {};
        const res = await axiosClient.get(API_URL, { params });
        return res.data;
    },

    getUserById: async (
        id: number,
    ): Promise<ApiResponse<IAccountDetailsResponse>> => {
        const res = await axiosClient.get(`${API_URL}/${id}`);
        return res.data;
    },

    getUserByUsername: async (
        username: string,
    ): Promise<ApiResponse<IAccountDetailsResponse>> => {
        const res = await axiosClient.get(`${API_URL}/by-username/${username}`);
        return res.data;
    },

    createUser: async (req: IAccountRequest): Promise<ApiResponse<null>> => {
        const res = await axiosClient.post(API_URL, req);
        return res.data;
    },

    updateUser: async (
        id: number,
        req: IAccountRequest,
    ): Promise<ApiResponse<null>> => {
        const res = await axiosClient.put(`${API_URL}/${id}`, req);
        return res.data;
    },

    deleteUser: async (id: number): Promise<ApiResponse<null>> => {
        const res = await axiosClient.delete(`${API_URL}/${id}`);
        return res.data;
    },

    toogleAccountActivation: async (id: number): Promise<ApiResponse<null>> => {
        const res = await axiosClient.patch(
            `${API_URL}/${id}/toggle-activation`,
        );
        return res.data;
    },
};

export default accountService;
