import tableBilliardTypeService from "@/services/tableBilliardTypeService";
import { PaginationParams } from "@/types/base";
import { ITableBilliardTypeResponse } from "@/types/tableBilliardType";
import useSWR from "swr";

const getTableBilliardTypeByIdFetcher = async (
    id: number,
): Promise<ITableBilliardTypeResponse> => {
    const res = await tableBilliardTypeService.getTableBilliardTypeById(id);
    if (!res.data) {
        throw new Error("Loại bàn không tồn tại.");
    }
    return res.data;
};

const getAllTableBilliardTypesFetcher = async (params: PaginationParams) => {
    const res = await tableBilliardTypeService.getAllTableBilliardTypes(params);
    if (!res.data) {
        throw new Error("Lỗi khi tải danh sách loại bàn");
    }
    return res.data;
};

export const useTableBilliardType = (id?: number) => {
    const shouldFetch = id !== undefined;

    const { data, error, isLoading, mutate } =
        useSWR<ITableBilliardTypeResponse>(
            shouldFetch ? ["/table-billiard-types", id] : null,
            () => getTableBilliardTypeByIdFetcher(id!),
            {
                revalidateOnFocus: false,
                shouldRetryOnError: false,
            },
        );

    return {
        tableBilliardType: data,
        isLoading,
        isError: error,
        mutate,
    };
};

export const useTableBilliardTypes = (params: PaginationParams) => {
    const { data, error, isLoading, mutate } = useSWR(
        [
            "/table-billiard-types",
            params.page,
            params.size,
            params.sortBy,
            params.sortDirection,
        ],
        () => getAllTableBilliardTypesFetcher(params),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            keepPreviousData: true,
        },
    );

    return {
        tableBilliardTypes: data?.content ?? [],
        pageNumber: data?.pageNumber ?? params.page ?? 0,
        pageSize: data?.pageSize ?? params.size ?? 10,
        totalElements: data?.totalElements ?? 0,
        totalPages: data?.totalPages ?? 1,
        isLoading,
        isError: error,
        mutate,
    };
};
