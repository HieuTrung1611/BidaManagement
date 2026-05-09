"use client";

import React from "react";
import { AxiosError } from "axios";

import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/input/InputField";
import Select from "@/components/ui/form/Select";

import { useToast } from "@/context/ToastContext";
import { useBranches } from "@/hooks/useBranch";
import customerService from "@/services/customerService";
import { ICustomerRankOption, ICustomerRequest, ICustomerResponse } from "@/types/customer";

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
    const [rankOptions, setRankOptions] = React.useState<ICustomerRankOption[]>([]);
    const [photoFile, setPhotoFile] = React.useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
    const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [formData, setFormData] = React.useState<ICustomerRequest>({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        branchId: null,
        customerNotes: "",
        rank: undefined,
    });

    const [errors, setErrors] = React.useState<Record<string, string>>({});

    React.useEffect(() => {
        customerService.getRanks().then((res) => { if (res.data) setRankOptions(res.data); }).catch(() => {});
    }, []);

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                phoneNumber: initialData.phoneNumber,
                address: initialData.address,
                branchId: initialData.branch?.id || null,
                customerNotes: initialData.customerNotes || "",
                rank: initialData.rank,
            });
        } else {
            setFormData({
                name: "",
                email: "",
                phoneNumber: "",
                address: "",
                branchId: null,
                customerNotes: "",
                rank: undefined,
            });
        }
        setErrors({});
        setPhotoFile(null);
        setPhotoPreview(null);
    }, [initialData, isOpen]);

    const branchOptions = React.useMemo(
        () =>
            branches.map((branch) => ({
                value: branch.id.toString(),
                label: branch.name,
            })),
        [branches],
    );

    const rankSelectOptions = React.useMemo(
        () =>
            rankOptions.map((r) => ({
                value: r.value,
                label: `${r.displayName} (giảm ${r.discountPercent}%)`,
            })),
        [rankOptions],
    );

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleBranchChange = (value: string) => {
        setFormData((prev) => ({ ...prev, branchId: value ? Number(value) : null }));
        if (errors.branchId) setErrors((prev) => ({ ...prev, branchId: "" }));
    };

    const handleRankChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            rank: value ? (value as ICustomerRequest["rank"]) : undefined,
        }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Tên khách hàng không được để trống";
        if (!formData.email.trim()) {
            newErrors.email = "Email không được để trống";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ";
        }
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Số điện thoại không được để trống";
        if (!formData.branchId) newErrors.branchId = "Chi nhánh không được để trống";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setIsLoading(true);
            let savedId: number | undefined = initialData?.id;

            if (initialData) {
                await customerService.updateCustomer(initialData.id, formData);
                toast.success("Thành công", "Cập nhật khách hàng thành công");
            } else {
                const res = await customerService.createCustomer(formData);
                savedId = res.data?.id;
                toast.success("Thành công", "Tạo khách hàng thành công");
            }

            if (photoFile && savedId) {
                try {
                    setIsUploadingPhoto(true);
                    await customerService.uploadCustomerPhoto(savedId, photoFile);
                } catch {
                    toast.error("Cảnh báo", "Lưu thông tin thành công nhưng upload ảnh thất bại");
                } finally {
                    setIsUploadingPhoto(false);
                }
            }

            onSuccess();
            onClose();
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message?: string }>;
            toast.error("Lỗi", axiosError.response?.data?.message || "Đã xảy ra lỗi");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setPhotoFile(null);
        setPhotoPreview(null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    {initialData ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
                </h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Nhập thông tin khách hàng.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Ảnh khách hàng */}
                <div className="flex flex-col items-center gap-2">
                    <div
                        className="h-24 w-24 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {photoPreview || initialData?.photoUrl ? (
                            <img
                                src={photoPreview || initialData?.photoUrl}
                                alt="Ảnh khách hàng"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="px-1 text-center text-xs text-neutral-400">Chọn ảnh</span>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {initialData?.photoUrl ? "Đổi ảnh" : "Tải ảnh lên"}
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="name">
                            Tên khách hàng <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nhập tên khách hàng"
                            error={!!errors.name}
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
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
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div>
                        <Label htmlFor="phoneNumber">
                            Số điện thoại <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                            error={!!errors.phoneNumber}
                        />
                        {errors.phoneNumber && <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>}
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
                        <Label htmlFor="branchId">
                            Chi nhánh <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            options={branchOptions}
                            value={formData.branchId?.toString() || ""}
                            onChange={handleBranchChange}
                            placeholder="Chọn chi nhánh"
                            className="h-10 w-full"
                        />
                        {errors.branchId && <p className="mt-1 text-xs text-red-500">{errors.branchId}</p>}
                    </div>

                    {/* Hạng khách hàng - chỉ hiện khi edit */}
                    {initialData && (
                        <div>
                            <Label htmlFor="rank">Hạng khách hàng</Label>
                            <Select
                                options={rankSelectOptions}
                                value={formData.rank || ""}
                                onChange={handleRankChange}
                                placeholder="Chọn hạng"
                                className="h-10 w-full"
                            />
                        </div>
                    )}
                </div>

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

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading || isUploadingPhoto}>
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading || isUploadingPhoto}>
                        {isLoading || isUploadingPhoto
                            ? "Đang xử lý..."
                            : initialData
                              ? "Cập nhật"
                              : "Thêm khách hàng"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

