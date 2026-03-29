import accountService from "@/services/accountService";
import { IAccountDetailsResponse, IAccountResponse } from "@/types/account";
import useSWR from "swr";

const getAccountByIdFetcher = async (
    id: number,
): Promise<IAccountDetailsResponse> => {
    const res = await accountService.getUserById(id);
    if (!res.data) {
        throw new Error(`Người dùng không tồn tại.`);
    }
    return res.data;
};

const getAccountByUsernameFetcher = async (
    username: string,
): Promise<IAccountDetailsResponse> => {
    const res = await accountService.getUserByUsername(username);
    if (!res.data) {
        throw new Error(`Người dùng không tồn tại.`);
    }
    return res.data;
};

const getAllAccountsByKeywordFetcher = async (
    keyword: string,
): Promise<IAccountResponse[]> => {
    const res = await accountService.getAllUsers(keyword);

    if (!res.data) {
        throw new Error("Lỗi khi tìm kiếm tài khoản");
    }
    return res.data;
};

export const useAccount = (id?: number) => {
    const shouldFetch = id !== undefined;

    const { data, error, isLoading, mutate } = useSWR<IAccountDetailsResponse>(
        shouldFetch ? `/users/${id}` : null,
        () => getAccountByIdFetcher(id!),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        },
    );

    return {
        account: data,
        isLoading,
        isError: error,
        mutate,
    };
};

export const useAccountByUsername = (username?: string) => {
    const shouldFetch = username !== undefined;

    const { data, error, isLoading, mutate } = useSWR<IAccountDetailsResponse>(
        shouldFetch ? `/users/by-username/${username}` : null,
        () => getAccountByUsernameFetcher(username!),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        },
    );

    return {
        account: data,
        isLoading,
        isError: error,
        mutate,
    };
};

export const useAccountsByKeyword = (keyword: string = "") => {
    const { data, error, isLoading, mutate } = useSWR(
        ["/users", keyword],
        () => getAllAccountsByKeywordFetcher(keyword),
        {
            revalidateOnFocus: false, // Không fetch lại khi quay lại tab
            shouldRetryOnError: false, // Không retry khi lỗi
            keepPreviousData: true, // Giữ data cũ khi fetch data mới
        },
    );

    return {
        isLoading,
        isError: error,
        mutate,
        accounts: data ?? [],
    };
};
