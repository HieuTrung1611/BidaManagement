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
import { getUserRoleColor, getUserRoleName } from "@/constants/userRoles";
import { IAccountDetailsResponse } from "@/types/account";
import { X } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { TimelineRow } from "@/components/common/TimeLineRow";
import { formatDate } from "@/utils/date";

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
                                        color={getUserRoleColor(account.role)}
                                        variant="light">
                                        {getUserRoleName(account.role)}
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

                            {(account.createdAt || account.updatedAt) && (
                                <div className="mt-4 space-y-4 border-l pl-6">
                                    <TimelineRow
                                        key={"Ngày tạo"}
                                        label="Ngày tạo"
                                        value={formatDate(account.createdAt)}
                                    />
                                    <TimelineRow
                                        key={"Cập nhật lần cuối"}
                                        label="Cập nhật lần cuối"
                                        value={formatDate(account.updatedAt)}
                                    />
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
