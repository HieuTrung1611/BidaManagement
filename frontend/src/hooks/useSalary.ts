import salaryService from "@/services/salaryService";
import { ISalaryStatisticsResponse, ISalarySummaryResponse } from "@/types/salary";
import useSWR from "swr";

const getSalarySummaryFetcher = async (
    salaryMonth?: string,
    branchId?: number,
): Promise<ISalarySummaryResponse> => {
    const res = await salaryService.getMonthlySalaries(salaryMonth, branchId);

    if (!res.data) {
        throw new Error("Lỗi khi tải bảng lương");
    }

    return res.data;
};

export const useSalarySummary = (
    salaryMonth?: string,
    branchId?: number,
    shouldFetch = true,
) => {
    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch ? ["/salaries", salaryMonth, branchId] : null,
        () => getSalarySummaryFetcher(salaryMonth, branchId),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            keepPreviousData: true,
        },
    );

    return {
        salarySummary: data,
        isLoading,
        isError: error,
        mutate,
    };
};

const getSalaryStatisticsFetcher = async (
    salaryMonth?: string,
    branchId?: number,
    keyword?: string,
): Promise<ISalaryStatisticsResponse> => {
    const res = await salaryService.getSalaryStatistics(salaryMonth, branchId, keyword);

    if (!res.data) {
        throw new Error("Lỗi khi tải thống kê bảng lương");
    }

    return res.data;
};

export const useSalaryStatistics = (
    salaryMonth?: string,
    branchId?: number,
    keyword?: string,
    shouldFetch = true,
) => {
    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch
            ? ["/salaries/statistics", salaryMonth, branchId, keyword]
            : null,
        () => getSalaryStatisticsFetcher(salaryMonth, branchId, keyword),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            keepPreviousData: true,
        },
    );

    return {
        salaryStatistics: data,
        isLoading,
        isError: error,
        mutate,
    };
};
