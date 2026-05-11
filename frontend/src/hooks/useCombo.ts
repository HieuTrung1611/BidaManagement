import comboService from "@/services/comboService";
import { PaginationParams } from "@/types/base";
import { IComboResponse } from "@/types/combo";
import useSWR from "swr";

const getComboByIdFetcher = async (id: number): Promise<IComboResponse> => {
    const res = await comboService.getComboById(id);
    if (!res.data) {
        throw new Error("Không tìm thấy combo");
    }
    return res.data;
};

const getCombosFetcher = async (
    keyword: string,
    branchId: number | null | undefined,
    isActive: boolean | null,
    params: PaginationParams,
) => {
    const res = await comboService.getAllCombos(
        keyword,
        branchId,
        isActive,
        params,
    );
    if (!res.data) {
        throw new Error("Lỗi khi tải danh sách combo");
    }
    return res.data;
};

export const useCombo = (id?: number) => {
    const shouldFetch = id !== undefined;

    const { data, error, isLoading, mutate } = useSWR<IComboResponse>(
        shouldFetch ? ["/combos", id] : null,
        () => getComboByIdFetcher(id!),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        },
    );

    return {
        combo: data,
        isLoading,
        isError: error,
        mutate,
    };
};

export const useCombos = (
    keyword: string,
    isActive: boolean | null,
    params: PaginationParams,
    branchId?: number,
) => {
    const { data, error, isLoading, mutate } = useSWR(
        [
            "/combos",
            keyword,
            branchId,
            isActive,
            params.page,
            params.size,
            params.sortBy,
            params.sortDirection,
        ],
        () => getCombosFetcher(keyword, branchId, isActive, params),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            keepPreviousData: true,
        },
    );

    return {
        combos: data?.content ?? [],
        pageNumber: data?.pageNumber ?? params.page ?? 0,
        pageSize: data?.pageSize ?? params.size ?? 10,
        totalElements: data?.totalElements ?? 0,
        totalPages: data?.totalPages ?? 1,
        isLoading,
        isError: error,
        mutate,
    };
};
