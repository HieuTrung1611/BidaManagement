"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/input/InputField";
import Checkbox from "@/components/ui/form/input/Checkbox";
import MoneyVndInput from "@/components/ui/form/input/MoneyVndInput";
import Select from "@/components/ui/form/Select";
import Button from "@/components/ui/button/Button";
import { IEquipmentRequest, IEquipmentResponse } from "@/types/equipment";
import { IBranchResponse } from "@/types/branch";

interface EquipmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: IEquipmentRequest, id?: number) => void;
    isSubmitting?: boolean;
    initialData?: IEquipmentResponse | null;
    errors?: Record<string, string>;
    branches: IBranchResponse[];
}

export const EquipmentModal: React.FC<EquipmentModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
    initialData,
    errors = {},
    branches,
}) => {
    const initialFormData = useMemo<IEquipmentRequest>(
        () => ({
            name: "",
            description: null,
            type: "STICK",
            rentalPricePerHour: 0,
            totalQuantity: 0,
            availableQuantity: 0,
            branchId: 0,
            isActive: true,
        }),
        [],
    );

    const [formData, setFormData] =
        useState<IEquipmentRequest>(initialFormData);

    const resetFormData = useCallback(() => {
        setFormData(initialFormData);
    }, [initialFormData]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name ?? "",
                description: initialData.description ?? null,
                type: initialData.type ?? "STICK",
                rentalPricePerHour: initialData.rentalPricePerHour ?? 0,
                totalQuantity: initialData.totalQuantity ?? 0,
                availableQuantity: initialData.availableQuantity ?? 0,
                branchId: initialData.branchId ?? 0,
                isActive: initialData.isActive ?? true,
            });
            return;
        }

        resetFormData();
    }, [initialData, isOpen, resetFormData]);

    const equipmentTypeOptions = useMemo(
        () => [
            { value: "STICK", label: "Cơ" },
            { value: "CHALK", label: "Phấn" },
            { value: "GLOVES", label: "Găng tay" },
            { value: "BRIDGE", label: "Chống" },
            { value: "OTHER", label: "Khác" },
        ],
        [],
    );

    const branchOptions = useMemo(
        () =>
            branches.map((branch) => ({
                value: branch.id.toString(),
                label: branch.name,
            })),
        [branches],
    );

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
        setFormData((prev) => ({
            ...prev,
            type: value as IEquipmentRequest["type"],
        }));
    };

    const handleBranchChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            branchId: Number(value),
        }));
    };

    const handleRentalPriceChange = (value: number | null) => {
        setFormData((prev) => ({
            ...prev,
            rentalPricePerHour: value ?? 0,
        }));
    };

    const handleTotalQuantityChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newTotal = Number(e.target.value) || 0;
        setFormData((prev) => ({
            ...prev,
            totalQuantity: newTotal,
            // Ensure available doesn't exceed total
            availableQuantity: Math.min(prev.availableQuantity, newTotal),
        }));
    };

    const handleAvailableQuantityChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newAvailable = Number(e.target.value) || 0;
        setFormData((prev) => ({
            ...prev,
            availableQuantity: Math.min(newAvailable, prev.totalQuantity),
        }));
    };

    const handleActiveChange = (checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            isActive: checked,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData, initialData?.id);
    };

    const handleClose = () => {
        resetFormData();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    {initialData ? "Chỉnh sửa thiết bị" : "Thêm thiết bị mới"}
                </h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Nhập thông tin thiết bị cho thuê (cơ, phấn, găng tay...).
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="name">
                            Tên thiết bị <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nhập tên thiết bị"
                            error={!!errors.name}
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="type">
                            Loại <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            options={equipmentTypeOptions}
                            value={formData.type}
                            onChange={handleTypeChange}
                            placeholder="Chọn loại"
                            error={!!errors.type}
                        />
                        {errors.type && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.type}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="rentalPricePerHour">
                            Giá thuê/giờ <span className="text-red-500">*</span>
                        </Label>
                        <MoneyVndInput
                            id="rentalPricePerHour"
                            value={formData.rentalPricePerHour}
                            onChange={handleRentalPriceChange}
                            error={!!errors.rentalPricePerHour}
                        />
                        {errors.rentalPricePerHour && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.rentalPricePerHour}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="totalQuantity">
                            Tổng số lượng{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="totalQuantity"
                            name="totalQuantity"
                            type="number"
                            min="0"
                            value={formData.totalQuantity}
                            onChange={handleTotalQuantityChange}
                            placeholder="0"
                            error={!!errors.totalQuantity}
                        />
                        {errors.totalQuantity && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.totalQuantity}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="availableQuantity">
                            Số lượng còn trống{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="availableQuantity"
                            name="availableQuantity"
                            type="number"
                            min="0"
                            max={formData.totalQuantity}
                            value={formData.availableQuantity}
                            onChange={handleAvailableQuantityChange}
                            placeholder="0"
                            error={!!errors.availableQuantity}
                        />
                        {errors.availableQuantity && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.availableQuantity}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Tối đa: {formData.totalQuantity}
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="branchId">
                            Chi nhánh <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            options={branchOptions}
                            value={
                                formData.branchId
                                    ? formData.branchId.toString()
                                    : ""
                            }
                            onChange={handleBranchChange}
                            placeholder="Chọn chi nhánh"
                            error={!!errors.branchId}
                        />
                        {errors.branchId && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.branchId}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description ?? ""}
                            onChange={handleChange}
                            placeholder="Nhập mô tả thiết bị"
                            rows={3}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <Checkbox
                            id="isActive"
                            checked={formData.isActive}
                            onChange={handleActiveChange}
                            label="Đang hoạt động"
                        />
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
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting
                            ? "Đang xử lý..."
                            : initialData
                              ? "Cập nhật"
                              : "Thêm mới"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
