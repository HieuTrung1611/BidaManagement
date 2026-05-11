import customerService from "@/services/customerService";
import { ICustomerResponse } from "@/types/customer";
import { PaginationParams } from "@/types/base";
import useSWR from "swr";

const getCustomersFetcher = async (
    keyword: string = "",
    branchId: number | null | undefined,
    params: PaginationParams,
): Promise<ICustomerResponse[]> => {
    const res = await customerService.getAllCustomers(
        keyword,
        branchId,
        params,
    );
    if (!res.data) {
        throw new Error("Lỗi khi tải danh sách khách hàng");
    }
    return res.data?.content || [];
};

export const useCustomers = (
    keyword: string = "",
    branchId: number | null | undefined,
    params: PaginationParams,
    shouldFetch = true,
) => {
    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch
            ? ["/customers", keyword, branchId, params.page, params.size]
            : null,
        () => getCustomersFetcher(keyword, branchId, params),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            keepPreviousData: true,
        },
    );

    return {
        customers: data ?? [],
        isLoading,
        isError: error,
        mutate,
    };
};
