"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/input/InputField";
import Checkbox from "@/components/ui/form/input/Checkbox";
import MoneyVndInput from "@/components/ui/form/input/MoneyVndInput";
import Select from "@/components/ui/form/Select";
import Button from "@/components/ui/button/Button";
import { IProductRequest, IProductResponse } from "@/types/product";
import { IBranchResponse } from "@/types/branch";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: IProductRequest, id?: number) => void;
    isSubmitting?: boolean;
    initialData?: IProductResponse | null;
    errors?: Record<string, string>;
    branches: IBranchResponse[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
    initialData,
    errors = {},
    branches,
}) => {
    const initialFormData = useMemo<IProductRequest>(
        () => ({
            name: "",
            description: null,
            type: "FOOD",
            purchasePrice: 0,
            salePrice: 0,
            stockQuantity: 0,
            unit: "Cái",
            branchId: 0,
            isActive: true,
        }),
        [],
    );

    const [formData, setFormData] = useState<IProductRequest>(initialFormData);

    const resetFormData = useCallback(() => {
        setFormData(initialFormData);
    }, [initialFormData]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name ?? "",
                description: initialData.description ?? null,
                type: initialData.type ?? "FOOD",
                purchasePrice: initialData.purchasePrice ?? 0,
                salePrice: initialData.salePrice ?? 0,
                stockQuantity: initialData.stockQuantity ?? 0,
                unit: initialData.unit ?? "Cái",
                branchId: initialData.branchId ?? 0,
                isActive: initialData.isActive ?? true,
            });
            return;
        }

        resetFormData();
    }, [initialData, isOpen, resetFormData]);

    const productTypeOptions = useMemo(
        () => [
            { value: "FOOD", label: "Đồ ăn" },
            { value: "BEVERAGE", label: "Đồ uống" },
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

    const unitOptions = useMemo(
        () => [
            { value: "Cái", label: "Cái" },
            { value: "Ly", label: "Ly" },
            { value: "Chai", label: "Chai" },
            { value: "Lon", label: "Lon" },
            { value: "Suất", label: "Suất" },
            { value: "Phần", label: "Phần" },
            { value: "Kg", label: "Kg" },
            { value: "Gói", label: "Gói" },
        ],
        [],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTypeChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            type: value as IProductRequest["type"],
        }));
    };

    const handleBranchChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            branchId: Number(value),
        }));
    };

    const handleUnitChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            unit: value,
        }));
    };

    const handlePurchasePriceChange = (value: number | null) => {
        setFormData((prev) => ({
            ...prev,
            purchasePrice: value ?? 0,
        }));
    };

    const handleSalePriceChange = (value: number | null) => {
        setFormData((prev) => ({
            ...prev,
            salePrice: value ?? 0,
        }));
    };

    const handleStockQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            stockQuantity: Number(e.target.value) || 0,
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
                    {initialData ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                </h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Nhập thông tin sản phẩm đồ ăn/đồ uống.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="name">
                            Tên sản phẩm <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nhập tên sản phẩm"
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
                            options={productTypeOptions}
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
                        <Label htmlFor="purchasePrice">
                            Giá nhập <span className="text-red-500">*</span>
                        </Label>
                        <MoneyVndInput
                            id="purchasePrice"
                            value={formData.purchasePrice}
                            onChange={handlePurchasePriceChange}
                            error={!!errors.purchasePrice}
                        />
                        {errors.purchasePrice && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.purchasePrice}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="salePrice">
                            Giá bán <span className="text-red-500">*</span>
                        </Label>
                        <MoneyVndInput
                            id="salePrice"
                            value={formData.salePrice}
                            onChange={handleSalePriceChange}
                            error={!!errors.salePrice}
                        />
                        {errors.salePrice && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.salePrice}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="stockQuantity">
                            Số lượng tồn kho <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="stockQuantity"
                            name="stockQuantity"
                            type="number"
                            min="0"
                            value={formData.stockQuantity}
                            onChange={handleStockQuantityChange}
                            placeholder="0"
                            error={!!errors.stockQuantity}
                        />
                        {errors.stockQuantity && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.stockQuantity}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="unit">
                            Đơn vị <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            options={unitOptions}
                            value={formData.unit}
                            onChange={handleUnitChange}
                            placeholder="Chọn đơn vị"
                            error={!!errors.unit}
                        />
                        {errors.unit && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.unit}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <Label htmlFor="branchId">
                            Chi nhánh <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            options={branchOptions}
                            value={formData.branchId ? formData.branchId.toString() : ""}
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
                            placeholder="Nhập mô tả sản phẩm"
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
