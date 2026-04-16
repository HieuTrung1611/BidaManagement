import shiftService from "@/services/shiftService";
import { PaginationParams } from "@/types/base";
import { IShiftResponse } from "@/types/shift";
import useSWR from "swr";

const getShiftByIdFetcher = async (id: number): Promise<IShiftResponse> => {
    const res = await shiftService.getShiftById(id);
    if (!res.data) {
        throw new Error("Không tìm thấy ca làm việc");
    }
    return res.data;
};

const getAllShiftsFetcher = async (params: PaginationParams) => {
    const res = await shiftService.getAllShifts(params);
    if (!res.data) {
        throw new Error("Lỗi khi tải danh sách ca làm việc");
    }
    return res.data;
};

export const useShift = (id?: number) => {
    const shouldFetch = id !== undefined;

    const { data, error, isLoading, mutate } = useSWR<IShiftResponse>(
        shouldFetch ? ["/shifts", id] : null,
        () => getShiftByIdFetcher(id!),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        },
    );

    return {
        shift: data,
        isLoading,
        isError: error,
        mutate,
    };
};

export const useShifts = (params: PaginationParams = { page: 0, size: 20 }) => {
    const { data, error, isLoading, mutate } = useSWR(
        [
            "/shifts",
            params.page,
            params.size,
            params.sortBy,
            params.sortDirection,
        ],
        () => getAllShiftsFetcher(params),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            keepPreviousData: true,
        },
    );

    return {
        shifts: data?.content ?? [],
        pageNumber: data?.pageNumber ?? params.page ?? 0,
        pageSize: data?.pageSize ?? params.size ?? 20,
        totalElements: data?.totalElements ?? 0,
        totalPages: data?.totalPages ?? 1,
        isLoading,
        isError: error,
        mutate,
    };
};
