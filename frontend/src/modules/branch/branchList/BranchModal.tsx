"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/input/InputField";
import Button from "@/components/ui/button/Button";
import {
    IBranchCreationRequest,
    IBranchDetailResponse,
    IbranchImage,
    IBranchResponse,
} from "@/types/branch";
import Image from "next/image";
import { Upload, X } from "lucide-react";

export type BranchFormData = IBranchCreationRequest & {
    images?: File[];
    deleteImageIds?: number[];
};

interface BranchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: BranchFormData, id?: number) => void;
    isSubmitting?: boolean;
    initialData?: IBranchResponse | null;
    errors?: Record<string, string>;
}

export const BranchModal: React.FC<BranchModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
    initialData,
    errors = {},
}) => {
    const initialFormData = useMemo<BranchFormData>(
        () => ({
            name: "",
            address: "",
            description: "",
            images: [],
            deleteImageIds: [],
        }),
        [],
    );

    const [formData, setFormData] = useState<BranchFormData>(initialFormData);

    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const [existingImages, setExistingImages] = useState<IbranchImage[]>([]);

    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

    const resetFormData = useCallback(() => {
        setFormData(initialFormData);
        setSelectedImages([]);
        setPreviewUrls([]);
        setExistingImages([]);
        setDeletedImageIds([]);
    }, [initialFormData]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name ?? "",
                address: initialData.address ?? "",
                description: initialData.description ?? "",
                images: [],
                deleteImageIds: [],
            });

            setExistingImages(initialData.branchImages || []);
            setDeletedImageIds([]);

            return;
        }

        resetFormData();
    }, [initialData, isOpen, resetFormData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        setFormData((prev) => ({
            ...prev,
            description: e.target.value,
        }));
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files) return;

        const newFiles = Array.from(files);

        const validFiles = newFiles.filter((file) => {
            if (!file.type.startsWith("image/")) return false;

            if (file.size > 10 * 1024 * 1024) return false;

            return true;
        });

        setSelectedImages((prev) => [...prev, ...validFiles]);

        validFiles.forEach((file) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                setPreviewUrls((prev) => [...prev, reader.result as string]);
            };

            reader.readAsDataURL(file);
        });
    };

    const handleRemoveNewImage = (index: number) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));

        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleRemoveExistingImage = (id: number) => {
        setExistingImages((prev) => prev.filter((img) => img.id !== id));

        setDeletedImageIds((prev) => [...prev, id]);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const submitData: BranchFormData = {
            ...formData,

            images: selectedImages.length > 0 ? selectedImages : undefined,

            deleteImageIds:
                deletedImageIds.length > 0 ? deletedImageIds : undefined,
        };

        onSubmit(submitData, initialData?.id);
    };

    const handleClose = () => {
        resetFormData();

        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            className="max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    {initialData ? "Chỉnh sửa chi nhánh" : "Thêm chi nhánh"}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label>Tên chi nhánh *</Label>

                    <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label>Địa chỉ *</Label>

                    <Input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label>Mô tả</Label>

                    <textarea
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* upload */}

                <div>
                    <Label>Hình ảnh chi nhánh</Label>

                    <label
                        htmlFor="images"
                        className="flex items-center justify-center w-full h-20 border-2 border-dashed rounded cursor-pointer">
                        <Upload />

                        <input
                            id="images"
                            type="file"
                            multiple
                            hidden
                            accept="image/*"
                            onChange={handleImagesChange}
                        />
                    </label>

                    {/* existing */}

                    {existingImages.length > 0 && (
                        <div className="mt-3">
                            <p>Ảnh hiện tại</p>

                            <div className="grid grid-cols-5 gap-2">
                                {existingImages.map((img) => (
                                    <div
                                        key={img.id}
                                        className="relative aspect-square">
                                        <Image
                                            src={img.url}
                                            alt=""
                                            fill
                                            className="object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveExistingImage(
                                                    img.id,
                                                )
                                            }
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* new */}

                    {previewUrls.length > 0 && (
                        <div className="mt-3">
                            <p>Ảnh mới ({selectedImages.length})</p>

                            <div className="grid grid-cols-5 gap-2">
                                {previewUrls.map((url, index) => (
                                    <div
                                        key={index}
                                        className="relative aspect-square">
                                        <Image
                                            src={url}
                                            alt=""
                                            fill
                                            className="object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveNewImage(index)
                                            }
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}>
                        Hủy
                    </Button>

                    <Button type="submit">
                        {isSubmitting
                            ? "Đang xử lý..."
                            : initialData
                              ? "Cập nhật"
                              : "Thêm"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
