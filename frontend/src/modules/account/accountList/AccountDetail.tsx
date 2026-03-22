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
import { IAccountDetailsResponse, USERROLE } from "@/types/account";
import { X } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";

interface AccountDetailProps {
    isOpen: boolean;
    onClose: () => void;
    account: IAccountDetailsResponse | null;
    isLoading?: boolean;
}

const AccountDetail: React.FC<AccountDetailProps> = ({
    isOpen,
    onClose,
    account,
    isLoading = false,
}) => {
    if (!account) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getRoleColor = (role: USERROLE) => {
        switch (role) {
            case USERROLE.ADMIN:
                return "primary";
            case USERROLE.MANAGER:
                return "warning";
            case USERROLE.ACCOUNTANT:
                return "info";
            case USERROLE.EMPLOYEE:
                return "success";
            default:
                return "light";
        }
    };

    const getRoleName = (role: USERROLE) => {
        switch (role) {
            case USERROLE.ADMIN:
                return "Quản trị viên";
            case USERROLE.MANAGER:
                return "Quản lý";
            case USERROLE.ACCOUNTANT:
                return "Kế toán";
            case USERROLE.EMPLOYEE:
                return "Nhân viên";
            default:
                return role;
        }
    };

    return (
        <Drawer direction="right" open={isOpen} onOpenChange={onClose}>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <div className="flex items-center justify-between">
                            <DrawerTitle>Chi tiết tài khoản</DrawerTitle>
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
                                    {account.id}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Tên đăng nhập
                                </label>
                                <div className="text-sm font-medium px-3 py-2 bg-background border rounded select-text cursor-text">
                                    {account.username}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Email
                                </label>
                                <div className="text-sm px-3 py-2 bg-background border rounded select-text cursor-text">
                                    {account.email}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Vai trò
                                </label>
                                <div className="px-3 py-2">
                                    <Badge
                                        color={getRoleColor(account.role)}
                                        variant="light">
                                        {getRoleName(account.role)}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Trạng thái
                                </label>
                                <div className="px-3 py-2">
                                    <Badge
                                        color={
                                            account.isActive
                                                ? "success"
                                                : "error"
                                        }
                                        variant="light">
                                        {account.isActive
                                            ? "Hoạt động"
                                            : "Tạm khóa"}
                                    </Badge>
                                </div>
                            </div>

                            {account.createdAt && (
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Ngày tạo
                                    </label>
                                    <div className="text-sm px-3 py-2 bg-background border rounded select-text cursor-text">
                                        {formatDate(account.createdAt)}
                                    </div>
                                </div>
                            )}

                            {account.updatedAt && (
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Cập nhật lần cuối
                                    </label>
                                    <div className="text-sm px-3 py-2 bg-background border rounded select-text cursor-text">
                                        {formatDate(account.updatedAt)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <DrawerFooter>
                        <Button variant="outline" onClick={onClose}>
                            Đóng
                        </Button>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default AccountDetail;
