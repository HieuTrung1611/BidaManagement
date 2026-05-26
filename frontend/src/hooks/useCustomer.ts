import customerService from "@/services/customerService";
import { ICustomerResponse } from "@/types/customer";
import { PaginationParams } from "@/types/base";
import useSWR from "swr";

const getCustomerByIdFetcher = async (
    id: number,
): Promise<ICustomerResponse> => {
    const res = await customerService.getCustomerById(id);
    if (!res.data) {
        throw new Error("Không tìm thấy khách hàng");
    }
    return res.data;
};

const getCustomersFetcher = async (
    keyword: string = "",
    params: PaginationParams,
) => {
    const res = await customerService.getAllCustomers(keyword, params);
    if (!res.data) {
        throw new Error("Lỗi khi tải danh sách khách hàng");
    }
    return res.data;
};

export const useCustomer = (id?: number) => {
    const shouldFetch = id !== undefined;

    const { data, error, isLoading, mutate } = useSWR<ICustomerResponse>(
        shouldFetch ? ["/customers", id] : null,
        () => getCustomerByIdFetcher(id!),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        },
    );

    return {
        customer: data,
        isLoading,
        isError: error,
        mutate,
    };
};

export const useCustomers = (
    keyword: string = "",
    params: PaginationParams,
    shouldFetch = true,
) => {
    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch ? ["/customers", keyword, params.page, params.size] : null,
        () => getCustomersFetcher(keyword, params),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            keepPreviousData: true,
        },
    );

    return {
        customers: data?.content ?? [],
        pageNumber: data?.pageNumber ?? params.page ?? 0,
        pageSize: data?.pageSize ?? params.size ?? 10,
        totalElements: data?.totalElements ?? 0,
        totalPages: data?.totalPages ?? 1,
        isLoading,
        isError: error,
        mutate,
    };
};
