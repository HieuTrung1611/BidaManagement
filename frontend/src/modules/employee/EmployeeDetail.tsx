"use client";

import React from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import Button from "@/components/ui/button/Button";
import { IEmployeeResponse } from "@/types/employee";
import { IEmployeePositionResponse } from "@/types/employeePosition";
import { X } from "lucide-react";
import { TimelineRow } from "@/components/common/TimeLineRow";
import { formatDate } from "@/utils/date";

interface EmployeeDetailProps {
    isOpen: boolean;
    onClose: () => void;
    employee: IEmployeeResponse | null;
    isLoading?: boolean;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({
    isOpen,
    onClose,
    employee,
    isLoading = false,
}) => {
    const formatDob = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const LoadingSkeleton = () => (
        <div className="space-y-4 px-4 py-6">
            {[...Array(9)].map((_, index) => (
                <div key={index} className="grid gap-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                    <div className="h-10 w-full animate-pulse rounded border bg-muted"></div>
                </div>
            ))}
        </div>
    );

    return (
        <Drawer direction="right" open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="transition-all duration-200 max-h-screen overflow-y-auto overflow-x-hidden">
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <div className="flex items-center justify-between">
                            <DrawerTitle>Chi tiết nhân viên</DrawerTitle>
                            <DrawerClose asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={onClose}
                                    className="h-8 w-8">
                                    <X className="h-4 w-4" />
                                </Button>
                            </DrawerClose>
                        </div>
                    </DrawerHeader>

                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : employee ? (
                        <div className="space-y-4 px-4 py-6">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    ID
                                </label>
                                <div className="cursor-text select-text rounded bg-muted px-3 py-2 font-mono text-sm">
                                    {employee.id}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Họ và tên
                                </label>
                                <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm font-medium">
                                    {employee.name}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Email
                                </label>
                                <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm">
                                    {employee.email}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Số điện thoại
                                </label>
                                <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm">
                                    {employee.phoneNumber}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Ngày sinh
                                </label>
                                <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm">
                                    {formatDob(employee.dob)}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Địa chỉ
                                </label>
                                <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm">
                                    {employee.address ? (
                                        employee.address
                                    ) : (
                                        <span className="text-muted-foreground">
                                            Chưa có
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Vị trí
                                </label>
                                <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm">
                                    {employee.position ? (
                                        employee.position.name
                                    ) : (
                                        <span className="text-muted-foreground">
                                            Chưa có
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Người tạo
                                </label>
                                <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm">
                                    {employee.createdBy ? (
                                        employee.createdBy
                                    ) : (
                                        <span className="text-muted-foreground">
                                            Chưa có
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Người cập nhật
                                </label>
                                <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm">
                                    {employee.updatedBy ? (
                                        employee.updatedBy
                                    ) : (
                                        <span className="text-muted-foreground">
                                            Chưa có
                                        </span>
                                    )}
                                </div>
                            </div>
                            {(employee.createdAt || employee.updatedAt) && (
                                <div className="mt-6 space-y-4 border-l pl-6">
                                    <TimelineRow
                                        key={"Ngày tạo"}
                                        label="Ngày tạo"
                                        value={formatDate(employee.createdAt)}
                                    />
                                    <TimelineRow
                                        key={"Cập nhật lần cuối"}
                                        label="Cập nhật lần cuối"
                                        value={formatDate(employee.updatedAt)}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center px-4 py-12">
                            <p className="text-muted-foreground">
                                Không tìm thấy dữ liệu nhân viên
                            </p>
                        </div>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default EmployeeDetail;
