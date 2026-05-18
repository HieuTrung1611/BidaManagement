import sessionService from "@/services/sessionService";
import { PaginationParams } from "@/types/base";
import {
    IBilliardSessionResponse,
    ISessionWithDetails,
    SessionStatus,
} from "@/types/session";
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
    shouldFetch: boolean = true,
) => {
    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch
            ? [
                  "/billiard-sessions",
                  tableId,
                  customerId,
                  status,
                  branchId,
                  params.page,
                  params.size,
                  params.sortBy,
                  params.sortDirection,
              ]
            : null,
        () => getSessionsFetcher(tableId, customerId, status, branchId, params),
        {
            revalidateOnFocus: true,
            revalidateOnMount: true,
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

export const useSessionHistory = (
    branchId: number | undefined,
    date: string, // YYYY-MM-DD
) => {
    const shouldFetch = !!branchId;

    const { data, error, isLoading, mutate } = useSWR<ISessionWithDetails[]>(
        shouldFetch ? ["/sessions/history", branchId, date] : null,
        async () => {
            const res = await sessionService.getSessionHistory(branchId!, date);
            if (!res.data) throw new Error("Lỗi khi tải lịch sử phiên chơi");
            return res.data;
        },
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        },
    );

    return {
        sessions: data ?? [],
        isLoading,
        isError: error,
        mutate,
    };
};
