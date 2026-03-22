"use client";

import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/input/InputField";
import Label from "@/components/ui/form/Label";
import { Modal } from "@/components/ui/modal";
import {
    IEmployeePositionRequest,
    IEmployeePositionResponse,
} from "@/types/employeePosition";
import { FormEvent, useEffect, useState } from "react";

interface EmployeePositionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: IEmployeePositionRequest, id?: number) => void;
    isSubmitting?: boolean;
    initialData?: IEmployeePositionResponse | null;
    errors?: Record<string, string>; // thêm dòng này
}

export const EmployeePositionModal: React.FC<EmployeePositionModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
    initialData,
    errors = {},
}) => {
    const initialFormData: IEmployeePositionRequest = {
        name: "",
        code: "",
        hourlyRate: 0,
    };

    const [formData, setFormData] =
        useState<IEmployeePositionRequest>(initialFormData);

    const resetFormData = () => {
        setFormData(initialFormData);
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                code: initialData.code,
                hourlyRate: initialData.hourlyRate,
            });
        } else {
            resetFormData();
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "hourlyRate" ? Number(value) || 0 : value,
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
        <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    {initialData
                        ? "Chỉnh sửa thông tin vị trí nhân viên"
                        : "Thêm vị trí nhân viên mới"}
                </h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Nhập thông tin vị trí nhân viên.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name">
                        Tên vị trí <span className="text-red-500">* </span>
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        defaultValue={formData.name}
                        onChange={handleChange}
                        placeholder="Tên vị trí"
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
                        Mã vị trí <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="code"
                        name="code"
                        type="text"
                        defaultValue={formData.code}
                        onChange={handleChange}
                        placeholder="Mã vị trí"
                        error={!!errors.code}
                    />
                    {errors.code && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.code}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor="hourlyRate">
                        Lương theo giờ <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="hourlyRate"
                        name="hourlyRate"
                        type="money"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        placeholder="Nhập lương theo giờ"
                        error={!!errors.hourlyRate}
                    />
                    {errors.hourlyRate && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.hourlyRate}
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
                              : "Thêm vị trí nhân viên"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
