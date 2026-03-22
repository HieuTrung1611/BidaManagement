import { useEmployeePositionsByKeyword } from "@/hooks/useEmployeePosition";
import React from "react";
import { useCrudActions } from "@/hooks/useCrudActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputSearch from "@/components/common/InputSearch";
import Button from "@/components/ui/button/Button";
import { DataTable } from "@/components/ui/table/DataTable";
import { EmployeePositionModal } from "./EmployeePositionModal";
import {
    IEmployeePositionRequest,
    IEmployeePositionResponse,
} from "@/types/employeePosition";
import employeePositionService from "@/services/employeePositionService";
import { AxiosError } from "axios";
import {
    renderEmployeePositionActions,
    useEmployeePositionActions,
} from "./useEmployeePositionAction";

const EmployeePositionTab = () => {
    const [keyword, setKeyword] = React.useState("");

    const { isLoading, isError, mutate, employeePositions } =
        useEmployeePositionsByKeyword(keyword);

    const { columns, DetailDrawer } = useEmployeePositionActions();

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
        IEmployeePositionRequest,
        IEmployeePositionResponse,
        number
    >({
        onSuccess: mutate,
        service: {
            create: employeePositionService.createEmployeePosition,
            update: employeePositionService.updateEmployeePosition,
            remove: employeePositionService.deleteEmployeePositionById,
            getId: (employeePosition) => employeePosition.id,
        },
        extractErrorMessage: (error) => {
            const axiosError = error as AxiosError<{ message?: string }>;
            return axiosError.response?.data?.message;
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bảng danh sách vị trí nhân viên</CardTitle>
            </CardHeader>
            <CardContent className="">
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
                        Thêm vị trí nhân viên
                    </Button>
                </div>
                {isError ? (
                    <p className="p-4 text-center text-red-500">
                        Đã xảy ra lỗi khi lấy dữ liệu.
                    </p>
                ) : (
                    <DataTable
                        columns={columns}
                        data={employeePositions}
                        renderActions={(position) =>
                            renderEmployeePositionActions(
                                position,
                                openEditModal,
                                openDeleteConfirm,
                            )
                        }
                        manualPagination={false}
                        isLoading={isLoading}
                        isShowPagination={false}
                    />
                )}

                {/* EmployeePosition Modal */}
                <EmployeePositionModal
                    isOpen={modalState.isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    isSubmitting={modalState.isSubmitting}
                    initialData={modalState.editingEntity}
                    errors={fieldErrors}
                />

                {/* Delete Confirmation Modal */}
                {deleteState.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                Xác nhận xóa
                            </h3>
                            <p className="mb-6 text-gray-600">
                                Bạn có chắc chắn muốn xóa vị trí nhân viên{" "}
                                <span className="font-medium">
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

                {/* Detail Drawer */}
                <DetailDrawer />
            </CardContent>
        </Card>
    );
};

export default EmployeePositionTab;
