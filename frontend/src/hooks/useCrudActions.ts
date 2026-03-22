import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { ApiResponse } from "@/types/base";

interface ModalState<TEntity> {
    isModalOpen: boolean;
    isSubmitting: boolean;
    editingEntity: TEntity | null;
}

interface DeleteState<TEntity> {
    isOpen: boolean;
    isDeleting: boolean;
    entity: TEntity | null;
}

interface CrudServiceAdapter<TRequest, TEntity, TId extends number> {
    create: (data: TRequest) => Promise<ApiResponse<unknown>>;
    update: (id: TId, data: TRequest) => Promise<ApiResponse<unknown>>;
    remove: (id: TId) => Promise<ApiResponse<unknown>>;
    getId: (entity: TEntity) => TId;
}

interface CrudMessages {
    createSuccess?: string;
    updateSuccess?: string;
    deleteSuccess?: string;
    submitErrorDefault?: string;
    deleteErrorDefault?: string;
    submitActionError?: string;
    deleteActionError?: string;
}

interface UseCrudActionsOptions<TRequest, TEntity, TId extends number> {
    onSuccess: () => void;
    service: CrudServiceAdapter<TRequest, TEntity, TId>;
    messages?: CrudMessages;
    extractErrorMessage?: (error: unknown) => string | undefined;
}

export const useCrudActions = <TRequest, TEntity, TId extends number>({
    onSuccess,
    service,
    messages,
    extractErrorMessage,
}: UseCrudActionsOptions<TRequest, TEntity, TId>) => {
    const toast = useToast();

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [modalState, setModalState] = useState<ModalState<TEntity>>({
        isModalOpen: false,
        isSubmitting: false,
        editingEntity: null,
    });

    const [deleteState, setDeleteState] = useState<DeleteState<TEntity>>({
        isOpen: false,
        isDeleting: false,
        entity: null,
    });

    const handleSubmit = async (data: TRequest, id?: TId) => {
        try {
            setModalState((prev) => ({ ...prev, isSubmitting: true }));

            const editingEntity = modalState.editingEntity;
            const resolvedId =
                id ??
                (editingEntity ? service.getId(editingEntity) : undefined);
            const isEditMode =
                Boolean(editingEntity) &&
                resolvedId !== undefined &&
                resolvedId !== null;

            const response = isEditMode
                ? await service.update(resolvedId as TId, data)
                : await service.create(data);

            if (response.success) {
                const successMessage =
                    response.message ||
                    (isEditMode
                        ? messages?.updateSuccess
                        : messages?.createSuccess) ||
                    "Xử lý thành công";
                toast.success("Thành công", successMessage);
                setFieldErrors({});
                closeModal();
                onSuccess();
                return;
            }

            setFieldErrors(response.errors || {});
            toast.error(
                messages?.submitActionError || "Lỗi",
                response.message ||
                    messages?.submitErrorDefault ||
                    "Không thể xử lý yêu cầu",
            );
        } catch (error: unknown) {
            const errorMessage = extractErrorMessage?.(error);
            toast.error(
                messages?.submitActionError || "Lỗi",
                errorMessage ||
                    messages?.submitErrorDefault ||
                    "Đã xảy ra lỗi khi xử lý yêu cầu",
            );
        } finally {
            setModalState((prev) => ({ ...prev, isSubmitting: false }));
        }
    };

    const openAddModal = () => {
        setFieldErrors({});
        setModalState({
            isModalOpen: true,
            isSubmitting: false,
            editingEntity: null,
        });
    };

    const openEditModal = (entity: TEntity) => {
        setFieldErrors({});
        setModalState({
            isModalOpen: true,
            isSubmitting: false,
            editingEntity: entity,
        });
    };

    const closeModal = () => {
        setFieldErrors({});
        setModalState({
            isModalOpen: false,
            isSubmitting: false,
            editingEntity: null,
        });
    };

    const openDeleteConfirm = (entity: TEntity) => {
        setDeleteState({
            isOpen: true,
            isDeleting: false,
            entity,
        });
    };

    const closeDeleteConfirm = () => {
        setDeleteState({
            isOpen: false,
            isDeleting: false,
            entity: null,
        });
    };

    const handleConfirmDelete = async () => {
        if (!deleteState.entity) return;

        try {
            setDeleteState((prev) => ({ ...prev, isDeleting: true }));
            const response = await service.remove(
                service.getId(deleteState.entity),
            );

            if (response.success) {
                toast.success(
                    "Thành công",
                    response.message ||
                        messages?.deleteSuccess ||
                        "Xóa thành công",
                );
                closeDeleteConfirm();
                onSuccess();
                return;
            }

            toast.error(
                messages?.deleteActionError || "Lỗi",
                response.message ||
                    messages?.deleteErrorDefault ||
                    "Không thể xóa dữ liệu",
            );
        } catch (error: unknown) {
            const errorMessage = extractErrorMessage?.(error);
            toast.error(
                messages?.deleteActionError || "Lỗi",
                errorMessage ||
                    messages?.deleteErrorDefault ||
                    "Đã xảy ra lỗi khi xóa dữ liệu",
            );
        } finally {
            setDeleteState((prev) => ({ ...prev, isDeleting: false }));
        }
    };

    return {
        modalState,
        deleteState,
        fieldErrors,
        openAddModal,
        openEditModal,
        closeModal,
        handleSubmit,
        openDeleteConfirm,
        closeDeleteConfirm,
        handleConfirmDelete,
    };
};
