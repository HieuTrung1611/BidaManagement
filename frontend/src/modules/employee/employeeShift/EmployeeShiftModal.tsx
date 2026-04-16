"use client";

import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/input/InputField";
import Label from "@/components/ui/form/Label";
import { Modal } from "@/components/ui/modal";
import { IShiftRequest, IShiftResponse } from "@/types/shift";
import { FormEvent, useEffect, useState } from "react";

interface EmployeeShiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: IShiftRequest, id?: number) => void;
    isSubmitting?: boolean;
    initialData?: IShiftResponse | null;
    errors?: Record<string, string>;
}

export const EmployeeShiftModal: React.FC<EmployeeShiftModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
    initialData,
    errors = {},
}) => {
    const initialFormData: IShiftRequest = {
        name: "",
        code: "",
        description: "",
        startTime: "",
        endTime: "",
    };

    const [formData, setFormData] = useState<IShiftRequest>(initialFormData);

    const resetFormData = () => {
        setFormData(initialFormData);
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                code: initialData.code,
                description: initialData.description ?? "",
                startTime: initialData.startTime,
                endTime: initialData.endTime,
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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData, initialData?.id);
    };

    const handleClose = () => {
        resetFormData();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="max-w-lg p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    {initialData
                        ? "Chỉnh sửa ca làm việc"
                        : "Thêm ca làm việc mới"}
                </h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Nhập thông tin ca làm việc.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name">
                        Tên ca <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ví dụ: Ca sáng"
                        error={!!errors.name}
                    />
                    {errors.name && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor="code">
                        Mã ca <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="code"
                        name="code"
                        type="text"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="Ví dụ: CA_SANG"
                        error={!!errors.code}
                    />
                    {errors.code && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.code}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="startTime">
                            Giờ bắt đầu <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="startTime"
                            name="startTime"
                            type="time"
                            value={formData.startTime}
                            onChange={handleChange}
                            error={!!errors.startTime}
                        />
                        {errors.startTime && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.startTime}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="endTime">
                            Giờ kết thúc <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="endTime"
                            name="endTime"
                            type="time"
                            value={formData.endTime}
                            onChange={handleChange}
                            error={!!errors.endTime}
                        />
                        {errors.endTime && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.endTime}
                            </p>
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
                        rows={4}
                        placeholder="Mô tả chi tiết ca làm việc"
                        className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-hidden focus:ring-3 dark:bg-neutral-900 dark:text-white/90 ${
                            errors.description
                                ? "border-error-500 focus:ring-error-500/10"
                                : "border-neutral-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-neutral-700"
                        }`}
                    />
                    {errors.description && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.description}
                        </p>
                    )}
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
                              : "Thêm ca làm việc"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
