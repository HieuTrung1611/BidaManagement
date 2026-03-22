import React from "react";
import { AxiosError } from "axios";
import { PaginationState } from "@tanstack/react-table";

import { useEmployeeColumns, renderEmployeeActions } from "./useEmployeeAction";
import { EmployeeModal } from "./EmployeeModal";
import { useEmployees } from "@/hooks/useEmployee";
import { useEmployeePositionsByKeyword } from "@/hooks/useEmployeePosition";
import { useCrudActions } from "@/hooks/useCrudActions";
import employeeService from "@/services/employeeService";
import { IEmployeeRequest, IEmployeeResponse } from "@/types/employee";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputSearch from "@/components/common/InputSearch";
import Button from "@/components/ui/button/Button";
import { DataTable } from "@/components/ui/table/DataTable";

const EmployeeListTab = () => {
    const [keyword, setKeyword] = React.useState("");
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    React.useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [keyword]);

    const { employeePositions } = useEmployeePositionsByKeyword("");

    const {
        employees,
        pageNumber,
        pageSize,
        totalElements,
        totalPages,
        isLoading,
        isError,
        mutate,
    } = useEmployees(keyword, {
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sortBy: "createdAt",
        sortDirection: "asc",
    });

    const { columns, DetailDrawer } = useEmployeeColumns();

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
    } = useCrudActions<IEmployeeRequest, IEmployeeResponse, number>({
        onSuccess: mutate,
        service: {
            create: employeeService.createEmployee,
            update: employeeService.updateEmployee,
            remove: employeeService.deleteEmployee,
            getId: (employee) => employee.id,
        },
        extractErrorMessage: (error) => {
            const axiosError = error as AxiosError<{ message?: string }>;
            return axiosError.response?.data?.message;
        },
    });

    return (
        <Card className="min-w-0">
            <CardHeader>
                <CardTitle>Bảng danh sách nhân viên</CardTitle>
            </CardHeader>
            <CardContent className="min-w-0">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between min-w-0">
                    <InputSearch
                        value={keyword}
                        onChange={setKeyword}
                        placeholder="Nhập từ khóa tìm kiếm..."
                        className="flex-1 sm:flex-initial sm:w-80 min-w-0"
                    />
                    <Button
                        size="sm"
                        className="sm:ml-auto shrink-0"
                        onClick={openAddModal}>
                        Thêm nhân viên
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
                            data={employees}
                            renderActions={(employee) =>
                                renderEmployeeActions(
                                    employee,
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

                <EmployeeModal
                    isOpen={modalState.isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    isSubmitting={modalState.isSubmitting}
                    initialData={modalState.editingEntity}
                    errors={fieldErrors}
                    employeePositions={employeePositions}
                />

                {deleteState.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                Xác nhận xóa
                            </h3>
                            <p className="mb-6 text-gray-600">
                                Bạn có chắc chắn muốn xóa nhân viên{" "}
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

export default EmployeeListTab;
