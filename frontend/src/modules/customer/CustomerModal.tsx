"use client";

import React from "react";
import { AxiosError } from "axios";

import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/ui/form/Label";
import Input from "@/components/ui/form/input/InputField";
import Select from "@/components/ui/form/Select";

import { useToast } from "@/context/ToastContext";
import customerService from "@/services/customerService";
import {
    CustomerRank,
    ICustomerRequest,
    ICustomerResponse,
    ICustomerRankOption,
} from "@/types/customer";

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

    const [isLoading, setIsLoading] = React.useState(false);
    const [formData, setFormData] = React.useState<ICustomerRequest>({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        customerNotes: "",
        rank: "BRONZE",
    });
    const [ranks, setRanks] = React.useState<ICustomerRankOption[]>([]);

    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [photoFile, setPhotoFile] = React.useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = React.useState(false);
    const [stream, setStream] = React.useState<MediaStream | null>(null);
    const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    // Fetch customer ranks
    React.useEffect(() => {
        const fetchRanks = async () => {
            try {
                const res = await customerService.getRanks();
                if (res.success && res.data) {
                    setRanks(res.data);
                }
            } catch (error) {
                console.error("Error fetching ranks:", error);
            }
        };
        fetchRanks();
    }, []);

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                phoneNumber: initialData.phoneNumber,
                address: initialData.address,
                customerNotes: initialData.customerNotes || "",
                rank: initialData.rank || "BRONZE",
            });
            setPhotoPreview(initialData.photoUrl || null);
        } else {
            setFormData({
                name: "",
                email: "",
                phoneNumber: "",
                address: "",
                customerNotes: "",
                rank: "BRONZE",
            });
            setPhotoPreview(null);
        }
        setErrors({});
        setPhotoFile(null);
    }, [initialData, isOpen]);

    // Cleanup camera stream khi component unmount hoặc đóng modal
    React.useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    // Cleanup camera khi đóng modal
    React.useEffect(() => {
        if (!isOpen && stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
            setIsCameraOpen(false);
        }
    }, [isOpen, stream]);

    // Gán stream vào video element khi video đã được render
    React.useEffect(() => {
        if (stream && videoRef.current && isCameraOpen) {
            console.log("✅ Gán stream vào video element");
            videoRef.current.srcObject = stream;

            videoRef.current.onloadedmetadata = () => {
                console.log("✅ Video metadata đã load", {
                    videoWidth: videoRef.current?.videoWidth,
                    videoHeight: videoRef.current?.videoHeight,
                });
            };
        }
    }, [stream, isCameraOpen]);

    // Xử lý mở camera
    const handleOpenCamera = async () => {
        console.log("📷 Đang mở camera...");
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: "user",
                },
                audio: false,
            });

            console.log("✅ Camera stream đã được lấy:", mediaStream);
            console.log("📹 Video tracks:", mediaStream.getVideoTracks());

            // Set state - useEffect sẽ xử lý việc gán stream vào video element
            setStream(mediaStream);
            setIsCameraOpen(true);
        } catch (error) {
            console.error("❌ Lỗi khi mở camera:", error);
            toast.error(
                "Lỗi",
                "Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.",
            );
        }
    };

    // Xử lý đóng camera
    const handleCloseCamera = () => {
        console.log("🔴 Đóng camera...");
        if (stream) {
            stream.getTracks().forEach((track) => {
                track.stop();
                console.log("⏹️ Stopped track:", track.label);
            });
            setStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraOpen(false);
        console.log("✅ Camera đã đóng");
    };

    // Xử lý chụp ảnh từ camera
    const handleCapturePhoto = () => {
        console.log("🎬 Bắt đầu chụp ảnh...");

        if (!videoRef.current) {
            console.error("❌ Video element không tồn tại");
            toast.error("Lỗi", "Video element không tồn tại");
            return;
        }

        if (!canvasRef.current) {
            console.error("❌ Canvas element không tồn tại");
            toast.error("Lỗi", "Canvas element không tồn tại");
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;

        console.log("📹 Video dimensions:", {
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight,
            readyState: video.readyState,
        });

        // Kiểm tra video đã sẵn sàng chưa
        if (video.readyState !== video.HAVE_ENOUGH_DATA) {
            console.error("❌ Video chưa sẵn sàng");
            toast.error("Lỗi", "Video chưa sẵn sàng. Vui lòng thử lại.");
            return;
        }

        const context = canvas.getContext("2d");
        if (!context) {
            console.error("❌ Không thể lấy canvas context");
            toast.error("Lỗi", "Không thể lấy canvas context");
            return;
        }

        try {
            // Set canvas size bằng video size
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            console.log("🎨 Canvas size set:", {
                width: canvas.width,
                height: canvas.height,
            });

            // Vẽ frame hiện tại từ video lên canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            console.log("✅ Đã vẽ frame lên canvas");

            // Chuyển canvas thành blob rồi thành file
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        console.error("❌ Không thể tạo blob từ canvas");
                        toast.error("Lỗi", "Không thể tạo ảnh từ camera");
                        return;
                    }

                    console.log("📦 Blob created:", {
                        size: blob.size,
                        type: blob.type,
                    });

                    const file = new File(
                        [blob],
                        `customer-photo-${Date.now()}.jpg`,
                        {
                            type: "image/jpeg",
                        },
                    );

                    console.log("📄 File created:", {
                        name: file.name,
                        size: file.size,
                        type: file.type,
                    });

                    const previewUrl = URL.createObjectURL(file);
                    console.log("🖼️ Preview URL:", previewUrl);

                    setPhotoFile(file);
                    setPhotoPreview(previewUrl);
                    handleCloseCamera();

                    console.log("✅ Chụp ảnh thành công!");
                    toast.success("Thành công", "Đã chụp ảnh thành công");
                },
                "image/jpeg",
                0.95,
            );
        } catch (error) {
            console.error("❌ Lỗi khi chụp ảnh:", error);
            toast.error("Lỗi", "Có lỗi xảy ra khi chụp ảnh");
        }
    };

    // Xử lý chọn file ảnh
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    // Xử lý xóa ảnh
    const handleRemovePhoto = () => {
        setPhotoFile(null);
        setPhotoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
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

    const handleRankChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            rank: value as CustomerRank,
        }));
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
            let savedId: number | undefined;

            if (initialData) {
                const res = await customerService.updateCustomer(
                    initialData.id,
                    formData,
                );
                savedId = initialData.id; // Lấy ID từ initialData khi update
                toast.success("Thành công", "Cập nhật khách hàng thành công");
            } else {
                const res = await customerService.createCustomer(formData);
                savedId = res.data?.id; // Lấy ID từ response khi tạo mới
                toast.success("Thành công", "Tạo khách hàng thành công");
            }

            // Upload ảnh nếu có (cho cả tạo mới và cập nhật)
            if (photoFile && savedId) {
                try {
                    setIsUploadingPhoto(true);
                    console.log("📤 Bắt đầu upload ảnh...", {
                        customerId: savedId,
                        fileName: photoFile.name,
                        fileSize: photoFile.size,
                        fileType: photoFile.type,
                    });

                    const uploadRes = await customerService.uploadCustomerPhoto(
                        savedId,
                        photoFile,
                    );

                    if (uploadRes.success) {
                        console.log(
                            "✅ Upload ảnh thành công:",
                            uploadRes.data,
                        );
                        toast.success(
                            "Thành công",
                            "Upload ảnh khách hàng thành công",
                        );
                    } else {
                        console.error("❌ Upload ảnh thất bại:", uploadRes);
                        toast.error(
                            "Lỗi",
                            uploadRes.message || "Upload ảnh thất bại",
                        );
                    }
                } catch (uploadError: any) {
                    console.error("❌ Lỗi upload ảnh:", uploadError);
                    const errorMessage =
                        uploadError?.response?.data?.message ||
                        uploadError?.message ||
                        "Lỗi không xác định";

                    console.error("Chi tiết lỗi:", {
                        status: uploadError?.response?.status,
                        data: uploadError?.response?.data,
                        message: errorMessage,
                    });

                    toast.error(
                        "Cảnh báo",
                        `Lưu thông tin thành công nhưng upload ảnh thất bại: ${errorMessage}`,
                    );
                } finally {
                    setIsUploadingPhoto(false);
                }
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
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
            <div className="p-6 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                        {initialData
                            ? "Chỉnh sửa khách hàng"
                            : "Thêm khách hàng mới"}
                    </h2>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Nhập thông tin khách hàng và chụp ảnh
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Phần ảnh khách hàng - Layout 2 cột */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                        {/* Cột trái: Preview ảnh */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">
                                Ảnh đại diện
                            </Label>
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative">
                                    <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-white dark:border-neutral-700 shadow-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                                        {photoPreview ? (
                                            <img
                                                src={photoPreview}
                                                alt="Ảnh khách hàng"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center px-3">
                                                <svg
                                                    className="w-16 h-16 mx-auto text-neutral-300 dark:text-neutral-600 mb-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                                <span className="text-xs text-neutral-400 dark:text-neutral-500">
                                                    Chưa có ảnh
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {photoPreview && (
                                        <button
                                            type="button"
                                            onClick={handleRemovePhoto}
                                            className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg flex items-center justify-center font-bold transition-all hover:scale-110">
                                            ×
                                        </button>
                                    )}
                                </div>

                                {/* Nút điều khiển */}
                                {!isCameraOpen && (
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleOpenCamera}>
                                            <span className="mr-1">📷</span>
                                            Mở camera
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }>
                                            <span className="mr-1">📁</span>
                                            Chọn file
                                        </Button>
                                    </div>
                                )}

                                {/* Hidden file input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoChange}
                                />
                            </div>
                        </div>

                        {/* Cột phải: Camera view */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">
                                Chụp ảnh trực tiếp
                            </Label>
                            {isCameraOpen ? (
                                <div className="space-y-3">
                                    <div className="relative overflow-hidden rounded-xl border-2 border-primary shadow-lg">
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            className="w-full h-auto bg-black"
                                            style={{ maxHeight: "300px" }}
                                        />
                                    </div>
                                    <div className="flex justify-center gap-2">
                                        <Button
                                            type="button"
                                            variant="primary"
                                            size="sm"
                                            onClick={handleCapturePhoto}>
                                            <span className="mr-1">📸</span>
                                            Chụp ảnh
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCloseCamera}>
                                            Đóng camera
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full min-h-50 flex items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl">
                                    <div className="text-center px-4">
                                        <svg
                                            className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                            Nhấn "Mở camera" để bắt đầu
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Canvas ẩn để capture ảnh */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Phần thông tin khách hàng */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white border-b pb-2">
                            Thông tin cá nhân
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">
                                    Tên khách hàng{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Nhập tên khách hàng"
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
                                    Email{" "}
                                    <span className="text-red-500">*</span>
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
                                <Label htmlFor="rank">Hạng khách hàng</Label>
                                <Select
                                    options={ranks.map((r) => ({
                                        value: r.value,
                                        label: `${r.displayName} (${r.discountPercent}% giảm giá)`,
                                    }))}
                                    value={formData.rank || "BRONZE"}
                                    onChange={handleRankChange}
                                    placeholder="Chọn hạng khách hàng"
                                    className="h-10 w-full"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="address">Địa chỉ</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Nhập địa chỉ"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="customerNotes">Ghi chú</Label>
                                <textarea
                                    id="customerNotes"
                                    name="customerNotes"
                                    value={formData.customerNotes || ""}
                                    onChange={handleChange}
                                    placeholder="Ghi chú về sở thích, phong cách chơi..."
                                    className="h-24 w-full rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer với nút actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
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
                                  : "Tạo mới"}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
