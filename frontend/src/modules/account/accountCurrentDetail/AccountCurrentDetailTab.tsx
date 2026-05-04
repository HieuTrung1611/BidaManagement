"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useAccountByUsername } from "@/hooks/useAccount";
import { getUserRoleColor, getUserRoleName } from "@/constants/userRoles";
import accountService from "@/services/accountService";
import { AccountModal } from "@/modules/account/accountList/AccountModal";
import { IAccountRequest, IAccountResponse } from "@/types/account";
import { AxiosError } from "axios";
import React from "react";
import { MetaCard } from "@/components/common/MetaCard";
import { TimelineRow } from "@/components/common/TimeLineRow";
import { useBranch } from "@/hooks/useBranch";

const formatDateTime = (date?: string) => {
    if (!date) return "--";
    return new Date(date).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const AccountCurrentDetailTab = () => {
    const { user } = useAuth();
    const { success, error } = useToast();
    const { account, isLoading, isError, mutate } = useAccountByUsername(
        user?.username,
    );

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
        {},
    );
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const { branch } = useBranch(account?.branchId ?? undefined);

    const handleOpenModal = () => {
        if (!account) return;
        setFormErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setFormErrors({});
        setIsModalOpen(false);
    };

    const handleSubmit = async (
        values: IAccountRequest,
        accountId?: number,
    ) => {
        const targetId = accountId ?? account?.id;
        if (!targetId) return;

        setIsSubmitting(true);
        setFormErrors({});

        try {
            await accountService.updateUser(targetId, values);
            success("Cập nhật tài khoản thành công");
            await mutate();
            setIsModalOpen(false);
        } catch (err) {
            const axiosError = err as AxiosError<{
                message?: string;
                errors?: Record<string, string>;
            }>;
            const fieldErrors = axiosError.response?.data?.errors;
            if (fieldErrors) {
                setFormErrors(fieldErrors);
            }
            const message =
                axiosError.response?.data?.message ||
                "Có lỗi xảy ra khi cập nhật tài khoản";
            error("Không thể cập nhật tài khoản", message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const initialData: IAccountResponse | null = account
        ? {
              id: account.id,
              username: account.username,
              email: account.email,
              role: account.role,
              isActive: account.isActive,
              branchId: account.branchId ?? null,
          }
        : null;

    const renderContent = () => {
        if (!user) {
            return (
                <p className="text-sm text-muted-foreground">
                    Không tìm thấy thông tin người dùng hiện tại.
                </p>
            );
        }

        if (isLoading) {
            return (
                <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                        <div
                            key={index}
                            className="h-10 animate-pulse rounded bg-muted"
                        />
                    ))}
                </div>
            );
        }

        if (isError) {
            return (
                <p className="text-sm text-red-500">
                    Không thể tải thông tin tài khoản. Vui lòng thử lại sau.
                </p>
            );
        }

        if (!account) {
            return (
                <p className="text-sm text-muted-foreground">
                    Chưa có thông tin tài khoản để hiển thị.
                </p>
            );
        }

        const initials = (account.username ?? "?").slice(0, 2).toUpperCase();

        const overviewCards = [
            {
                label: "Vai trò",
                value: (
                    <Badge
                        color={getUserRoleColor(account.role)}
                        variant="light">
                        {getUserRoleName(account.role)}
                    </Badge>
                ),
                hint: "Phân quyền hiện tại",
            },
            {
                label: "Trạng thái",
                value: (
                    <Badge
                        color={account.isActive ? "success" : "error"}
                        variant="light">
                        {account.isActive ? "Hoạt động" : "Tạm khóa"}
                    </Badge>
                ),
                hint: account.isActive
                    ? "Người dùng có thể đăng nhập"
                    : "Người dùng đang bị khóa",
            },
            {
                label: "Người tạo",
                value: account.createdBy || "--",
                hint: "Theo dữ liệu hệ thống",
            },
            {
                label: "Người cập nhật",
                value: account.updatedBy || "--",
                hint: "Lần chỉnh sửa gần nhất",
            },
            {
                label: "Chi nhánh",
                value: branch ? branch.name : "Không có (Admin)",
                hint: "Chi nhánh được phân công",
            },
        ];

        const timeline = [
            { label: "Ngày tạo", value: formatDateTime(account.createdAt) },
            {
                label: "Cập nhật lần cuối",
                value: formatDateTime(account.updatedAt),
            },
        ];

        return (
            <div className="space-y-6">
                <div className="rounded-3xl border bg-linear-to-r from-primary/10 via-primary/5 to-background p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-semibold text-primary-foreground">
                                {initials}
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">
                                    {account.username}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {account.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                size="sm"
                                onClick={handleOpenModal}
                                disabled={!account}>
                                Chỉnh sửa
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <MetaCard label="Tên đăng nhập" value={account.username} />
                    <MetaCard label="Email" value={account.email} />
                    {overviewCards.map((card) => (
                        <MetaCard
                            key={card.label}
                            label={card.label}
                            value={card.value}
                            hint={card.hint}
                        />
                    ))}
                </div>

                <div className="rounded-2xl border p-5">
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Dòng thời gian
                    </p>
                    <div className="mt-4 space-y-4 border-l pl-6">
                        {timeline.map((item) => (
                            <TimelineRow
                                key={item.label}
                                label={item.label}
                                value={item.value}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Card>
                <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>Thông tin tài khoản</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Dữ liệu chỉ dùng để xem, vui lòng sử dụng nút bên
                            cạnh nếu bạn muốn chỉnh sửa.
                        </p>
                    </div>
                </CardHeader>
                <CardContent>{renderContent()}</CardContent>
            </Card>

            <AccountModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                initialData={initialData}
                errors={formErrors}
            />
        </>
    );
};

export default AccountCurrentDetailTab;
