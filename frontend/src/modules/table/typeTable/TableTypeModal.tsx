"use client";

import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/input/InputField";
import MoneyVndInput from "@/components/ui/form/input/MoneyVndInput";
import Label from "@/components/ui/form/Label";
import { Modal } from "@/components/ui/modal";
import {
    ITableBilliardTypeRequest,
    ITableBilliardTypeResponse,
} from "@/types/tableBilliardType";
import { FormEvent, useEffect, useState } from "react";

interface TableTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ITableBilliardTypeRequest, id?: number) => void;
    isSubmitting?: boolean;
    initialData?: ITableBilliardTypeResponse | null;
    errors?: Record<string, string>;
}

export const TableTypeModal: React.FC<TableTypeModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
    initialData,
    errors = {},
}) => {
    const initialFormData: ITableBilliardTypeRequest = {
        name: "",
        description: "",
        costPrice: 0,
        pricePerHour: 0,
        supplier: "",
        supplierPhone: "",
    };

    const [formData, setFormData] =
        useState<ITableBilliardTypeRequest>(initialFormData);

    const resetFormData = () => {
        setFormData(initialFormData);
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name ?? "",
                description: initialData.description ?? "",
                costPrice: initialData.costPrice ?? 0,
                pricePerHour: initialData.pricePerHour ?? 0,
                supplier: initialData.supplier ?? "",
                supplierPhone: initialData.supplierPhone ?? "",
            });
        } else {
            resetFormData();
        }
    }, [initialData, isOpen]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCostPriceChange = (value: number | null) => {
        setFormData((prev) => ({
            ...prev,
            costPrice: value ?? 0,
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
        onSubmit(formData, initialData?.id);
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
                    {initialData ? "Chỉnh sửa loại bàn" : "Thêm loại bàn mới"}
                </h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Nhập thông tin loại bàn bi-a.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name">
                        Tên loại bàn <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nhập tên loại bàn"
                        error={!!errors.name}
                    />
                    {errors.name && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.name}
                        </p>
                    )}
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
                        <p className="mt-1 text-xs text-red-500">
                            {errors.description}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="costPrice">
                            Giá nhập <span className="text-red-500">*</span>
                        </Label>
                        <MoneyVndInput
                            id="costPrice"
                            name="costPrice"
                            value={formData.costPrice}
                            onValueChange={handleCostPriceChange}
                            placeholder="Nhập giá nhập"
                            error={!!errors.costPrice}
                        />
                        {errors.costPrice && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.costPrice}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="pricePerHour">
                            Giá theo giờ <span className="text-red-500">*</span>
                        </Label>
                        <MoneyVndInput
                            id="pricePerHour"
                            name="pricePerHour"
                            value={formData.pricePerHour}
                            onValueChange={handlePricePerHourChange}
                            placeholder="Nhập giá theo giờ"
                            error={!!errors.pricePerHour}
                        />
                        {errors.pricePerHour && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.pricePerHour}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="supplier">
                            Nhà cung cấp <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="supplier"
                            name="supplier"
                            type="text"
                            value={formData.supplier}
                            onChange={handleChange}
                            placeholder="Nhập nhà cung cấp"
                            error={!!errors.supplier}
                        />
                        {errors.supplier && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.supplier}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="supplierPhone">
                            SĐT nhà cung cấp
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="supplierPhone"
                            name="supplierPhone"
                            type="text"
                            value={formData.supplierPhone}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                            error={!!errors.supplierPhone}
                        />
                        {errors.supplierPhone && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.supplierPhone}
                            </p>
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
                              : "Thêm loại bàn"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
