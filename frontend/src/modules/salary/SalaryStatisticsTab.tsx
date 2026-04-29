"use client";

import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/ui/badge/Badge";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/input/InputField";
import Select from "@/components/ui/form/Select";
import { MetaCard } from "@/components/common/MetaCard";

import { useAuth } from "@/context/AuthContext";
import { useSalaryStatistics } from "@/hooks/useSalary";
import { UserRole } from "@/types/auth";
import { IBranchResponse } from "@/types/branch";
import { formatCurrency, getCurrentMonth } from "./salaryUtils";

type SalaryStatisticsTabProps = {
    branches: IBranchResponse[];
};

const SalaryStatisticsTab: React.FC<SalaryStatisticsTabProps> = ({ branches }) => {
    const { user } = useAuth();

    const [salaryMonth, setSalaryMonth] = React.useState<string>(
        getCurrentMonth(),
    );
    const [keyword, setKeyword] = React.useState<string>("");
    const [selectedBranchId, setSelectedBranchId] = React.useState<
        number | undefined
    >(undefined);

    const isAdminLike =
        user?.role === UserRole.ADMIN || user?.role === UserRole.ACCOUNTANT;

    const shouldFetch = true;

    const { salaryStatistics, isLoading, isError } = useSalaryStatistics(
        salaryMonth,
        selectedBranchId,
        keyword,
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

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Thống kê lương theo cơ sở</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                        <div>
                            <Label htmlFor="salaryMonthStatistics">Tháng lương</Label>
                            <Input
                                id="salaryMonthStatistics"
                                name="salaryMonthStatistics"
                                type="month"
                                value={salaryMonth}
                                onChange={(e) => setSalaryMonth(e.target.value)}
                            />
                        </div>

                        {isAdminLike && (
                            <div>
                                <Label htmlFor="branchIdStatistics">Chi nhánh</Label>
                                <Select
                                    options={branchOptions}
                                    value={selectedBranchId?.toString() || ""}
                                    onChange={(value) =>
                                        setSelectedBranchId(
                                            value ? Number(value) : undefined,
                                        )
                                    }
                                    placeholder="Tất cả chi nhánh"
                                    className="h-10 w-full"
                                />
                            </div>
                        )}

                        <div className="lg:col-span-2">
                            <Label htmlFor="salaryStatisticsKeyword">Tìm kiếm</Label>
                            <Input
                                id="salaryStatisticsKeyword"
                                name="salaryStatisticsKeyword"
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Nhập tên chi nhánh hoặc tên nhân viên"
                            />
                        </div>
                    </div>

                    {salaryStatistics && (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <MetaCard
                                label="Tổng chi toàn hệ thống"
                                value={formatCurrency(salaryStatistics.totalSalary)}
                                hint={`Tháng ${salaryStatistics.salaryMonth}`}
                            />
                            <MetaCard
                                label="Tổng cơ sở"
                                value={salaryStatistics.totalBranches}
                                hint="Có dữ liệu lương"
                            />
                            <MetaCard
                                label="Đã thanh toán"
                                value={`${salaryStatistics.totalPaidEmployees}/${salaryStatistics.totalEmployees}`}
                                hint="Nhân sự đã được thanh toán"
                            />
                            <MetaCard
                                label="Trạng thái hệ thống"
                                value={
                                    <Badge
                                        color={salaryStatistics.allPaid ? "success" : "warning"}
                                        variant="light">
                                        {salaryStatistics.allPaid
                                            ? "Đã thanh toán hết"
                                            : "Còn chưa thanh toán"}
                                    </Badge>
                                }
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {isError ? (
                <Card>
                    <CardContent className="py-8">
                        <p className="text-center text-red-500">
                            Không thể tải dữ liệu thống kê lương.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {isLoading ? (
                        <Card className="lg:col-span-2">
                            <CardContent className="py-8 text-center">
                                Đang tải thống kê...
                            </CardContent>
                        </Card>
                    ) : salaryStatistics?.branchStatistics?.length ? (
                        salaryStatistics.branchStatistics.map((branch) => (
                            <Card key={branch.branchId}>
                                <CardHeader className="pb-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <CardTitle className="text-base">
                                            {branch.branchName}
                                        </CardTitle>
                                        <Badge
                                            color={branch.allPaid ? "success" : "warning"}
                                            variant="light">
                                            {branch.allPaid
                                                ? "Đã thanh toán hết"
                                                : "Chưa thanh toán đủ"}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <MetaCard
                                        label="Cần chi tháng này"
                                        value={formatCurrency(branch.totalSalary)}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <MetaCard
                                            label="Nhân viên"
                                            value={branch.employeeCount}
                                        />
                                        <MetaCard
                                            label="Đã thanh toán"
                                            value={`${branch.paidEmployeeCount}/${branch.employeeCount}`}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card className="lg:col-span-2">
                            <CardContent className="py-8 text-center text-neutral-500">
                                Chưa có dữ liệu thống kê theo điều kiện tìm kiếm.
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default SalaryStatisticsTab;
