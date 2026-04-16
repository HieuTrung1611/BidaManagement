import React from "react";
import { AxiosError } from "axios";

import { useShifts } from "@/hooks/useShift";
import { useCrudActions } from "@/hooks/useCrudActions";
import shiftService from "@/services/shiftService";
import { IShiftRequest, IShiftResponse } from "@/types/shift";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputSearch from "@/components/common/InputSearch";
import Button from "@/components/ui/button/Button";
import { DataTable } from "@/components/ui/table/DataTable";
import { EmployeeShiftModal } from "./EmployeeShiftModal";
import {
    renderEmployeeShiftActions,
    useEmployeeShiftActions,
} from "./useEmployeeShiftAction";

const EmployeeShiftTab = () => {
    const [keyword, setKeyword] = React.useState("");

    const { shifts, isLoading, isError, mutate } = useShifts({
        page: 0,
        size: 200,
        sortBy: "id",
        sortDirection: "asc",
    });

    const filteredShifts = React.useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();
        if (!normalizedKeyword) return shifts;

        return shifts.filter((shift) =>
            [shift.name, shift.code, shift.description]
                .filter(Boolean)
                .some((value) =>
                    value.toLowerCase().includes(normalizedKeyword),
                ),
        );
    }, [shifts, keyword]);

    const { columns, DetailDrawer } = useEmployeeShiftActions();

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
    } = useCrudActions<IShiftRequest, IShiftResponse, number>({
        onSuccess: mutate,
        service: {
            create: shiftService.createShift,
            update: shiftService.updateShift,
            remove: shiftService.deleteShiftById,
            getId: (shift) => shift.id,
        },
        extractErrorMessage: (error) => {
            const axiosError = error as AxiosError<{ message?: string }>;
            return axiosError.response?.data?.message;
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bảng danh sách ca làm việc</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <InputSearch
                        value={keyword}
                        onChange={setKeyword}
                        placeholder="Nhập từ khóa tìm kiếm..."
                        className="w-full sm:w-80"
                    />
                    <Button
                        size="sm"
                        className="sm:ml-auto"
                        onClick={openAddModal}>
                        Thêm ca làm việc
                    </Button>
                </div>

                {isError ? (
                    <p className="p-4 text-center text-red-500">
                        Đã xảy ra lỗi khi lấy dữ liệu.
                    </p>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredShifts}
                        renderActions={(shift) =>
                            renderEmployeeShiftActions(
                                shift,
                                openEditModal,
                                openDeleteConfirm,
                            )
                        }
                        manualPagination={false}
                        isLoading={isLoading}
                        isShowPagination={false}
                    />
                )}

                <EmployeeShiftModal
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
                                Bạn có chắc chắn muốn xóa ca làm việc{" "}
                                <span className="font-medium">
                                    &quot;{deleteState.entity?.name}&quot;
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

                <DetailDrawer />
            </CardContent>
        </Card>
    );
};

export default EmployeeShiftTab;
