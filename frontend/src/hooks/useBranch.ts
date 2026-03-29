import branchService from "@/services/branchService";
import { PaginationParams } from "@/types/base";
import { IBranchDetailResponse, IBranchResponse } from "@/types/branch";
import useSWR from "swr";

const getBranchByIdFetcher = async (
    id: number,
): Promise<IBranchDetailResponse> => {
    const res = await branchService.getBranchById(id);
    if (!res.data) {
        throw new Error(`Chi nhánh không tồn tại.`);
    }
    return res.data;
};

const searchBranchesFetcher = async (
    keyword: string,
    params: PaginationParams,
) => {
    const res = await branchService.searchBranches(keyword, params);
    if (!res.data) {
        throw new Error("Lỗi khi tải danh sách chi nhánh");
    }
    return res.data;
};

export const useBranch = (id?: number) => {
    const shouldFetch = id !== undefined;

    const { data, error, isLoading, mutate } = useSWR<IBranchDetailResponse>(
        shouldFetch ? ["/branches", id] : null,
        () => getBranchByIdFetcher(id!),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        },
    );
    return {
        branch: data,
        isLoading,
        isError: error,
        mutate,
    };
};

const getBranchesFeatcher = async (): Promise<IBranchResponse[]> => {
    const res = await branchService.getAllBranch();
    if (!res.data) {
        throw new Error("Lỗi khi tải danh sách chi nhánh");
    }
    return res.data;
};

export const useBranches = () => {
    const { data, error, isLoading, mutate } = useSWR(
        "/branches",
        getBranchesFeatcher,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        },
    );
    return {
        branches: data ?? [],
        isLoading,
        isError: error,
        mutate,
    };
};

export const useBranchesByKeyword = (
    keyword: string,
    params: PaginationParams,
) => {
    const { data, error, isLoading, mutate } = useSWR(
        [
            "/branches",
            keyword,
            params.page,
            params.size,
            params.sortBy,
            params.sortDirection,
        ],
        () => searchBranchesFetcher(keyword, params),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            keepPreviousData: true,
        },
    );
    return {
        branches: data?.content ?? [],
        pageNumber: data?.pageNumber ?? params.page ?? 0,
        pageSize: data?.pageSize ?? params.size ?? 10,
        totalElements: data?.totalElements ?? 0,
        totalPages: data?.totalPages ?? 1,
        isLoading,
        isError: error,
        mutate,
    };
};
