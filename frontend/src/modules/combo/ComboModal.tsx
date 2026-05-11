"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/input/InputField";
import Checkbox from "@/components/ui/form/input/Checkbox";
import MoneyVndInput from "@/components/ui/form/input/MoneyVndInput";
import Select from "@/components/ui/form/Select";
import Button from "@/components/ui/button/Button";
import {
    IComboRequest,
    IComboResponse,
    IComboItemRequest,
} from "@/types/combo";
import { IBranchResponse } from "@/types/branch";
import { IProductResponse } from "@/types/product";
import { IEquipmentResponse } from "@/types/equipment";
import { Plus, X } from "lucide-react";

interface ComboModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: IComboRequest, id?: number) => void;
    isSubmitting?: boolean;
    initialData?: IComboResponse | null;
    errors?: Record<string, string>;
    branches: IBranchResponse[];
    products: IProductResponse[];
    equipments: IEquipmentResponse[];
}

export const ComboModal: React.FC<ComboModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
    initialData,
    errors = {},
    branches,
    products,
    equipments,
}) => {
    const initialFormData = useMemo<IComboRequest>(
        () => ({
            name: "",
            description: null,
            regularPrice: 0,
            discountedPrice: 0,
            branchId: 0,
            isActive: true,
            items: [],
        }),
        [],
    );

    const [formData, setFormData] = useState<IComboRequest>(initialFormData);

    const resetFormData = useCallback(() => {
        setFormData(initialFormData);
    }, [initialFormData]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name ?? "",
                description: initialData.description ?? null,
                regularPrice: initialData.regularPrice ?? 0,
                discountedPrice: initialData.discountedPrice ?? 0,
                branchId: initialData.branchId ?? 0,
                isActive: initialData.isActive ?? true,
                items:
                    initialData.items?.map((item) => ({
                        itemType: item.itemType,
                        itemId: item.itemId,
                        quantity: item.quantity,
                    })) ?? [],
            });
            return;
        }

        resetFormData();
    }, [initialData, isOpen, resetFormData]);

    const branchOptions = useMemo(
        () =>
            branches.map((branch) => ({
                value: branch.id.toString(),
                label: branch.name,
            })),
        [branches],
    );

    const itemTypeOptions = useMemo(
        () => [
            { value: "PRODUCT", label: "Sản phẩm (đồ ăn/uống)" },
            { value: "EQUIPMENT", label: "Thiết bị (cơ/phấn...)" },
        ],
        [],
    );

    const getItemOptions = (itemType: "PRODUCT" | "EQUIPMENT") => {
        if (itemType === "PRODUCT") {
            return products.map((p) => ({
                value: p.id.toString(),
                label: `${p.name} - ${p.salePrice.toLocaleString("vi-VN")}đ`,
            }));
        } else {
            return equipments.map((e) => ({
                value: e.id.toString(),
                label: `${e.name} - ${e.rentalPricePerHour.toLocaleString("vi-VN")}đ/h`,
            }));
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleBranchChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            branchId: Number(value),
        }));
    };

    const handleRegularPriceChange = (value: number | null) => {
        setFormData((prev) => ({
            ...prev,
            regularPrice: value ?? 0,
        }));
    };

    const handleDiscountedPriceChange = (value: number | null) => {
        setFormData((prev) => ({
            ...prev,
            discountedPrice: value ?? 0,
        }));
    };

    const handleActiveChange = (checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            isActive: checked,
        }));
    };

    const handleAddItem = () => {
        setFormData((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    itemType: "PRODUCT",
                    itemId: 0,
                    quantity: 1,
                },
            ],
        }));
    };

    const handleRemoveItem = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    const handleItemChange = (
        index: number,
        field: keyof IComboItemRequest,
        value: any,
    ) => {
        setFormData((prev) => ({
            ...prev,
            items: prev.items.map((item, i) => {
                if (i !== index) return item;

                // If changing itemType, reset itemId
                if (field === "itemType") {
                    return {
                        ...item,
                        itemType: value,
                        itemId: 0,
                    };
                }

                return {
                    ...item,
                    [field]: value,
                };
            }),
        }));
    };

    const savingsAmount = formData.regularPrice - formData.discountedPrice;
    const savingsPercent =
        formData.regularPrice > 0
            ? (savingsAmount / formData.regularPrice) * 100
            : 0;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData, initialData?.id);
    };

    const handleClose = () => {
        resetFormData();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="max-w-4xl p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    {initialData ? "Chỉnh sửa combo" : "Thêm combo mới"}
                </h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Tạo gói combo ưu đãi bao gồm nhiều sản phẩm/thiết bị.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="name">
                            Tên combo <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="VD: Combo Happy Hour"
                            error={!!errors.name}
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.name}
                            </p>
                        )}
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
                            placeholder="Nhập mô tả combo"
                            rows={2}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800"
                        />
                    </div>
                </div>

                {/* Items Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>
                            Sản phẩm trong combo{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddItem}>
                            <Plus className="h-4 w-4 mr-1" />
                            Thêm sản phẩm
                        </Button>
                    </div>

                    {formData.items.length === 0 ? (
                        <div className="rounded-md border border-dashed border-gray-300 p-8 text-center">
                            <p className="text-sm text-gray-500">
                                Chưa có sản phẩm nào. Nhấn &quot;Thêm sản
                                phẩm&quot; để bắt đầu.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {formData.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 rounded-md border border-gray-200 p-3 dark:border-gray-700">
                                    <div className="flex-1 grid grid-cols-1 gap-3 md:grid-cols-3">
                                        <Select
                                            options={itemTypeOptions}
                                            value={item.itemType}
                                            onChange={(value) =>
                                                handleItemChange(
                                                    index,
                                                    "itemType",
                                                    value,
                                                )
                                            }
                                            placeholder="Loại"
                                        />
                                        <Select
                                            options={getItemOptions(
                                                item.itemType,
                                            )}
                                            value={
                                                item.itemId
                                                    ? item.itemId.toString()
                                                    : ""
                                            }
                                            onChange={(value) =>
                                                handleItemChange(
                                                    index,
                                                    "itemId",
                                                    Number(value),
                                                )
                                            }
                                            placeholder="Chọn sản phẩm"
                                        />
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    "quantity",
                                                    Number(e.target.value) || 1,
                                                )
                                            }
                                            placeholder="Số lượng"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem(index)}
                                        className="text-red-600 hover:text-red-700 p-2">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="regularPrice">
                            Giá gốc (tổng nếu mua lẻ){" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <MoneyVndInput
                            id="regularPrice"
                            value={formData.regularPrice}
                            onChange={handleRegularPriceChange}
                            error={!!errors.regularPrice}
                        />
                        {errors.regularPrice && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.regularPrice}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="discountedPrice">
                            Giá combo (ưu đãi){" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <MoneyVndInput
                            id="discountedPrice"
                            value={formData.discountedPrice}
                            onChange={handleDiscountedPriceChange}
                            error={!!errors.discountedPrice}
                        />
                        {errors.discountedPrice && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.discountedPrice}
                            </p>
                        )}
                    </div>

                    {savingsAmount > 0 && (
                        <div className="md:col-span-2">
                            <div className="rounded-md bg-green-50 p-3 dark:bg-green-900/20">
                                <p className="text-sm text-green-700 dark:text-green-400">
                                    💰 Tiết kiệm:{" "}
                                    <span className="font-semibold">
                                        {savingsAmount.toLocaleString("vi-VN")}đ
                                    </span>{" "}
                                    ({savingsPercent.toFixed(1)}%)
                                </p>
                            </div>
                        </div>
                    )}

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
