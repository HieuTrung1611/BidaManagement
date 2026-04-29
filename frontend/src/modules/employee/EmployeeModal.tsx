"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/input/InputField";
import Checkbox from "@/components/ui/form/input/Checkbox";
import MoneyVndInput from "@/components/ui/form/input/MoneyVndInput";
import Select from "@/components/ui/form/Select";
import Button from "@/components/ui/button/Button";
import { IEmployeeRequest, IEmployeeResponse } from "@/types/employee";
import { IEmployeePositionResponse } from "@/types/employeePosition";
import { IBranchResponse } from "@/types/branch";
import { IShiftResponse } from "@/types/shift";

interface EmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: IEmployeeRequest, id?: number) => void;
    isSubmitting?: boolean;
    initialData?: IEmployeeResponse | null;
    errors?: Record<string, string>;
    employeePositions: IEmployeePositionResponse[];
    branches: IBranchResponse[];
    shifts: IShiftResponse[];
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
    initialData,
    errors = {},
    employeePositions,
    branches,
    shifts,
}) => {
    const initialFormData = useMemo<IEmployeeRequest>(
        () => ({
            name: "",
            email: "",
            phoneNumber: "",
            dob: "",
            address: "",
            identityNumber: "",
            bankAccount: "",
            bankName: "",
            hireDate: "",
            salaryType: "FIXED",
            baseSalary: 0,
            emergencyContactName: "",
            emergencyContactPhone: "",
            isActive: true,
            positionId: null,
            branchId: null,
            shiftId: null,
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
                identityNumber: initialData.identityNumber ?? "",
                bankAccount: initialData.bankAccount ?? "",
                bankName: initialData.bankName ?? "",
                hireDate: initialData.hireDate ?? "",
                salaryType: initialData.salaryType ?? "FIXED",
                baseSalary: initialData.baseSalary ?? 0,
                emergencyContactName: initialData.emergencyContactName ?? "",
                emergencyContactPhone: initialData.emergencyContactPhone ?? "",
                isActive: initialData.isActive ?? true,
                positionId: initialData.position?.id ?? null,
                branchId: initialData.branch?.id ?? null,
                shiftId: initialData.shift?.id ?? null,
            });
            return;
        }

        resetFormData();
    }, [initialData, isOpen, resetFormData]);

    const positionOptions = useMemo(
        () =>
            employeePositions.map((position) => ({
                value: position.id.toString(),
                label: `${position.name}`,
            })),
        [employeePositions],
    );

    const branchOptions = useMemo(
        () =>
            branches.map((branch) => ({
                value: branch.id.toString(),
                label: `${branch.name}`,
            })),
        [branches],
    );

    const shiftOptions = useMemo(
        () =>
            shifts.map((shift) => ({
                value: shift.id.toString(),
                label: shift.name,
            })),
        [shifts],
    );

    const salaryTypeOptions = useMemo(
        () => [
            { value: "FIXED", label: "Lương cố định" },
            { value: "HOURLY", label: "Lương theo giờ" },
        ],
        [],
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

    const handleBranchChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            branchId: Number(value) || null,
        }));
    };

    const handleShiftChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            shiftId: value ? Number(value) : null,
        }));
    };

    const handleSalaryTypeChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            salaryType: value
                ? (value as IEmployeeRequest["salaryType"])
                : null,
            // Set baseSalary to 0 when HOURLY is selected
            baseSalary: value === "HOURLY" ? 0 : prev.baseSalary,
        }));
    };

    const handleBaseSalaryChange = (value: number | null) => {
        setFormData((prev) => ({
            ...prev,
            baseSalary: value,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(
            {
                ...formData,
                salaryType: formData.salaryType ?? "FIXED",
                baseSalary: formData.baseSalary ?? 0,
            },
            initialData?.id,
        );
    };

    const handleClose = () => {
        resetFormData();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="max-w-3xl p-6">
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

                    <div>
                        <Label htmlFor="shiftId">
                            Ca làm việc{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            options={shiftOptions}
                            value={
                                formData.shiftId
                                    ? formData.shiftId.toString()
                                    : ""
                            }
                            onChange={handleShiftChange}
                            placeholder="Chọn ca làm việc"
                            className="h-10 w-full"
                        />
                        {errors.shiftId && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.shiftId}
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
                            className="h-10 w-full"
                        />
                        {errors.branchId && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.branchId}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="hireDate">Ngày vào làm</Label>
                        <Input
                            id="hireDate"
                            name="hireDate"
                            type="date"
                            value={formData.hireDate}
                            onChange={handleChange}
                            error={!!errors.hireDate}
                        />
                        {errors.hireDate && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.hireDate}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="salaryType">Loại lương</Label>
                        <Select
                            options={salaryTypeOptions}
                            value={formData.salaryType ?? ""}
                            onChange={handleSalaryTypeChange}
                            placeholder="Chọn loại lương"
                            className="h-10 w-full"
                        />
                        {errors.salaryType && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.salaryType}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="baseSalary">Lương cơ bản</Label>
                        <MoneyVndInput
                            id="baseSalary"
                            name="baseSalary"
                            value={formData.baseSalary ?? null}
                            onValueChange={handleBaseSalaryChange}
                            placeholder={formData.salaryType === "HOURLY" ? "Lương theo giờ không cần nhập" : "Nhập lương cơ bản"}
                            error={!!errors.baseSalary}
                            disabled={formData.salaryType === "HOURLY"}
                        />
                        {errors.baseSalary && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.baseSalary}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="identityNumber">CCCD/CMND</Label>
                        <Input
                            id="identityNumber"
                            name="identityNumber"
                            type="text"
                            value={formData.identityNumber}
                            onChange={handleChange}
                            placeholder="Nhập số CCCD/CMND"
                            error={!!errors.identityNumber}
                        />
                        {errors.identityNumber && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.identityNumber}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="bankName">Tên ngân hàng</Label>
                        <Input
                            id="bankName"
                            name="bankName"
                            type="text"
                            value={formData.bankName}
                            onChange={handleChange}
                            placeholder="Nhập tên ngân hàng"
                            error={!!errors.bankName}
                        />
                        {errors.bankName && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.bankName}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="bankAccount">Số tài khoản</Label>
                        <Input
                            id="bankAccount"
                            name="bankAccount"
                            type="text"
                            value={formData.bankAccount}
                            onChange={handleChange}
                            placeholder="Nhập số tài khoản"
                            error={!!errors.bankAccount}
                        />
                        {errors.bankAccount && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.bankAccount}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="emergencyContactName">
                            Người liên hệ khẩn cấp
                        </Label>
                        <Input
                            id="emergencyContactName"
                            name="emergencyContactName"
                            type="text"
                            value={formData.emergencyContactName}
                            onChange={handleChange}
                            placeholder="Nhập tên người liên hệ"
                            error={!!errors.emergencyContactName}
                        />
                        {errors.emergencyContactName && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.emergencyContactName}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="emergencyContactPhone">
                            SĐT liên hệ khẩn cấp
                        </Label>
                        <Input
                            id="emergencyContactPhone"
                            name="emergencyContactPhone"
                            type="text"
                            value={formData.emergencyContactPhone}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại liên hệ"
                            error={!!errors.emergencyContactPhone}
                        />
                        {errors.emergencyContactPhone && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.emergencyContactPhone}
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

                <div>
                    <Checkbox
                        id="isActive"
                        label="Đang hoạt động"
                        checked={!!formData.isActive}
                        onChange={(checked) =>
                            setFormData((prev) => ({
                                ...prev,
                                isActive: checked,
                            }))
                        }
                    />
                    {errors.isActive && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.isActive}
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
