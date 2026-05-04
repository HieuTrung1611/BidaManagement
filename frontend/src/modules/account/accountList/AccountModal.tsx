"use client";

import { IAccountRequest, IAccountResponse, USERROLE } from "@/types/account";
import { FormEvent, useEffect, useState } from "react";
import { Modal } from "../../../components/ui/modal";
import Label from "../../../components/ui/form/Label";
import Input from "../../../components/ui/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import Select from "@/components/ui/form/Select";
import { useBranches } from "@/hooks/useBranch";

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: IAccountRequest, id?: number) => void;
    isSubmitting?: boolean;
    initialData?: IAccountResponse | null;
    errors?: Record<string, string>;
}

export const AccountModal: React.FC<AccountModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
    initialData,
    errors = {},
}) => {
    const initialFormData: IAccountRequest = {
        email: "",
        username: "",
        password: "",
        role: USERROLE.EMPLOYEE,
        branchId: null,
    };

    const [formData, setFormData] = useState<IAccountRequest>(initialFormData);
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
    const { branches } = useBranches();

    const resetFormData = () => {
        setFormData(initialFormData);
        setLocalErrors({});
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                email: initialData.email,
                username: initialData.username,
                password: "", // Keep password empty for editing
                role: initialData.role,
                branchId: initialData.branchId ?? null,
            });
        } else {
            resetFormData();
        }
    }, [initialData, isOpen]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRoleChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            role: value as USERROLE,
            branchId: value === USERROLE.ADMIN ? null : prev.branchId,
        }));
        if (value === USERROLE.ADMIN) {
            setLocalErrors((prev) => ({ ...prev, branchId: "" }));
        }
    };

    const handleBranchChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            branchId: value ? Number(value) : null,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const newLocalErrors: Record<string, string> = {};
        if (!initialData && !formData.password.trim()) {
            newLocalErrors.password = "Mật khẩu là bắt buộc";
        }
        if (formData.role !== USERROLE.ADMIN && !formData.branchId) {
            newLocalErrors.branchId = "Chi nhánh là bắt buộc";
        }
        if (Object.keys(newLocalErrors).length > 0) {
            setLocalErrors(newLocalErrors);
            return;
        }
        setLocalErrors({});
        onSubmit(formData, initialData?.id);
    };

    const handleClose = () => {
        resetFormData();
        onClose();
    };

    const roleOptions = [
        { value: USERROLE.EMPLOYEE, label: "Nhân viên" },
        { value: USERROLE.ACCOUNTANT, label: "Kế toán" },
        { value: USERROLE.MANAGER, label: "Quản lý" },
        { value: USERROLE.ADMIN, label: "Quản trị viên" },
    ];

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    {initialData
                        ? "Chỉnh sửa thông tin tài khoản"
                        : "Thêm tài khoản mới"}
                </h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Nhập thông tin tài khoản người dùng.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="username">
                        Tên đăng nhập
                        {!initialData && (
                            <span className="text-red-500">*</span>
                        )}
                    </Label>
                    <Input
                        id="username"
                        name="username"
                        type="text"
                        disabled={!!initialData} // Disable username field when editing
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Nhập tên đăng nhập..."
                        error={!!errors.username}
                    />
                    {errors.username && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.username}
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
                        placeholder="Nhập email..."
                        error={!!errors.email}
                    />
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor="password">
                        Mật khẩu
                        {!initialData && (
                            <span className="text-red-500">*</span>
                        )}
                    </Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => {
                            handleChange(e);
                            if (localErrors.password) setLocalErrors({});
                        }}
                        placeholder={
                            initialData
                                ? "Nhập mật khẩu mới (bỏ trống để giữ nguyên)..."
                                : "Nhập mật khẩu..."
                        }
                        error={!!(errors.password || localErrors.password)}
                    />
                    {(errors?.password || localErrors.password) && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors?.password || localErrors.password}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor="role">
                        Vai trò <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={formData.role}
                        onChange={handleRoleChange}
                        options={roleOptions}
                    />
                    {errors.role && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.role}
                        </p>
                    )}
                </div>

                {formData.role !== USERROLE.ADMIN && (
                    <div>
                        <Label htmlFor="branchId">
                            Chi nhánh <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.branchId?.toString() ?? ""}
                            onChange={(value) => {
                                handleBranchChange(value);
                                if (localErrors.branchId)
                                    setLocalErrors((prev) => ({
                                        ...prev,
                                        branchId: "",
                                    }));
                            }}
                            options={[
                                { value: "", label: "-- Chọn chi nhánh --" },
                                ...branches.map((b) => ({
                                    value: String(b.id),
                                    label: b.name,
                                })),
                            ]}
                        />
                        {(localErrors.branchId || errors.branchId) && (
                            <p className="mt-1 text-xs text-red-500">
                                {localErrors.branchId || errors.branchId}
                            </p>
                        )}
                    </div>
                )}

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
                              : "Tạo mới"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
