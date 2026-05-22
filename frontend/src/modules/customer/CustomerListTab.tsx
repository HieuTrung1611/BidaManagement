"use client";

import React from "react";
import { AxiosError } from "axios";
import { PaginationState } from "@tanstack/react-table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import Select from "@/components/ui/form/Select";
import InputSearch from "@/components/common/InputSearch";
import { DataTable } from "@/components/ui/table/DataTable";

import { useAuth } from "@/context/AuthContext";
import { useBranches } from "@/hooks/useBranch";
import { useCustomers } from "@/hooks/useCustomer";
import { useCrudActions } from "@/hooks/useCrudActions";
import customerService from "@/services/customerService";
import { UserRole } from "@/types/auth";
import { ICustomerRequest, ICustomerResponse } from "@/types/customer";
import { CustomerModal } from "./CustomerModal";
import { useCustomerColumns, renderCustomerActions } from "./useCustomerAction";

const CustomerListTab: React.FC = () => {
    const { user } = useAuth();

    const [keyword, setKeyword] = React.useState("");
    const [selectedBranchId, setSelectedBranchId] = React.useState<
        number | undefined
    >(undefined);
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const isAdminLike =
        user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER;

    React.useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [keyword, selectedBranchId]);

    const { branches } = useBranches();
    const {
        customers,
        pageNumber,
        pageSize,
        totalElements,
        totalPages,
        isLoading,
        mutate,
    } = useCustomers(keyword, selectedBranchId, {
        page: pagination.pageIndex,
        size: pagination.pageSize,
    });

    const { columns, DetailDrawer } = useCustomerColumns();

    const {
        modalState,
        openAddModal,
        openEditModal,
        closeModal,
        handleSubmit,
        fieldErrors,
    } = useCrudActions<ICustomerRequest, ICustomerResponse, number>({
        onSuccess: mutate,
        service: {
            create: customerService.createCustomer,
            update: customerService.updateCustomer,
            remove: customerService.deleteCustomer,
            getId: (customer) => customer.id,
        },
        extractErrorMessage: (error) => {
            const axiosError = error as AxiosError<{ message?: string }>;
            return axiosError.response?.data?.message;
        },
    });

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

    const handleEdit = (customer: ICustomerResponse) => {
        openEditModal(customer);
    };

    const handleDeactivate = async (customer: ICustomerResponse) => {
        if (
            !confirm(
                `Bạn có chắc muốn vô hiệu hóa khách hàng "${customer.name}"?`,
            )
        )
            return;

        try {
            await customerService.deactivateCustomer(customer.id);
            await mutate();
        } catch (error: unknown) {
            console.error("Error deactivating customer:", error);
        }
    };

    const handleReactivate = async (customer: ICustomerResponse) => {
        if (
            !confirm(
                `Bạn có chắc muốn kích hoạt lại khách hàng "${customer.name}"?`,
            )
        )
            return;

        try {
            await customerService.reactivateCustomer(customer.id);
            await mutate();
        } catch (error: unknown) {
            console.error("Error reactivating customer:", error);
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
            <Card className="min-w-0">
                <CardHeader>
                    <CardTitle>Danh sách khách hàng</CardTitle>
                </CardHeader>
                <CardContent className="min-w-0">
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between min-w-0">
                        <InputSearch
                            value={keyword}
                            onChange={setKeyword}
                            placeholder="Tên, email hoặc SĐT..."
                            className="flex-1 sm:flex-initial sm:w-80 min-w-0"
                        />
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
                        <Button
                            size="sm"
                            className="sm:ml-auto shrink-0"
                            onClick={openAddModal}>
                            Thêm khách hàng
                        </Button>
                    </div>

                    <div className="min-w-0">
                        <DataTable
                            columns={columns}
                            data={customers}
                            renderActions={(customer) =>
                                renderCustomerActions(
                                    customer,
                                    handleEdit,
                                    handleDeactivate,
                                    handleReactivate,
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
                </CardContent>
            </Card>

            <CustomerModal
                isOpen={modalState.isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                onSuccess={mutate}
                isSubmitting={modalState.isSubmitting}
                initialData={modalState.editingEntity}
                errors={fieldErrors}
            />

            <DetailDrawer />
        </div>
    );
};

export default CustomerListTab;
