"use client";

import React from "react";
import { AxiosError } from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/input/InputField";
import Select from "@/components/ui/form/Select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table/table";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useSalarySummary } from "@/hooks/useSalary";
import salaryService from "@/services/salaryService";
import { UserRole } from "@/types/auth";
import { IBranchResponse } from "@/types/branch";
import { formatCurrency, getCurrentMonth, salaryTypeLabel } from "./salaryUtils";

type SalaryManagementTabProps = {
    branches: IBranchResponse[];
};

const SalaryManagementTab: React.FC<SalaryManagementTabProps> = ({ branches }) => {
    const toast = useToast();
    const { user } = useAuth();

    const [salaryMonth, setSalaryMonth] = React.useState<string>(
        getCurrentMonth(),
    );
    const [selectedBranchId, setSelectedBranchId] = React.useState<
        number | undefined
    >(undefined);
    const [isCalculating, setIsCalculating] = React.useState(false);

    const isAdminLike =
        user?.role === UserRole.ADMIN || user?.role === UserRole.ACCOUNTANT;

    const shouldFetch = !isAdminLike || !!selectedBranchId;

    const { salarySummary, isLoading, isError, mutate } = useSalarySummary(
        salaryMonth,
        selectedBranchId,
        shouldFetch,
    );

    const branchOptions = React.useMemo(
        () =>
            branches.map((branch) => ({
                value: branch.id.toString(),
                label: branch.name,
            })),
        [branches],
    );

    const handleCalculate = async () => {
        if (!shouldFetch) {
            toast.warning("Thiếu thông tin", "Vui lòng chọn chi nhánh trước khi tính lương");
            return;
        }

        try {
            setIsCalculating(true);
            const res = await salaryService.calculateMonthlySalaries(
                salaryMonth,
                selectedBranchId,
            );

            if (res.success) {
                toast.success("Thành công", res.message || "Tính lương thành công");
                await mutate();
                return;
            }

            toast.error("Lỗi", res.message || "Không thể tính lương");
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            toast.error(
                "Lỗi",
                axiosError.response?.data?.message ||
                    "Đã xảy ra lỗi khi tính lương",
            );
        } finally {
            setIsCalculating(false);
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Bảng lương nhân viên</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                        <div>
                            <Label htmlFor="salaryMonth">Tháng lương</Label>
                            <Input
                                id="salaryMonth"
                                name="salaryMonth"
                                type="month"
                                value={salaryMonth}
                                onChange={(e) => setSalaryMonth(e.target.value)}
                            />
                        </div>

                        {isAdminLike && (
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

                        <div className="flex items-end lg:col-span-2 lg:justify-end">
                            <Button
                                onClick={handleCalculate}
                                disabled={isCalculating || !shouldFetch}>
                                {isCalculating ? "Đang tính..." : "Tính lương"}
                            </Button>
                        </div>
                    </div>

                    {!shouldFetch && (
                        <p className="text-sm text-amber-600">
                            Vui lòng chọn chi nhánh để xem và tính bảng lương.
                        </p>
                    )}

                    {salarySummary && (
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge color="info" variant="light">
                                {salarySummary.salaryMonth}
                            </Badge>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                Chi nhánh: {salarySummary.branchName || "Tất cả chi nhánh"}
                            </span>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                Nhân viên: {salarySummary.employeeCount}
                            </span>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                Tổng lương: {formatCurrency(salarySummary.totalSalary)}
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {isError ? (
                <Card>
                    <CardContent className="py-8">
                        <p className="text-center text-red-500">
                            Không thể tải dữ liệu bảng lương.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle>Tổng hợp theo chi nhánh</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Chi nhánh</TableHead>
                                        <TableHead>Số nhân viên</TableHead>
                                        <TableHead>Ngày công</TableHead>
                                        <TableHead>Giờ công</TableHead>
                                        <TableHead>Tổng lương</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-16 text-center">
                                                Đang tải dữ liệu...
                                            </TableCell>
                                        </TableRow>
                                    ) : salarySummary?.branchSummaries?.length ? (
                                        salarySummary.branchSummaries.map((item) => (
                                            <TableRow key={item.branchId}>
                                                <TableCell>{item.branchName}</TableCell>
                                                <TableCell>{item.employeeCount}</TableCell>
                                                <TableCell>{item.totalWorkingDays}</TableCell>
                                                <TableCell>{item.totalWorkingHours}</TableCell>
                                                <TableCell>{formatCurrency(item.totalSalary)}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-16 text-center">
                                                Chưa có dữ liệu tổng hợp.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Chi tiết lương nhân viên</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nhân viên</TableHead>
                                        <TableHead>Chi nhánh</TableHead>
                                        <TableHead>Loại lương</TableHead>
                                        <TableHead>Ngày công</TableHead>
                                        <TableHead>Giờ công</TableHead>
                                        <TableHead>Lương cơ bản</TableHead>
                                        <TableHead>Thưởng</TableHead>
                                        <TableHead>Khấu trừ</TableHead>
                                        <TableHead>Thực nhận</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="h-16 text-center">
                                                Đang tải dữ liệu...
                                            </TableCell>
                                        </TableRow>
                                    ) : salarySummary?.salaries?.length ? (
                                        salarySummary.salaries.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="font-medium">{item.employeeName}</div>
                                                    <div className="text-xs text-neutral-500">
                                                        {item.positionName}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{item.branchName}</TableCell>
                                                <TableCell>{salaryTypeLabel(item.salaryType)}</TableCell>
                                                <TableCell>{item.workingDays}</TableCell>
                                                <TableCell>{item.workingHours}</TableCell>
                                                <TableCell>{formatCurrency(item.baseSalary)}</TableCell>
                                                <TableCell>{formatCurrency(item.bonus)}</TableCell>
                                                <TableCell>{formatCurrency(item.deduction)}</TableCell>
                                                <TableCell>
                                                    <span className="font-semibold text-success-700 dark:text-success-400">
                                                        {formatCurrency(item.totalSalary)}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={9} className="h-16 text-center">
                                                Chưa có dữ liệu chi tiết lương.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
};

export default SalaryManagementTab;
