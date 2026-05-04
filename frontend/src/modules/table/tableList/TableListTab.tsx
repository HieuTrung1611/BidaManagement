"use client";

import InputSearch from "@/components/common/InputSearch";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Select from "@/components/ui/form/Select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/table/DataTable";
import { useAuth } from "@/context/AuthContext";
import { useCrudActions } from "@/hooks/useCrudActions";
import { useBranches } from "@/hooks/useBranch";
import { useManagedBranch } from "@/hooks/useManagedBranch";
import { useTableBilliards } from "@/hooks/useTableBilliard";
import { useAllTableBilliardTypes } from "@/hooks/useTableBilliardType";
import tableBilliardService from "@/services/tableBilliardService";
import { UserRole } from "@/types/auth";
import {
    ITableBilliardRequest,
    ITableBilliardResponse,
} from "@/types/tableBilliard";
import { PaginationState } from "@tanstack/react-table";
import { AxiosError } from "axios";
import React from "react";
import { TableBilliardModal } from "./TableBilliardModal";
import {
    renderTableBilliardActions,
    useTableBilliardActions,
} from "./useTableBilliardAction";

const TableListTab = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === UserRole.ADMIN;
    const isManager = user?.role === UserRole.MANAGER;

    const [keyword, setKeyword] = React.useState("");
    const [selectedBranchId, setSelectedBranchId] = React.useState<
        number | undefined
    >(undefined);
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { branches } = useBranches();
    const { managedBranchId, isLoading: isLoadingManagedBranch } =
        useManagedBranch();

    // ADMIN: selectedBranchId (undefined = tất cả), MANAGER: fix cứng chi nhánh được quản lý
    const effectiveBranchId = isAdmin ? selectedBranchId : managedBranchId;

    // ADMIN: luôn fetch (mặc định tất cả), MANAGER: chờ xác định được chi nhánh
    const shouldFetchTables = isAdmin
        ? true
        : isManager
          ? !!managedBranchId
          : true;

    const {
        tableBilliards,
        pageNumber,
        pageSize,
        totalElements,
        totalPages,
        isLoading,
        isError,
        mutate,
    } = useTableBilliards(
        {
            page: pagination.pageIndex,
            size: pagination.pageSize,
            sortBy: "createdAt",
            sortDirection: "desc",
        },
        effectiveBranchId,
        shouldFetchTables,
    );

    const { tableBilliardTypes } = useAllTableBilliardTypes();

    const { columns } = useTableBilliardActions();

    const branchOptions = React.useMemo(
        () => [
            { value: "", label: "Tất cả chi nhánh" },
            ...branches.map((branch) => ({
                value: branch.id.toString(),
                label: branch.name,
            })),
        ],
        [branches],
    );

    const selectedBranchLabel = React.useMemo(() => {
        if (!effectiveBranchId) return "Tất cả";
        return branches.find((b) => b.id === effectiveBranchId)?.name || "";
    }, [branches, effectiveBranchId]);

    const filteredTables = React.useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();
        if (!normalizedKeyword) return tableBilliards;

        return tableBilliards.filter(
            (table) =>
                table.name?.toLowerCase().includes(normalizedKeyword) ||
                table.type?.name?.toLowerCase().includes(normalizedKeyword) ||
                table.branch?.name?.toLowerCase().includes(normalizedKeyword),
        );
    }, [tableBilliards, keyword]);

    // ADMIN: luôn có thể tạo (chọn chi nhánh trong modal), MANAGER: cần xác định được chi nhánh
    const canCreateTable = isAdmin
        ? true
        : isManager
          ? !!managedBranchId
          : false;

    const {
        modalState,
        openAddModal,
        openEditModal,
        closeModal,
        handleSubmit,
        deleteState,
        openDeleteConfirm,
        handleConfirmDelete,
        closeDeleteConfirm,
        fieldErrors,
    } = useCrudActions<ITableBilliardRequest, ITableBilliardResponse, number>({
        onSuccess: mutate,
        service: {
            create: (data) => {
                const payload = {
                    ...data,
                    branchId: isManager
                        ? (managedBranchId ?? data.branchId)
                        : data.branchId,
                };
                return tableBilliardService.createTableBilliard(payload);
            },
            update: (id, data) => {
                const payload = {
                    ...data,
                    branchId: isManager
                        ? (managedBranchId ?? data.branchId)
                        : data.branchId,
                };
                return tableBilliardService.updateTableBilliard(id, payload);
            },
            remove: tableBilliardService.deleteTableBilliard,
            getId: (table) => table.id,
        },
        extractErrorMessage: (error) => {
            const axiosError = error as AxiosError<{ message?: string }>;
            return axiosError.response?.data?.message;
        },
    });

    const canEditTable = (table: ITableBilliardResponse) => {
        if (isAdmin) return true;
        if (!isManager) return false;
        return !!managedBranchId && table.branch?.id === managedBranchId;
    };

    const canDeleteTable = isAdmin;

    return (
        <Card className="min-w-0">
            <CardHeader>
                <CardTitle>Danh sách bàn theo chi nhánh</CardTitle>
            </CardHeader>
            <CardContent className="min-w-0 space-y-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3">
                        {isAdmin && (
                            <Select
                                options={branchOptions}
                                value={selectedBranchId?.toString() || ""}
                                onChange={(value) => {
                                    setSelectedBranchId(
                                        value ? Number(value) : undefined,
                                    );
                                    setPagination((p) => ({
                                        ...p,
                                        pageIndex: 0,
                                    }));
                                }}
                                placeholder="Tất cả chi nhánh"
                                className="h-10 w-full sm:w-72"
                            />
                        )}

                        {isManager && (
                            <Badge color="warning" variant="light">
                                Chi nhánh quản lý: {selectedBranchLabel}
                            </Badge>
                        )}

                        <InputSearch
                            value={keyword}
                            onChange={setKeyword}
                            placeholder="Tìm theo tên bàn, loại bàn, chi nhánh..."
                            className="w-full sm:w-80"
                        />
                    </div>

                    <Button
                        size="sm"
                        onClick={openAddModal}
                        disabled={!canCreateTable || isLoadingManagedBranch}>
                        Thêm bàn
                    </Button>
                </div>

                {isManager && !managedBranchId && !isLoadingManagedBranch && (
                    <p className="text-sm text-red-500">
                        Không xác định được chi nhánh của tài khoản quản lý.
                    </p>
                )}

                {isError ? (
                    <p className="p-4 text-center text-red-500">
                        Đã xảy ra lỗi khi lấy dữ liệu.
                    </p>
                ) : (
                    <div className="min-w-0">
                        <DataTable
                            columns={columns}
                            data={filteredTables}
                            renderActions={(table) =>
                                renderTableBilliardActions(table, {
                                    canEdit: canEditTable(table),
                                    canDelete: canDeleteTable,
                                    onEdit: canEditTable(table)
                                        ? openEditModal
                                        : undefined,
                                    onDelete: canDeleteTable
                                        ? openDeleteConfirm
                                        : undefined,
                                })
                            }
                            isLoading={isLoading || isLoadingManagedBranch}
                            manualPagination
                            pageCount={totalPages}
                            pageIndex={pageNumber}
                            pageSize={pageSize}
                            totalItems={totalElements}
                            onPaginationChange={setPagination}
                        />
                    </div>
                )}

                <TableBilliardModal
                    isOpen={modalState.isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    isSubmitting={modalState.isSubmitting}
                    initialData={modalState.editingEntity}
                    errors={fieldErrors}
                    tableTypes={tableBilliardTypes}
                    branchOptions={branchOptions.filter((o) => o.value !== "")}
                    canSelectBranch={isAdmin}
                    fixedBranchId={managedBranchId}
                />

                {deleteState.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                Xác nhận xóa
                            </h3>
                            <p className="mb-6 text-gray-600">
                                Bạn có chắc chắn muốn xóa bàn
                                <span className="font-medium">
                                    {" "}
                                    "{deleteState.entity?.name}"
                                </span>
                                ? Hành động này không thể hoàn tác.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={closeDeleteConfirm}
                                    disabled={deleteState.isDeleting}>
                                    Hủy
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={handleConfirmDelete}
                                    disabled={deleteState.isDeleting}>
                                    {deleteState.isDeleting
                                        ? "Đang xóa..."
                                        : "Xóa"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TableListTab;
