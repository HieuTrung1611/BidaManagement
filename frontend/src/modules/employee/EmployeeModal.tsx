"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/input/InputField";
import Select from "@/components/ui/form/Select";
import Button from "@/components/ui/button/Button";
import { IEmployeeRequest, IEmployeeResponse } from "@/types/employee";
import { IEmployeePositionResponse } from "@/types/employeePosition";

interface EmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: IEmployeeRequest, id?: number) => void;
    isSubmitting?: boolean;
    initialData?: IEmployeeResponse | null;
    errors?: Record<string, string>;
    employeePositions: IEmployeePositionResponse[];
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
    initialData,
    errors = {},
    employeePositions,
}) => {
    const initialFormData = useMemo<IEmployeeRequest>(
        () => ({
            name: "",
            email: "",
            phoneNumber: "",
            dob: "",
            address: "",
            positionId: null,
        }),
        [],
    );

    const [formData, setFormData] = useState<IEmployeeRequest>(initialFormData);

    const resetFormData = useCallback(() => {
        setFormData(initialFormData);
    }, [initialFormData]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name ?? "",
                email: initialData.email ?? "",
                phoneNumber: initialData.phoneNumber ?? "",
                dob: initialData.dob ?? "",
                address: initialData.address ?? "",
                positionId: initialData.position?.id ?? null,
            });
            return;
        }

        resetFormData();
    }, [initialData, isOpen]);

    const positionOptions = useMemo(
        () =>
            employeePositions.map((position) => ({
                value: position.id.toString(),
                label: `${position.name}`,
            })),
        [employeePositions],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePositionChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            positionId: Number(value) || null,
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
                    {initialData
                        ? "Chỉnh sửa thông tin nhân viên"
                        : "Thêm nhân viên mới"}
                </h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Nhập thông tin nhân viên.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="name">
                            Họ và tên <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nhập họ và tên"
                            error={!!errors.name}
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="email">
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nhập email"
                            error={!!errors.email}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="phoneNumber">
                            Số điện thoại{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="text"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                            error={!!errors.phoneNumber}
                        />
                        {errors.phoneNumber && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.phoneNumber}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="dob">
                            Ngày sinh <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="dob"
                            name="dob"
                            type="date"
                            value={formData.dob}
                            onChange={handleChange}
                            error={!!errors.dob}
                        />
                        {errors.dob && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.dob}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="positionId">
                            Vị trí <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            options={positionOptions}
                            value={
                                formData.positionId
                                    ? formData.positionId.toString()
                                    : ""
                            }
                            onChange={handlePositionChange}
                            placeholder="Chọn vị trí"
                            className="h-10 w-full"
                        />
                        {errors.positionId && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.positionId}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ"
                    />
                    {errors.address && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.address}
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
                              : "Thêm nhân viên"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
