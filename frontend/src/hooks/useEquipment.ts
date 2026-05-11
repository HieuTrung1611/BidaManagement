import equipmentService from "@/services/equipmentService";
import { PaginationParams } from "@/types/base";
import { IEquipmentResponse, EquipmentType } from "@/types/equipment";
import useSWR from "swr";

const getEquipmentByIdFetcher = async (
    id: number,
): Promise<IEquipmentResponse> => {
    const res = await equipmentService.getEquipmentById(id);
    if (!res.data) {
        throw new Error("Không tìm thấy thiết bị");
    }
    return res.data;
};

const getEquipmentsFetcher = async (
    keyword: string,
    type: EquipmentType | null,
    branchId: number | null | undefined,
    isActive: boolean | null,
    params: PaginationParams,
) => {
    const res = await equipmentService.getAllEquipments(
        keyword,
        type,
        branchId,
        isActive,
        params,
    );
    if (!res.data) {
        throw new Error("Lỗi khi tải danh sách thiết bị");
    }
    return res.data;
};

export const useEquipment = (id?: number) => {
    const shouldFetch = id !== undefined;

    const { data, error, isLoading, mutate } = useSWR<IEquipmentResponse>(
        shouldFetch ? ["/equipments", id] : null,
        () => getEquipmentByIdFetcher(id!),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        },
    );

    return {
        equipment: data,
        isLoading,
        isError: error,
        mutate,
    };
};

export const useEquipments = (
    keyword: string,
    type: EquipmentType | null,
    isActive: boolean | null,
    params: PaginationParams,
    branchId?: number,
) => {
    const { data, error, isLoading, mutate } = useSWR(
        [
            "/equipments",
            keyword,
            type,
            branchId,
            isActive,
            params.page,
            params.size,
            params.sortBy,
            params.sortDirection,
        ],
        () => getEquipmentsFetcher(keyword, type, branchId, isActive, params),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            keepPreviousData: true,
        },
    );

    return {
        equipments: data?.content ?? [],
        pageNumber: data?.pageNumber ?? params.page ?? 0,
        pageSize: data?.pageSize ?? params.size ?? 10,
        totalElements: data?.totalElements ?? 0,
        totalPages: data?.totalPages ?? 1,
        isLoading,
        isError: error,
        mutate,
    };
};
