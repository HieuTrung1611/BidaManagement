"use client";

import React from "react";
import { PaginationState } from "@tanstack/react-table";
import { AxiosError } from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import { DataTable } from "@/components/ui/table/DataTable";
import { useCrudActions } from "@/hooks/useCrudActions";
import { useTableBilliardTypes } from "@/hooks/useTableBilliardType";
import tableBilliardTypeService from "@/services/tableBilliardTypeService";
import {
    ITableBilliardTypeRequest,
    ITableBilliardTypeResponse,
} from "@/types/tableBilliardType";
import { TableTypeModal } from "./TableTypeModal";
import {
    renderTableTypeActions,
    useTableTypeActions,
} from "./useTableTypeAction";

const TableTypeTab = () => {
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const {
        tableBilliardTypes,
        pageNumber,
        pageSize,
        totalElements,
        totalPages,
        isLoading,
        isError,
        mutate,
    } = useTableBilliardTypes({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sortBy: "createdAt",
        sortDirection: "desc",
    });

    const { columns } = useTableTypeActions();

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
    } = useCrudActions<
        ITableBilliardTypeRequest,
        ITableBilliardTypeResponse,
        number
    >({
        onSuccess: mutate,
        service: {
            create: tableBilliardTypeService.createTableBilliardType,
            update: tableBilliardTypeService.updateTableBilliardType,
            remove: tableBilliardTypeService.deleteTableBilliardType,
            getId: (tableType) => tableType.id,
        },
        extractErrorMessage: (error) => {
            const axiosError = error as AxiosError<{ message?: string }>;
            return axiosError.response?.data?.message;
        },
    });

    return (
        <Card className="min-w-0">
            <CardHeader>
                <CardTitle>Bảng danh sách loại bàn</CardTitle>
            </CardHeader>
            <CardContent className="min-w-0">
                <div className="mb-4 flex justify-end">
                    <Button size="sm" onClick={openAddModal}>
                        Thêm loại bàn
                    </Button>
                </div>

                {isError ? (
                    <p className="p-4 text-center text-red-500">
                        Đã xảy ra lỗi khi lấy dữ liệu.
                    </p>
                ) : (
                    <div className="min-w-0">
                        <DataTable
                            columns={columns}
                            data={tableBilliardTypes}
                            renderActions={(tableType) =>
                                renderTableTypeActions(
                                    tableType,
                                    openEditModal,
                                    openDeleteConfirm,
                                )
                            }
                            isLoading={isLoading}
                            manualPagination
                            pageCount={totalPages}
                            pageIndex={pageNumber}
                            pageSize={pageSize}
                            totalItems={totalElements}
                            onPaginationChange={setPagination}
                        />
                    </div>
                )}

                <TableTypeModal
                    isOpen={modalState.isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    isSubmitting={modalState.isSubmitting}
                    initialData={modalState.editingEntity}
                    errors={fieldErrors}
                />

                {deleteState.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                Xác nhận xóa
                            </h3>
                            <p className="mb-6 text-gray-600">
                                Bạn có chắc chắn muốn xóa loại bàn
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

export default TableTypeTab;
