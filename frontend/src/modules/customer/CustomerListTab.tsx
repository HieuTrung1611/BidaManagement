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
import { useBranches } from "@/hooks/useBranch";
import { useCustomers } from "@/hooks/useCustomer";
import customerService from "@/services/customerService";
import { UserRole } from "@/types/auth";
import { ICustomerResponse } from "@/types/customer";
import { CustomerModal } from "./CustomerModal";
import { Edit } from "lucide-react";

const CustomerListTab: React.FC = () => {
    const toast = useToast();
    const { user } = useAuth();

    const [keyword, setKeyword] = React.useState("");
    const [selectedBranchId, setSelectedBranchId] = React.useState<
        number | undefined
    >(undefined);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedCustomer, setSelectedCustomer] = React.useState<
        ICustomerResponse | undefined
    >(undefined);
    const [page, setPage] = React.useState(0);

    const isAdminLike =
        user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER;

    const { branches } = useBranches();
    const { customers, isLoading, mutate } = useCustomers(
        keyword,
        selectedBranchId,
        { page, size: 10 },
        isAdminLike,
    );

    const branchOptions = React.useMemo(
        () =>
            branches.map((branch) => ({
                value: branch.id.toString(),
                label: branch.name,
            })),
        [branches],
    );

    const handleOpenModal = (customer?: ICustomerResponse) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const handleDeactivate = async (id: number) => {
        if (!confirm("Bạn có chắc muốn vô hiệu hóa khách hàng này?")) return;

        try {
            await customerService.deactivateCustomer(id);
            toast.success("Thành công", "Vô hiệu hóa khách hàng thành công");
            await mutate();
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            toast.error(
                "Lỗi",
                axiosError.response?.data?.message ||
                    "Không thể vô hiệu hóa khách hàng",
            );
        }
    };

    const handleReactivate = async (id: number) => {
        if (!confirm("Bạn có chắc muốn kích hoạt lại khách hàng này?")) return;

        try {
            await customerService.reactivateCustomer(id);
            toast.success("Thành công", "Kích hoạt lại khách hàng thành công");
            await mutate();
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            toast.error(
                "Lỗi",
                axiosError.response?.data?.message ||
                    "Không thể kích hoạt lại khách hàng",
            );
        }
    };

    const handleDelete = async (id: number) => {
        if (
            !confirm(
                "Bạn có chắc muốn xóa khách hàng này? Hành động này không thể hoàn tác.",
            )
        )
            return;

        try {
            await customerService.deleteCustomer(id);
            toast.success("Thành công", "Xóa khách hàng thành công");
            await mutate();
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            toast.error(
                "Lỗi",
                axiosError.response?.data?.message ||
                    "Không thể xóa khách hàng",
            );
        }
    };

    if (!isAdminLike) {
        return (
            <Card>
                <CardContent className="py-8">
                    <p className="text-center text-neutral-500">
                        Bạn không có quyền truy cập chức năng quản lý khách
                        hàng.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách khách hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <div>
                            <Label htmlFor="keyword">Tìm kiếm</Label>
                            <Input
                                id="keyword"
                                name="keyword"
                                type="text"
                                value={keyword}
                                onChange={(e) => {
                                    setKeyword(e.target.value);
                                    setPage(0);
                                }}
                                placeholder="Tên, email hoặc SĐT"
                            />
                        </div>

                        <div>
                            <Label htmlFor="branchId">Chi nhánh</Label>
                            <Select
                                options={branchOptions}
                                value={selectedBranchId?.toString() || ""}
                                onChange={(value) => {
                                    setSelectedBranchId(
                                        value ? Number(value) : undefined,
                                    );
                                    setPage(0);
                                }}
                                placeholder="Chọn chi nhánh"
                                className="h-10 w-full"
                            />
                        </div>

                        <div className="flex items-end">
                            <Button onClick={() => handleOpenModal()}>
                                + Thêm khách hàng
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tên khách hàng</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>SĐT</TableHead>
                                <TableHead>Chi nhánh</TableHead>
                                <TableHead>Hạng</TableHead>
                                <TableHead>Tổng chi tiêu</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Lần ghé</TableHead>
                                <TableHead>Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={9}
                                        className="h-16 text-center">
                                        Đang tải...
                                    </TableCell>
                                </TableRow>
                            ) : customers && customers.length > 0 ? (
                                customers.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {customer.photoUrl ? (
                                                    <img
                                                        src={customer.photoUrl}
                                                        alt={customer.name}
                                                        className="h-8 w-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700">
                                                        {customer.name
                                                            ?.trim()
                                                            .charAt(0)
                                                            .toUpperCase() ||
                                                            "?"}
                                                    </div>
                                                )}
                                                <span className="font-medium">
                                                    {customer.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>
                                            {customer.phoneNumber}
                                        </TableCell>
                                        <TableCell>
                                            {customer.branch?.name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                color={
                                                    customer.rank === "PLATINUM"
                                                        ? "error"
                                                        : customer.rank ===
                                                            "GOLD"
                                                          ? "warning"
                                                          : "info"
                                                }
                                                variant="light">
                                                {customer.rank}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {(
                                                customer.totalSpent || 0
                                            ).toLocaleString("vi-VN")}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                color={
                                                    customer.isActive
                                                        ? "success"
                                                        : "light"
                                                }
                                                variant="light">
                                                {customer.isActive
                                                    ? "Hoạt động"
                                                    : "Bị vô hiệu hóa"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {customer.visitCount || 0}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    startIcon={
                                                        <Edit className="h-4 w-4" />
                                                    }
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleOpenModal(
                                                            customer,
                                                        )
                                                    }>
                                                    Sửa
                                                </Button>
                                                {customer.isActive ? (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-orange-600"
                                                        onClick={() =>
                                                            handleDeactivate(
                                                                customer.id,
                                                            )
                                                        }>
                                                        Vô hiệu hóa
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-green-600"
                                                        onClick={() =>
                                                            handleReactivate(
                                                                customer.id,
                                                            )
                                                        }>
                                                        Kích hoạt
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={9}
                                        className="h-16 text-center">
                                        Không có khách hàng nào.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <CustomerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => mutate()}
                initialData={selectedCustomer}
            />
        </div>
    );
};

export default CustomerListTab;
