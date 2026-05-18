"use client";

import React, { useState, useMemo } from "react";
import { useInvoices } from "@/hooks/useInvoice";
import { useManagedBranch } from "@/hooks/useManagedBranch";
import { useBranches } from "@/hooks/useBranch";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import { InvoiceStatus } from "@/types/invoice";
import { Loader2, Receipt, Search, FileText } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/badge/Badge";
import Select from "@/components/ui/form/Select";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/Input";
import { formatCurrency } from "@/utils/formatCurrency";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const InvoicesPage: React.FC = () => {
    const { user } = useAuth();
    const { managedBranchId } = useManagedBranch();
    const { branches } = useBranches();

    const [selectedBranchId, setSelectedBranchId] = useState<
        number | undefined
    >(managedBranchId);
    const [selectedStatus, setSelectedStatus] = useState<
        InvoiceStatus | undefined
    >(undefined);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 20;

    const isAdminLike =
        user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER;

    const branchOptions = useMemo(
        () =>
            branches.map((branch) => ({
                value: branch.id.toString(),
                label: branch.name,
            })),
        [branches],
    );

    const statusOptions = [
        { value: "", label: "Tất cả trạng thái" },
        { value: InvoiceStatus.PENDING, label: "Chờ thanh toán" },
        { value: InvoiceStatus.COMPLETED, label: "Đã thanh toán" },
        { value: InvoiceStatus.CANCELLED, label: "Đã hủy" },
        { value: InvoiceStatus.REFUNDED, label: "Hoàn tiền" },
    ];

    const currentBranchId = isAdminLike ? selectedBranchId : managedBranchId;

    const { invoices, totalPages, totalElements, isLoading, isError } =
        useInvoices({
            branchId: currentBranchId || 0,
            status: selectedStatus,
            page: currentPage,
            size: pageSize,
        });

    const filteredInvoices = useMemo(() => {
        if (!searchTerm) return invoices;

        const term = searchTerm.toLowerCase();
        return invoices.filter(
            (invoice) =>
                invoice.invoiceNumber.toLowerCase().includes(term) ||
                invoice.customer?.name?.toLowerCase().includes(term) ||
                invoice.customer?.phoneNumber?.includes(term),
        );
    }, [invoices, searchTerm]);

    const getStatusColor = (
        status: InvoiceStatus,
    ): "success" | "warning" | "error" | "info" => {
        switch (status) {
            case InvoiceStatus.COMPLETED:
                return "success";
            case InvoiceStatus.PENDING:
                return "warning";
            case InvoiceStatus.CANCELLED:
                return "error";
            case InvoiceStatus.REFUNDED:
                return "info";
            default:
                return "info";
        }
    };

    const getStatusLabel = (status: InvoiceStatus): string => {
        switch (status) {
            case InvoiceStatus.COMPLETED:
                return "Đã thanh toán";
            case InvoiceStatus.PENDING:
                return "Chờ thanh toán";
            case InvoiceStatus.CANCELLED:
                return "Đã hủy";
            case InvoiceStatus.REFUNDED:
                return "Hoàn tiền";
            default:
                return status;
        }
    };

    if (!currentBranchId) {
        return (
            <div className="space-y-4">
                {isAdminLike && (
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="max-w-xs">
                            <Label htmlFor="branchId">Chi nhánh</Label>
                            <Select
                                options={branchOptions}
                                value={selectedBranchId?.toString() || ""}
                                onChange={(value) => {
                                    setSelectedBranchId(
                                        value ? Number(value) : undefined,
                                    );
                                }}
                                placeholder="Chọn chi nhánh"
                                className="h-10 w-full"
                            />
                        </div>
                    </div>
                )}
                <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)] text-gray-500">
                    <p className="text-lg">Vui lòng chọn chi nhánh</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Receipt className="w-8 h-8 text-blue-600" />
                    <div>
                        <h1 className="text-2xl font-bold">Quản lý hóa đơn</h1>
                        <p className="text-sm text-gray-600">
                            Xem và theo dõi các hóa đơn đã xuất
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {isAdminLike && (
                        <div>
                            <Label htmlFor="branchId">Chi nhánh</Label>
                            <Select
                                options={branchOptions}
                                value={selectedBranchId?.toString() || ""}
                                onChange={(value) => {
                                    setSelectedBranchId(
                                        value ? Number(value) : undefined,
                                    );
                                    setCurrentPage(0);
                                }}
                                placeholder="Chọn chi nhánh"
                                className="h-10 w-full"
                            />
                        </div>
                    )}

                    <div>
                        <Label htmlFor="status">Trạng thái</Label>
                        <Select
                            options={statusOptions}
                            value={selectedStatus || ""}
                            onChange={(value) => {
                                setSelectedStatus(
                                    (value as InvoiceStatus) || undefined,
                                );
                                setCurrentPage(0);
                            }}
                            placeholder="Chọn trạng thái"
                            className="h-10 w-full"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="search">Tìm kiếm</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                id="search"
                                type="text"
                                placeholder="Mã HĐ, tên KH, SĐT..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-blue-600 mb-1">
                            Tổng hóa đơn
                        </p>
                        <p className="text-2xl font-bold text-blue-700">
                            {totalElements}
                        </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-green-600 mb-1">
                            Đã thanh toán
                        </p>
                        <p className="text-2xl font-bold text-green-700">
                            {
                                invoices.filter(
                                    (i) => i.status === InvoiceStatus.COMPLETED,
                                ).length
                            }
                        </p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-sm text-yellow-600 mb-1">
                            Chờ thanh toán
                        </p>
                        <p className="text-2xl font-bold text-yellow-700">
                            {
                                invoices.filter(
                                    (i) => i.status === InvoiceStatus.PENDING,
                                ).length
                            }
                        </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm text-purple-600 mb-1">
                            Tổng doanh thu
                        </p>
                        <p className="text-lg font-bold text-purple-700">
                            {formatCurrency(
                                invoices
                                    .filter(
                                        (i) =>
                                            i.status ===
                                            InvoiceStatus.COMPLETED,
                                    )
                                    .reduce((sum, i) => sum + i.totalAmount, 0),
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : isError ? (
                    <div className="text-center py-12 text-red-500">
                        <p>Lỗi khi tải dữ liệu</p>
                    </div>
                ) : filteredInvoices.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">
                            Không có hóa đơn nào
                        </p>
                        <p className="text-sm">
                            {searchTerm
                                ? "Thử thay đổi từ khóa tìm kiếm"
                                : "Hóa đơn sẽ được tạo tự động khi kết thúc phiên chơi"}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Mã HĐ
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ngày
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Khách hàng
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Chi nhánh
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tổng tiền
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredInvoices.map((invoice) => (
                                        <tr
                                            key={invoice.id}
                                            className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Receipt className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {invoice.invoiceNumber}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {format(
                                                        new Date(
                                                            invoice.invoiceDate,
                                                        ),
                                                        "dd/MM/yyyy",
                                                        { locale: vi },
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {format(
                                                        new Date(
                                                            invoice.invoiceDate,
                                                        ),
                                                        "HH:mm",
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {invoice.customer ? (
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {
                                                                invoice.customer
                                                                    .name
                                                            }
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {
                                                                invoice.customer
                                                                    .phoneNumber
                                                            }
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">
                                                        Khách vãng lai
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {invoice.branch.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {formatCurrency(
                                                        invoice.totalAmount,
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <Badge
                                                    color={getStatusColor(
                                                        invoice.status,
                                                    )}>
                                                    {getStatusLabel(
                                                        invoice.status,
                                                    )}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
                                <div className="text-sm text-gray-700">
                                    Trang {currentPage + 1} / {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.max(0, currentPage - 1),
                                            )
                                        }
                                        disabled={currentPage === 0}>
                                        Trước
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.min(
                                                    totalPages - 1,
                                                    currentPage + 1,
                                                ),
                                            )
                                        }
                                        disabled={
                                            currentPage >= totalPages - 1
                                        }>
                                        Sau
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default InvoicesPage;
