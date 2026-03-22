"use client";

import React from "react";
import { useAccountsByKeyword } from "@/hooks/useAccount";
import { useCrudActions } from "@/hooks/useCrudActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputSearch from "@/components/common/InputSearch";
import Button from "@/components/ui/button/Button";
import { DataTable } from "@/components/ui/table/DataTable";
import { AccountModal } from "./AccountModal";
import { IAccountRequest, IAccountResponse } from "@/types/account";
import accountService from "@/services/accountService";
import { AxiosError } from "axios";
import { renderAccountActions, useAccountActions } from "./useAccountActions";
import { useToast } from "@/context/ToastContext";

const AccountListTabs = () => {
    const [keyword, setKeyword] = React.useState("");
    const { success, error } = useToast();

    const { isLoading, isError, mutate, accounts } =
        useAccountsByKeyword(keyword);

    const { columns, DetailDrawer } = useAccountActions();

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
    } = useCrudActions<IAccountRequest, IAccountResponse, number>({
        onSuccess: mutate,
        service: {
            create: accountService.createUser,
            update: accountService.updateUser,
            remove: accountService.deleteUser,
            getId: (account) => account.id,
        },
        extractErrorMessage: (error) => {
            const axiosError = error as AxiosError<{ message?: string }>;
            return axiosError.response?.data?.message;
        },
    });

    const handleToggleActivation = async (account: IAccountResponse) => {
        try {
            await accountService.toogleAccountActivation(account.id);
            if (account.isActive) {
                success("Tài khoản đã bị vô hiệu hóa");
            } else {
                success("Tài khoản đã được kích hoạt");
            }
            mutate();
        } catch (err: any) {
            const axiosError = err as AxiosError<{ message?: string }>;
            const errorMessage =
                axiosError.response?.data?.message || "Có lỗi xảy ra";
            error("Không thể thay đổi trạng thái tài khoản", errorMessage);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bảng danh sách tài khoản</CardTitle>
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
                        Thêm tài khoản
                    </Button>
                </div>
                {isError ? (
                    <p className="p-4 text-center text-red-500">
                        Đã xảy ra lỗi khi lấy dữ liệu.
                    </p>
                ) : (
                    <DataTable
                        columns={columns}
                        data={accounts}
                        renderActions={(account) =>
                            renderAccountActions(
                                account,
                                openEditModal,
                                openDeleteConfirm,
                                handleToggleActivation,
                            )
                        }
                        manualPagination={false}
                        isLoading={isLoading}
                        isShowPagination={false}
                    />
                )}

                {/* Account Modal */}
                <AccountModal
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
                        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                            <h3 className="text-lg font-semibold">
                                Xác nhận xóa
                            </h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Bạn có chắc chắn muốn xóa tài khoản "
                                {deleteState.entity?.username}" không? Hành động
                                này không thể hoàn tác.
                            </p>
                            <div className="mt-4 flex justify-end gap-2">
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

                {/* Detail Drawer */}
                <DetailDrawer />
            </CardContent>
        </Card>
    );
};

export default AccountListTabs;
