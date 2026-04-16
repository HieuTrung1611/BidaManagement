import attendanceService from "@/services/attendanceService";
import { IAttendanceDailyResponse } from "@/types/attendance";
import useSWR from "swr";

const getDailyAttendanceFetcher = async (
    attendanceDate: string,
    branchId?: number,
): Promise<IAttendanceDailyResponse> => {
    const res = await attendanceService.getDailyAttendance(
        attendanceDate,
        branchId,
    );

    if (!res.data) {
        throw new Error("Lỗi khi tải danh sách chấm công");
    }

    return res.data;
};

export const useAttendanceDaily = (
    attendanceDate?: string,
    branchId?: number,
) => {
    const shouldFetch = Boolean(attendanceDate);

    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch ? ["/attendances/daily", attendanceDate, branchId] : null,
        () => getDailyAttendanceFetcher(attendanceDate!, branchId),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            keepPreviousData: true,
        },
    );

    return {
        attendanceDaily: data,
        isLoading,
        isError: error,
        mutate,
    };
};
