"use client";

import React from "react";
import { AxiosError } from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button/Button";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/input/InputField";
import Select from "@/components/ui/form/Select";

import { useToast } from "@/context/ToastContext";
import { useBranches } from "@/hooks/useBranch";
import customerService from "@/services/customerService";
import { ICustomerRequest, ICustomerResponse } from "@/types/customer";

type CustomerModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: ICustomerResponse;
};

export const CustomerModal: React.FC<CustomerModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    initialData,
}) => {
    const toast = useToast();
    const { branches } = useBranches();

    const [isLoading, setIsLoading] = React.useState(false);
    const [formData, setFormData] = React.useState<ICustomerRequest>({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        branchId: null,
        customerNotes: "",
    });

    const [errors, setErrors] = React.useState<Record<string, string>>({});

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                phoneNumber: initialData.phoneNumber,
                address: initialData.address,
                                branchId: initialData.branch?.id || null,
                                customerNotes: initialData.customerNotes || "",
                            });
                        } else {
                            setFormData({
                                name: "",
                                email: "",
                                phoneNumber: "",
                                address: "",
                                branchId: null,
                                customerNotes: "",
                branchId: initialData.branch?.id || null,
            });
        } else {
            setFormData({
                name: "",
                email: "",
                phoneNumber: "",
                address: "",
                branchId: null,
            });
        }
        setErrors({});
    }, [initialData, isOpen]);

    const branchOptions = React.useMemo(
        () =>
            branches.map((branch) => ({
                value: branch.id.toString(),
                label: branch.name,
            })),
        [branches],
    );

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleBranchChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            branchId: value ? Number(value) : null,
        }));
        if (errors.branchId) {
            setErrors((prev) => ({
                ...prev,
                branchId: "",
            }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Tên khách hàng không được để trống";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email không được để trống";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ";
        }
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Số điện thoại không được để trống";
        }
        if (!formData.branchId) {
            newErrors.branchId = "Chi nhánh không được để trống";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setIsLoading(true);

            if (initialData) {
                await customerService.updateCustomer(initialData.id, formData);
                toast.success("Thành công", "Cập nhật khách hàng thành công");
            } else {
                await customerService.createCustomer(formData);
                toast.success("Thành công", "Tạo khách hàng thành công");
            }

            onSuccess();
            onClose();
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            toast.error(
                "Lỗi",
                axiosError.response?.data?.message || "Đã xảy ra lỗi",
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>
                        {initialData ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Tên khách hàng</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nhập tên khách hàng"
                                error={!!errors.name}
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
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
                                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="phoneNumber">Số điện thoại</Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
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
                            <Label htmlFor="address">Địa chỉ</Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Nhập địa chỉ"
                            />
                        </div>

                        <div>
                            <Label htmlFor="branchId">Chi nhánh</Label>
                            <Select
                                options={branchOptions}
                                value={formData.branchId?.toString() || ""}
                                onChange={handleBranchChange}
                                placeholder="Chọn chi nhánh"
                                className="h-10 w-full"
                            />
                            {errors.branchId && (
                                <p className="mt-1 text-xs text-red-500">{errors.branchId}</p>
                                                    <div>
                                                        <Label htmlFor="customerNotes">Ghi chú</Label>
                                                        <textarea
                                                            id="customerNotes"
                                                            name="customerNotes"
                                                            value={formData.customerNotes || ""}
                                                            onChange={handleChange}
                                                            placeholder="Ghi chú về sở thích, phong cách chơi..."
                                                            className="h-24 w-full rounded-md border border-neutral-300 p-2 text-sm"
                                                        />
                                                    </div>

                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Đang xử lý..." : "Lưu"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
