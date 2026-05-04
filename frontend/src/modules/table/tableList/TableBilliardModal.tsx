"use client";

import Button from "@/components/ui/button/Button";
import Select from "@/components/ui/form/Select";
import Input from "@/components/ui/form/input/InputField";
import MoneyVndInput from "@/components/ui/form/input/MoneyVndInput";
import Label from "@/components/ui/form/Label";
import { Modal } from "@/components/ui/modal";
import { ITableBilliardRequest, ITableBilliardResponse } from "@/types/tableBilliard";
import { ITableBilliardTypeResponse } from "@/types/tableBilliardType";
import { FormEvent, useEffect, useMemo, useState } from "react";

interface TableBilliardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ITableBilliardRequest, id?: number) => void;
    isSubmitting?: boolean;
    initialData?: ITableBilliardResponse | null;
    errors?: Record<string, string>;
    tableTypes: ITableBilliardTypeResponse[];
    branchOptions: { value: string; label: string }[];
    canSelectBranch: boolean;
    fixedBranchId?: number;
}

export const TableBilliardModal: React.FC<TableBilliardModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
    initialData,
    errors = {},
    tableTypes,
    branchOptions,
    canSelectBranch,
    fixedBranchId,
}) => {
    const initialFormData: ITableBilliardRequest = {
        name: "",
        description: "",
        typeId: null,
        zoneId: 1,
        pricePerHour: 0,
        branchId: fixedBranchId ?? null,
    };

    const [formData, setFormData] = useState<ITableBilliardRequest>(initialFormData);

    const tableTypeOptions = useMemo(
        () =>
            tableTypes
                .map((tableType) => ({
                    id: Number(tableType?.id),
                    name: tableType.name,
                }))
                .filter((tableType) => Number.isFinite(tableType.id))
                .map((tableType) => ({
                    value: String(tableType.id),
                    label: tableType.name,
                })),
        [tableTypes],
    );

    const resetFormData = () => {
        setFormData({
            ...initialFormData,
            branchId: fixedBranchId ?? null,
        });
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name ?? "",
                description: initialData.description ?? "",
                typeId: initialData.type?.id ?? null,
                zoneId: 1,
                pricePerHour:
                    initialData.pricePerHour ?? initialData.type?.pricePerHour ?? 0,
                branchId: initialData.branch?.id ?? fixedBranchId ?? null,
            });
        } else {
            resetFormData();
        }
    }, [initialData, isOpen, fixedBranchId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTypeChange = (value: string) => {
        const typeId = value ? Number(value) : null;

        setFormData((prev) => {
            const selectedType = tableTypes.find(
                (item) => Number(item?.id) === typeId,
            );

            return {
                ...prev,
                typeId,
                pricePerHour:
                    selectedType?.pricePerHour !== undefined
                        ? selectedType.pricePerHour
                        : prev.pricePerHour,
            };
        });
    };

    const handleBranchChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            branchId: value ? Number(value) : null,
        }));
    };

    const handlePricePerHourChange = (value: number | null) => {
        setFormData((prev) => ({
            ...prev,
            pricePerHour: value ?? 0,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const { pricePerHour: _ignored, ...rest } = formData;
        const payload: ITableBilliardRequest = {
            ...rest,
            branchId: canSelectBranch ? formData.branchId : fixedBranchId ?? formData.branchId,
            zoneId: formData.zoneId ?? 1,
        };

        onSubmit(payload, initialData?.id);
    };

    const handleClose = () => {
        resetFormData();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            className="max-w-2xl p-6 overflow-y-auto">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    {initialData ? "Chỉnh sửa bàn" : "Thêm bàn mới"}
                </h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Nhập thông tin bàn bi-a.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="name">
                            Tên bàn <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nhập tên bàn"
                            error={!!errors.name}
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="typeId">
                            Loại bàn <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            options={tableTypeOptions}
                            value={formData.typeId ? formData.typeId.toString() : ""}
                            onChange={handleTypeChange}
                            placeholder="Chọn loại bàn"
                            className={`h-10 w-full ${errors.typeId ? "border-red-500" : ""}`}
                        />
                        {errors.typeId && (
                            <p className="mt-1 text-xs text-red-500">{errors.typeId}</p>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="description">Mô tả</Label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Nhập mô tả"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900"
                    />
                    {errors.description && (
                        <p className="mt-1 text-xs text-red-500">{errors.description}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="pricePerHour">Giá theo giờ</Label>
                        <MoneyVndInput
                            id="pricePerHour"
                            name="pricePerHour"
                            value={formData.pricePerHour}
                            onValueChange={handlePricePerHourChange}
                            placeholder="Lấy từ loại bàn"
                            disabled
                        />
                        <p className="mt-1 text-xs text-neutral-400">Giá được lấy từ loại bàn, không thể chỉnh sửa.</p>
                    </div>

                    <div>
                        <Label htmlFor="branchId">
                            Chi nhánh <span className="text-red-500">*</span>
                        </Label>
                        {canSelectBranch ? (
                            <Select
                                options={branchOptions}
                                value={formData.branchId ? formData.branchId.toString() : ""}
                                onChange={handleBranchChange}
                                placeholder="Chọn chi nhánh"
                                className={`h-10 w-full ${errors.branchId ? "border-red-500" : ""}`}
                            />
                        ) : (
                            <Input
                                id="branchName"
                                name="branchName"
                                type="text"
                                value={
                                    branchOptions.find(
                                        (item) =>
                                            Number(item.value) ===
                                            (fixedBranchId ?? formData.branchId),
                                    )?.label || ""
                                }
                                disabled
                            />
                        )}
                        {errors.branchId && (
                            <p className="mt-1 text-xs text-red-500">{errors.branchId}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}>
                        {isSubmitting
                            ? "Đang xử lý..."
                            : initialData
                              ? "Cập nhật"
                              : "Thêm bàn"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
