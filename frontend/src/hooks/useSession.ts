import sessionService from "@/services/sessionService";
import { PaginationParams } from "@/types/base";
import { IBilliardSessionResponse, SessionStatus } from "@/types/session";
import useSWR from "swr";

const getSessionByIdFetcher = async (
    id: number,
): Promise<IBilliardSessionResponse> => {
    const res = await sessionService.getSessionById(id);
    if (!res.data) {
        throw new Error("Không tìm thấy phiên chơi");
    }
    return res.data;
};

const getSessionsFetcher = async (
    tableId: number | undefined,
    customerId: number | undefined,
    status: SessionStatus | undefined,
    branchId: number | undefined,
    params: PaginationParams,
) => {
    const res = await sessionService.getAllSessions(
        tableId,
        customerId,
        status,
        branchId,
        params,
    );
    if (!res.data) {
        throw new Error("Lỗi khi tải danh sách phiên chơi");
    }
    return res.data;
};

export const useSession = (id?: number) => {
    const shouldFetch = id !== undefined;

    const { data, error, isLoading, mutate } = useSWR<IBilliardSessionResponse>(
        shouldFetch ? ["/billiard-sessions", id] : null,
        () => getSessionByIdFetcher(id!),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        },
    );

    return {
        session: data,
        isLoading,
        isError: error,
        mutate,
    };
};

export const useSessions = (
    tableId: number | undefined,
    customerId: number | undefined,
    status: SessionStatus | undefined,
    params: PaginationParams,
    branchId?: number,
) => {
    const { data, error, isLoading, mutate } = useSWR(
        [
            "/billiard-sessions",
            tableId,
            customerId,
            status,
            branchId,
            params.page,
            params.size,
            params.sortBy,
            params.sortDirection,
        ],
        () =>
            getSessionsFetcher(tableId, customerId, status, branchId, params),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            keepPreviousData: true,
        },
    );

    return {
        sessions: data?.content ?? [],
        pageNumber: data?.pageNumber ?? params.page ?? 0,
        pageSize: data?.pageSize ?? params.size ?? 10,
        totalElements: data?.totalElements ?? 0,
        totalPages: data?.totalPages ?? 1,
        isLoading,
        isError: error,
        mutate,
    };
};
