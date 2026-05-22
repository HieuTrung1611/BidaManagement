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
import { ICustomerResponse } from "@/types/customer";
import { X } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import {
    getCustomerRankDisplay,
    getCustomerRankColor,
} from "@/utils/customerUtils";

interface CustomerDetailProps {
    isOpen: boolean;
    onClose: () => void;
    customer: ICustomerResponse | null;
    isLoading?: boolean;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({
    isOpen,
    onClose,
    customer,
    isLoading = false,
}) => {
    const formatDate = (dateString?: string) => {
        if (!dateString) return "Chưa có";
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
                            <DrawerTitle>Chi tiết khách hàng</DrawerTitle>
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
                    ) : customer ? (
                        <div className="space-y-4 px-4 py-6">
                            {/* Avatar/Photo */}
                            {customer.photoUrl && (
                                <div className="flex justify-center">
                                    <img
                                        src={customer.photoUrl}
                                        alt={customer.name}
                                        className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                                    />
                                </div>
                            )}

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    ID
                                </label>
                                <div className="cursor-text select-text rounded bg-muted px-3 py-2 font-mono text-sm">
                                    {customer.id}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Họ và tên
                                </label>
                                <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm font-medium">
                                    {customer.name}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Email
                                </label>
                                <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm">
                                    {customer.email}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Số điện thoại
                                </label>
                                <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm">
                                    {customer.phoneNumber}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Địa chỉ
                                </label>
                                <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm">
                                    {customer.address ? (
                                        customer.address
                                    ) : (
                                        <span className="text-muted-foreground">
                                            Chưa có
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Chi nhánh
                                </label>
                                <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm">
                                    {customer.branch?.name ?? "Chưa có"}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Hạng thành viên
                                </label>
                                <div className="px-3 py-2">
                                    <Badge
                                        color={getCustomerRankColor(
                                            customer.rank,
                                        )}
                                        variant="light">
                                        {
                                            getCustomerRankDisplay(
                                                customer.rank,
                                            ).displayName
                                        }{" "}
                                        (giảm{" "}
                                        {
                                            getCustomerRankDisplay(
                                                customer.rank,
                                            ).discountPercent
                                        }
                                        %)
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Tổng chi tiêu
                                </label>
                                <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm font-semibold text-green-600">
                                    {(customer.totalSpent || 0).toLocaleString(
                                        "vi-VN",
                                    )}{" "}
                                    VNĐ
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Số lần ghé thăm
                                </label>
                                <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm font-medium">
                                    {customer.visitCount || 0} lần
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Lần ghé cuối
                                </label>
                                <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm">
                                    {formatDate(customer.lastVisitDate)}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Ghi chú
                                </label>
                                <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm">
                                    {customer.customerNotes ? (
                                        customer.customerNotes
                                    ) : (
                                        <span className="text-muted-foreground">
                                            Chưa có
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Trạng thái
                                </label>
                                <div className="px-3 py-2">
                                    <Badge
                                        color={
                                            customer.isActive
                                                ? "success"
                                                : "error"
                                        }
                                        variant="light">
                                        {customer.isActive
                                            ? "Đang hoạt động"
                                            : "Bị vô hiệu hóa"}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Ngày tạo
                                </label>
                                <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm">
                                    {formatDate(customer.createdAt)}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Cập nhật lần cuối
                                </label>
                                <div className="cursor-text select-text rounded border bg-background px-3 py-2 text-sm">
                                    {formatDate(customer.updatedAt)}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="px-4 py-12 text-center text-muted-foreground">
                            Không tìm thấy thông tin khách hàng
                        </div>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default CustomerDetail;
