"use client";
import React from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
} from "@/components/ui/drawer";
import Button from "@/components/ui/button/Button";
import { IEmployeePositionResponse } from "@/types/employeePosition";
import { X } from "lucide-react";

interface EmployeePositionDetailProps {
    isOpen: boolean;
    onClose: () => void;
    employeePosition: IEmployeePositionResponse | null;
    isLoading?: boolean;
}

const EmployeePositionDetail: React.FC<EmployeePositionDetailProps> = ({
    isOpen,
    onClose,
    employeePosition,
    isLoading = false,
}) => {
    if (!employeePosition) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    return (
        <Drawer direction="right" open={isOpen} onOpenChange={onClose}>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <div className="flex items-center justify-between">
                            <DrawerTitle>Chi tiết vị trí công việc</DrawerTitle>
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

                    <div className="px-4 py-6 space-y-4">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    ID
                                </label>
                                <div className="text-sm font-mono bg-muted px-3 py-2 rounded select-text cursor-text">
                                    {employeePosition.id}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Tên vị trí
                                </label>
                                <div className="text-sm font-medium px-3 py-2 bg-background border rounded select-text cursor-text">
                                    {employeePosition.name}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Mã vị trí
                                </label>
                                <div className="text-sm font-mono px-3 py-2 bg-background border rounded select-text cursor-text">
                                    {employeePosition.code}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Lương theo giờ
                                </label>
                                <div className="text-sm font-semibold text-green-600 px-3 py-2 bg-green-50 border border-green-200 rounded select-text cursor-text">
                                    {formatCurrency(
                                        employeePosition.hourlyRate,
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Ngày tạo
                                </label>
                                <div className="text-sm px-3 py-2 bg-background border rounded select-text cursor-text">
                                    {formatDate(employeePosition.createdAt)}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Ngày cập nhật
                                </label>
                                <div className="text-sm px-3 py-2 bg-background border rounded select-text cursor-text">
                                    {formatDate(employeePosition.updatedAt)}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Người tạo
                                </label>
                                <div className="text-sm px-3 py-2 bg-background border rounded select-text cursor-text">
                                    {employeePosition.createdBy}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Người cập nhật
                                </label>
                                <div className="text-sm px-3 py-2 bg-background border rounded select-text cursor-text">
                                    {employeePosition.updatedBy}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default EmployeePositionDetail;
