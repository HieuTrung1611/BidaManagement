import React from "react";
import { AxiosError } from "axios";
import { PaginationState } from "@tanstack/react-table";

import {
    useEquipmentColumns,
    renderEquipmentActions,
} from "./useEquipmentAction";
import { EquipmentModal } from "./EquipmentModal";
import { useEquipments } from "@/hooks/useEquipment";
import { useCrudActions } from "@/hooks/useCrudActions";
import equipmentService from "@/services/equipmentService";
import {
    IEquipmentRequest,
    IEquipmentResponse,
    EquipmentType,
} from "@/types/equipment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputSearch from "@/components/common/InputSearch";
import Button from "@/components/ui/button/Button";
import { DataTable } from "@/components/ui/table/DataTable";
import { useBranches } from "@/hooks/useBranch";
import Select from "@/components/ui/form/Select";

interface EquipmentListTabProps {
    branchId?: number;
}

const EquipmentListTab: React.FC<EquipmentListTabProps> = ({ branchId }) => {
    const [keyword, setKeyword] = React.useState("");
    const [selectedType, setSelectedType] =
        React.useState<EquipmentType | null>(null);
    const [selectedBranchId, setSelectedBranchId] = React.useState<
        number | undefined
    >(undefined);
    const [isActiveFilter, setIsActiveFilter] = React.useState<boolean | null>(
        null,
    );
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const isBranchFixed = branchId !== undefined;
    const effectiveBranchId = isBranchFixed ? branchId : selectedBranchId;

    React.useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [keyword, selectedType, effectiveBranchId, isActiveFilter]);

    const { branches } = useBranches();

    const branchFilterOptions = React.useMemo(
        () => [
            { value: "", label: "Tất cả chi nhánh" },
            ...branches.map((branch) => ({
                value: branch.id.toString(),
                label: branch.name,
            })),
        ],
        [branches],
    );

    const typeFilterOptions = React.useMemo(
        () => [
            { value: "", label: "Tất cả loại" },
            { value: "STICK", label: "Cơ" },
            { value: "CHALK", label: "Phấn" },
            { value: "GLOVES", label: "Găng tay" },
            { value: "BRIDGE", label: "Chống" },
            { value: "OTHER", label: "Khác" },
        ],
        [],
    );

    const statusFilterOptions = React.useMemo(
        () => [
            { value: "", label: "Tất cả trạng thái" },
            { value: "true", label: "Đang hoạt động" },
            { value: "false", label: "Ngưng cho thuê" },
        ],
        [],
    );

    const {
        equipments,
        pageNumber,
        pageSize,
        totalElements,
        totalPages,
        isLoading,
        isError,
        mutate,
    } = useEquipments(
        keyword,
        selectedType,
        isActiveFilter,
        {
            page: pagination.pageIndex,
            size: pagination.pageSize,
            sortBy: "createdAt",
            sortDirection: "desc",
        },
        effectiveBranchId,
    );

    const { columns } = useEquipmentColumns();

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
    } = useCrudActions<IEquipmentRequest, IEquipmentResponse, number>({
        onSuccess: mutate,
        service: {
            create: equipmentService.createEquipment,
            update: equipmentService.updateEquipment,
            remove: equipmentService.deleteEquipment,
            getId: (equipment) => equipment.id,
        },
        extractErrorMessage: (error) => {
            const axiosError = error as AxiosError<{ message?: string }>;
            return axiosError.response?.data?.message;
        },
    });

    return (
        <Card className="min-w-0">
            <CardHeader>
                <CardTitle>Quản lý thiết bị cho thuê</CardTitle>
            </CardHeader>
            <CardContent className="min-w-0">
                <div className="mb-4 flex flex-col gap-4 min-w-0">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <InputSearch
                            value={keyword}
                            onChange={setKeyword}
                            placeholder="Tìm kiếm thiết bị..."
                            className="flex-1 min-w-0"
                        />
                        <Button
                            size="sm"
                            className="shrink-0 sm:ml-auto"
                            onClick={openAddModal}>
                            Thêm thiết bị
                        </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Select
                            options={typeFilterOptions}
                            value={selectedType ?? ""}
                            onChange={(value) =>
                                setSelectedType(
                                    value ? (value as EquipmentType) : null,
                                )
                            }
                            placeholder="Lọc theo loại"
                            className="h-10 w-full sm:w-48"
                        />
                        {!isBranchFixed && (
                            <Select
                                options={branchFilterOptions}
                                value={
                                    selectedBranchId
                                        ? selectedBranchId.toString()
                                        : ""
                                }
                                onChange={(value) =>
                                    setSelectedBranchId(
                                        value ? Number(value) : undefined,
                                    )
                                }
                                placeholder="Lọc theo chi nhánh"
                                className="h-10 w-full sm:w-56"
                            />
                        )}
                        <Select
                            options={statusFilterOptions}
                            value={
                                isActiveFilter === null
                                    ? ""
                                    : isActiveFilter.toString()
                            }
                            onChange={(value) =>
                                setIsActiveFilter(
                                    value === "" ? null : value === "true",
                                )
                            }
                            placeholder="Lọc theo trạng thái"
                            className="h-10 w-full sm:w-56"
                        />
                    </div>
                </div>

                {isError ? (
                    <p className="p-4 text-center text-red-500">
                        Đã xảy ra lỗi khi lấy dữ liệu.
                    </p>
                ) : (
                    <div className="min-w-0">
                        <DataTable
                            columns={columns}
                            data={equipments}
                            renderActions={(equipment) =>
                                renderEquipmentActions(
                                    equipment,
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

                <EquipmentModal
                    isOpen={modalState.isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    isSubmitting={modalState.isSubmitting}
                    initialData={modalState.editingEntity}
                    errors={fieldErrors}
                    branches={branches}
                />

                {deleteState.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                Xác nhận xóa
                            </h3>
                            <p className="mb-6 text-gray-600">
                                Bạn có chắc chắn muốn xóa thiết bị{" "}
                                <span className="font-medium">
                                    &quot;{deleteState.entity?.name}&quot;
                                </span>
                                ? Hành động này không thể hoàn tác.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={closeDeleteConfirm}
                                    disabled={deleteState.isDeleting}>
                                    Hủy
                                </Button>
                                <Button
                                    variant="danger"
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

export default EquipmentListTab;
