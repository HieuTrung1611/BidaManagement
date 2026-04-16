"use client";

import React from "react";
import { AxiosError } from "axios";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useBranches } from "@/hooks/useBranch";
import { useAttendanceDaily } from "@/hooks/useAttendance";
import attendanceService from "@/services/attendanceService";
import { UserRole } from "@/types/auth";
import {
    AttendanceStatus,
    IAttendanceDailyResponse,
    IAttendanceResponse,
} from "@/types/attendance";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/input/InputField";
import Label from "@/components/ui/form/Label";
import Select from "@/components/ui/form/Select";
import Badge from "@/components/ui/badge/Badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table/table";

const STATUS_OPTIONS: { value: AttendanceStatus; label: string }[] = [
    { value: "PRESENT", label: "Có mặt" },
    { value: "LATE", label: "Đi trễ" },
    { value: "EARLY_LEAVE", label: "Về sớm" },
    { value: "ABSENT", label: "Vắng" },
];

const STATUS_LABELS: Record<AttendanceStatus, string> = {
    PRESENT: "Có mặt",
    ABSENT: "Vắng",
    LATE: "Đi trễ",
    EARLY_LEAVE: "Về sớm",
};

const toIsoDate = (date: Date): string => date.toISOString().slice(0, 10);

const formatDateTime = (value?: string) => {
    if (!value) return "-";

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;

    return parsed.toLocaleString("vi-VN", {
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const EmployeeAttendancePage: React.FC = () => {
    const toast = useToast();
    const { user } = useAuth();

    const [attendanceDate, setAttendanceDate] = React.useState<string>(
        toIsoDate(new Date()),
    );
    const [selectedBranchId, setSelectedBranchId] = React.useState<
        number | undefined
    >(undefined);
    const [rows, setRows] = React.useState<IAttendanceResponse[]>([]);
    const [isSaving, setIsSaving] = React.useState(false);
    const [isConfirming, setIsConfirming] = React.useState(false);

    const { branches } = useBranches();

    const isAdminLike =
        user?.role === UserRole.ADMIN || user?.role === UserRole.ACCOUNTANT;
    const requireBranchSelection = isAdminLike;

    const canFetchAttendance = !requireBranchSelection || !!selectedBranchId;
    const branchIdForApi = selectedBranchId;

    const { attendanceDaily, isLoading, isError, mutate } = useAttendanceDaily(
        canFetchAttendance ? attendanceDate : undefined,
        branchIdForApi,
    );

    React.useEffect(() => {
        setRows(attendanceDaily?.attendances ?? []);
    }, [attendanceDaily]);

    const branchOptions = React.useMemo(
        () =>
            branches.map((branch) => ({
                value: branch.id.toString(),
                label: branch.name,
            })),
        [branches],
    );

    const isConfirmed = attendanceDaily?.confirmed ?? false;

    const handleStatusChange = (
        employeeId: number,
        statusValue: string,
    ): void => {
        const status = statusValue as AttendanceStatus;

        setRows((prev) =>
            prev.map((row) => {
                if (row.employeeId !== employeeId) return row;

                return {
                    ...row,
                    status,
                    workingHours:
                        status === "ABSENT"
                            ? 0
                            : Math.max(1, row.workingHours || 8),
                };
            }),
        );
    };

    const handleWorkingHoursChange = (
        employeeId: number,
        rawValue: string,
    ): void => {
        const parsed = Number(rawValue);

        setRows((prev) =>
            prev.map((row) => {
                if (row.employeeId !== employeeId) return row;

                if (Number.isNaN(parsed)) {
                    return { ...row, workingHours: 0 };
                }

                return {
                    ...row,
                    workingHours: Math.max(0, Math.min(24, parsed)),
                };
            }),
        );
    };

    const handleNotesChange = (employeeId: number, notes: string): void => {
        setRows((prev) =>
            prev.map((row) =>
                row.employeeId === employeeId ? { ...row, notes } : row,
            ),
        );
    };

    const getRequestBranchId = (
        data?: IAttendanceDailyResponse,
    ): number | undefined => {
        if (selectedBranchId) return selectedBranchId;
        if (data?.branchId) return data.branchId;
        return undefined;
    };

    const handleSave = async () => {
        const requestBranchId = getRequestBranchId(attendanceDaily);

        if (requireBranchSelection && !requestBranchId) {
            toast.error(
                "Thiếu thông tin",
                "Vui lòng chọn chi nhánh trước khi lưu",
            );
            return;
        }

        if (rows.length === 0) {
            toast.warning("Không có dữ liệu", "Chưa có nhân viên để chấm công");
            return;
        }

        try {
            setIsSaving(true);

            const res = await attendanceService.upsertDailyAttendance({
                attendanceDate,
                branchId: requestBranchId,
                attendances: rows.map((row) => ({
                    employeeId: row.employeeId,
                    status: row.status,
                    workingHours:
                        row.status === "ABSENT" ? 0 : row.workingHours,
                    notes: row.notes?.trim() ? row.notes.trim() : undefined,
                })),
            });

            if (res.success) {
                toast.success(
                    "Thành công",
                    res.message || "Đã lưu bảng chấm công",
                );
                await mutate();
                return;
            }

            toast.error("Lỗi", res.message || "Không thể lưu bảng chấm công");
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            toast.error(
                "Lỗi",
                axiosError.response?.data?.message ||
                    "Đã xảy ra lỗi khi lưu bảng chấm công",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleConfirm = async () => {
        const requestBranchId = getRequestBranchId(attendanceDaily);

        if (requireBranchSelection && !requestBranchId) {
            toast.error(
                "Thiếu thông tin",
                "Vui lòng chọn chi nhánh trước khi chốt công",
            );
            return;
        }

        try {
            setIsConfirming(true);

            const res = await attendanceService.confirmDailyAttendance({
                attendanceDate,
                branchId: requestBranchId,
            });

            if (res.success) {
                toast.success(
                    "Thành công",
                    res.message || "Đã chốt công thành công",
                );
                await mutate();
                return;
            }

            toast.error("Lỗi", res.message || "Không thể chốt công");
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            toast.error(
                "Lỗi",
                axiosError.response?.data?.message ||
                    "Đã xảy ra lỗi khi chốt công",
            );
        } finally {
            setIsConfirming(false);
        }
    };

    const canConfirm =
        !isConfirmed &&
        !!attendanceDaily?.canConfirm &&
        (!requireBranchSelection || !!getRequestBranchId(attendanceDaily));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Chấm công nhân viên</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                    <div>
                        <Label htmlFor="attendanceDate">Ngày chấm công</Label>
                        <Input
                            id="attendanceDate"
                            name="attendanceDate"
                            type="date"
                            value={attendanceDate}
                            onChange={(e) => setAttendanceDate(e.target.value)}
                        />
                    </div>

                    {requireBranchSelection && (
                        <div>
                            <Label htmlFor="branchId">Chi nhánh</Label>
                            <Select
                                options={branchOptions}
                                value={selectedBranchId?.toString() || ""}
                                onChange={(value) =>
                                    setSelectedBranchId(
                                        value ? Number(value) : undefined,
                                    )
                                }
                                placeholder="Chọn chi nhánh"
                                className="h-10 w-full"
                            />
                        </div>
                    )}

                    <div className="flex items-end gap-2 lg:col-span-2 lg:justify-end">
                        <Button
                            variant="outline"
                            onClick={handleSave}
                            disabled={
                                isSaving ||
                                isLoading ||
                                isConfirmed ||
                                rows.length === 0 ||
                                !canFetchAttendance
                            }>
                            {isSaving ? "Đang lưu..." : "Lưu chỉnh sửa"}
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={
                                isConfirming ||
                                isLoading ||
                                rows.length === 0 ||
                                !canConfirm
                            }>
                            {isConfirming
                                ? "Đang chốt..."
                                : "Xác nhận chốt công"}
                        </Button>
                    </div>
                </div>

                {!canFetchAttendance && (
                    <p className="text-sm text-amber-600">
                        Vui lòng chọn chi nhánh để tải dữ liệu chấm công.
                    </p>
                )}

                {attendanceDaily && (
                    <div className="flex flex-wrap items-center gap-2">
                        {isConfirmed ? (
                            <Badge color="success" variant="light">
                                Đã chốt công
                            </Badge>
                        ) : (
                            <Badge color="warning" variant="light">
                                Chưa chốt
                            </Badge>
                        )}
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            Chi nhánh: {attendanceDaily.branchName || "-"}
                        </span>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            Tổng nhân viên: {attendanceDaily.totalEmployees}
                        </span>
                        {isConfirmed && (
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                Chốt lúc:{" "}
                                {formatDateTime(attendanceDaily.confirmedAt)}
                                {attendanceDaily.confirmedBy
                                    ? ` bởi ${attendanceDaily.confirmedBy}`
                                    : ""}
                            </span>
                        )}
                        {!isConfirmed &&
                            attendanceDaily.confirmBlockedReason && (
                                <span className="text-sm text-amber-600">
                                    {attendanceDaily.confirmBlockedReason}
                                </span>
                            )}
                    </div>
                )}

                {isError ? (
                    <p className="p-4 text-center text-red-500">
                        Không thể tải dữ liệu chấm công.
                    </p>
                ) : (
                    <div className="rounded-xl border border-neutral-200 dark:border-white/5">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nhân viên</TableHead>
                                    <TableHead>Vị trí</TableHead>
                                    <TableHead>Ca làm việc</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Số giờ</TableHead>
                                    <TableHead>Ghi chú</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-20 text-center">
                                            Đang tải dữ liệu...
                                        </TableCell>
                                    </TableRow>
                                ) : rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="h-20 text-center">
                                            Không có dữ liệu nhân viên.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rows.map((row) => (
                                        <TableRow key={row.employeeId}>
                                            <TableCell className="align-top">
                                                <div className="font-medium">
                                                    {row.employeeName}
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top">
                                                {row.positionName || "-"}
                                            </TableCell>
                                            <TableCell className="align-top">
                                                <div className="font-medium">
                                                    {row.shiftName || "-"}
                                                </div>
                                                {row.shiftStartTime &&
                                                    row.shiftEndTime && (
                                                        <div className="text-xs text-neutral-500">
                                                            {row.shiftStartTime}{" "}
                                                            - {row.shiftEndTime}
                                                        </div>
                                                    )}
                                            </TableCell>
                                            <TableCell className="align-top">
                                                {isConfirmed ? (
                                                    <Badge
                                                        color="light"
                                                        variant="light">
                                                        {
                                                            STATUS_LABELS[
                                                                row.status
                                                            ]
                                                        }
                                                    </Badge>
                                                ) : (
                                                    <Select
                                                        options={STATUS_OPTIONS}
                                                        value={row.status}
                                                        onChange={(value) =>
                                                            handleStatusChange(
                                                                row.employeeId,
                                                                value,
                                                            )
                                                        }
                                                        className="h-9 w-44"
                                                        placeholder={
                                                            STATUS_LABELS.PRESENT
                                                        }
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell className="align-top">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="24"
                                                    value={row.workingHours}
                                                    onChange={(e) =>
                                                        handleWorkingHoursChange(
                                                            row.employeeId,
                                                            e.target.value,
                                                        )
                                                    }
                                                    disabled={
                                                        isConfirmed ||
                                                        row.status === "ABSENT"
                                                    }
                                                    className="h-9 w-24"
                                                />
                                            </TableCell>
                                            <TableCell className="align-top min-w-55">
                                                <Input
                                                    type="text"
                                                    value={row.notes || ""}
                                                    onChange={(e) =>
                                                        handleNotesChange(
                                                            row.employeeId,
                                                            e.target.value,
                                                        )
                                                    }
                                                    disabled={isConfirmed}
                                                    placeholder="Ghi chú bất thường nếu có"
                                                    className="h-9"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default EmployeeAttendancePage;
