import employeeService from "@/services/employeeService";
import { PaginationParams } from "@/types/base";
import { IEmployeeResponse } from "@/types/employee";
import useSWR from "swr";

const getEmployeeByIdFetcher = async (
    id: number,
): Promise<IEmployeeResponse> => {
    const res = await employeeService.getEmployeeById(id);
    if (!res.data) {
        throw new Error("Không tìm thấy nhân viên");
    }
    return res.data;
};

const getEmployeesFetcher = async (
    keyword: string,
    params: PaginationParams,
) => {
    const res = await employeeService.getAllEmployees(keyword, params);
    if (!res.data) {
        throw new Error("Lỗi khi tải danh sách nhân viên");
    }
    return res.data;
};

export const useEmployee = (id?: number) => {
    const shouldFetch = id !== undefined;

    const { data, error, isLoading, mutate } = useSWR<IEmployeeResponse>(
        shouldFetch ? ["/employees", id] : null,
        () => getEmployeeByIdFetcher(id!),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        },
    );

    return {
        employee: data,
        isLoading,
        isError: error,
        mutate,
    };
};

export const useEmployees = (keyword: string, params: PaginationParams) => {
    const { data, error, isLoading, mutate } = useSWR(
        [
            "/employees",
            keyword,
            params.page,
            params.size,
            params.sortBy,
            params.sortDirection,
        ],
        () => getEmployeesFetcher(keyword, params),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            keepPreviousData: true,
        },
    );

    return {
        employees: data?.content ?? [],
        pageNumber: data?.pageNumber ?? params.page ?? 0,
        pageSize: data?.pageSize ?? params.size ?? 10,
        totalElements: data?.totalElements ?? 0,
        totalPages: data?.totalPages ?? 1,
        isLoading,
        isError: error,
        mutate,
    };
};
