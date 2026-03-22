"use client";

import employeePositionService from "@/services/employeePositionService";
import { PageResponse } from "@/types/base";
import { IBranchResponse } from "@/types/branch";
import { ICustomerResponse } from "@/types/customer";
import {
    IEmployeePositionRequest,
    IEmployeePositionResponse,
} from "@/types/employeePosition";
import { useState } from "react";
import useSWR from "swr";

const getEmployeePositionByIdFetcher = async (
    id: number,
): Promise<IEmployeePositionResponse> => {
    const res = await employeePositionService.getEmployeePositionById(id);
    if (!res.data) {
        throw new Error(`Employee position not found or data is missing.`);
    }
    return res.data;
};

const getAllEmployeePositionsByKeywordFetcher = async (
    keyword: string,
): Promise<IEmployeePositionResponse[]> => {
    const res =
        await employeePositionService.getAllEmployeePositionsByKeyword(keyword);

    if (!res.data) {
        throw new Error("Lỗi khi tìm kiếm vị trí nhân viên");
    }
    return res.data;
};

export const useEmployeePosition = (id?: number) => {
    const shouldFetch = id !== undefined;

    const { data, error, isLoading, mutate } =
        useSWR<IEmployeePositionResponse>(
            shouldFetch ? `/employee-positions/${id}` : null,
            () => getEmployeePositionByIdFetcher(id!),
            {
                revalidateOnFocus: false,
                shouldRetryOnError: false,
            },
        );

    return {
        employeePosition: data,
        isLoading,
        isError: error,
        mutate,
    };
};

export const useEmployeePositionsByKeyword = (keyword: string = "") => {
    const { data, error, isLoading, mutate } = useSWR(
        ["/employee-positions", keyword],
        () => getAllEmployeePositionsByKeywordFetcher(keyword),
        {
            revalidateOnFocus: false, //Không fetch lại khi quay lại tab
            shouldRetryOnError: false, //Không retry khi lỗi
            keepPreviousData: true, //Giữ data cũ khi fetch data mới
        },
    );
    return {
        isLoading,
        isError: error,
        mutate,
        employeePositions: data ?? [],
    };
};
