import tableBilliardService from "@/services/tableBilliardService";
import { PaginationParams } from "@/types/base";
import { ITableBilliardResponse } from "@/types/tableBilliard";
import useSWR from "swr";

const getTableBilliardByIdFetcher = async (
    id: number,
): Promise<ITableBilliardResponse> => {
    const res = await tableBilliardService.getTableBilliardById(id);
    if (!res.data) {
        throw new Error("Bàn bi-a không tồn tại.");
    }
    return res.data;
};

const getPageTableBilliardsFetcher = async (
    params: PaginationParams,
    branchId?: number,
) => {
    const res = await tableBilliardService.getPageTableBilliards(
        params,
        branchId,
    );
    if (!res.data) {
        throw new Error("Lỗi khi tải danh sách bàn");
    }
    return res.data;
};

export const useTableBilliard = (id?: number) => {
    const shouldFetch = id !== undefined;

    const { data, error, isLoading, mutate } = useSWR<ITableBilliardResponse>(
        shouldFetch ? ["/table-billiard", id] : null,
        () => getTableBilliardByIdFetcher(id!),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        },
    );

    return {
        tableBilliard: data,
        isLoading,
        isError: error,
        mutate,
    };
};

export const useTableBilliards = (
    params: PaginationParams,
    branchId?: number,
    shouldFetch: boolean = true,
) => {
    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch
            ? [
                  "/table-billiard",
                  branchId,
                  params.page,
                  params.size,
                  params.sortBy,
                  params.sortDirection,
              ]
            : null,
        () => getPageTableBilliardsFetcher(params, branchId),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            keepPreviousData: true,
        },
    );

    return {
        tableBilliards: data?.content ?? [],
        pageNumber: data?.pageNumber ?? params.page ?? 0,
        pageSize: data?.pageSize ?? params.size ?? 10,
        totalElements: data?.totalElements ?? 0,
        totalPages: data?.totalPages ?? 1,
        isLoading,
        isError: error,
        mutate,
    };
};

const getAllTableBilliardsNoPagingFetcher = async (
    branchId?: number,
): Promise<ITableBilliardResponse[]> => {
    const res = await tableBilliardService.getAllTableBilliards(branchId);

    if (!res.data) {
        throw new Error("Lỗi khi tải danh sách bàn");
    }

    return res.data;
};

export const useAllTableBilliards = (
    branchId?: number,
    shouldFetch: boolean = true,
) => {
    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch ? ["/table-billiard/all", branchId] : null,
        () => getAllTableBilliardsNoPagingFetcher(branchId),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            keepPreviousData: true,
        },
    );

    return {
        tableBilliards: data ?? [],
        isLoading,
        isError: error,
        mutate,
    };
};
