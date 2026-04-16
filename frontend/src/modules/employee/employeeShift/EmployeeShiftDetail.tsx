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
import { IShiftResponse } from "@/types/shift";
import { X } from "lucide-react";

interface EmployeeShiftDetailProps {
    isOpen: boolean;
    onClose: () => void;
    shift: IShiftResponse | null;
    isLoading?: boolean;
}

const EmployeeShiftDetail: React.FC<EmployeeShiftDetailProps> = ({
    isOpen,
    onClose,
    shift,
    isLoading = false,
}) => {
    if (!shift && !isLoading) return null;

    return (
        <Drawer direction="right" open={isOpen} onOpenChange={onClose}>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <div className="flex items-center justify-between">
                            <DrawerTitle>Chi tiết ca làm việc</DrawerTitle>
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

                    <div className="space-y-4 px-4 py-6">
                        {isLoading ? (
                            <p className="text-sm text-neutral-500">
                                Đang tải dữ liệu...
                            </p>
                        ) : (
                            <>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        ID
                                    </label>
                                    <div className="cursor-text select-text rounded bg-muted px-3 py-2 font-mono text-sm">
                                        {shift?.id}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Tên ca
                                    </label>
                                    <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm font-medium">
                                        {shift?.name}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Mã ca
                                    </label>
                                    <div className="cursor-text select-text rounded border bg-background px-3 py-2 font-mono text-sm">
                                        {shift?.code}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Bắt đầu
                                        </label>
                                        <div className="cursor-text select-text rounded border border-blue-light-300 bg-blue-light-50 px-3 py-2 text-sm font-semibold text-blue-light-700">
                                            {shift?.startTime}
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Kết thúc
                                        </label>
                                        <div className="cursor-text select-text rounded border border-success-300 bg-success-50 px-3 py-2 text-sm font-semibold text-success-700">
                                            {shift?.endTime}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Mô tả
                                    </label>
                                    <div className="min-h-24 cursor-text select-text whitespace-pre-wrap rounded border bg-background px-3 py-2 text-sm">
                                        {shift?.description || "Không có mô tả"}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default EmployeeShiftDetail;
