"use client";

import React, { useState, useRef, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/input/InputField";
import Label from "@/components/ui/form/Label";
import { useToast } from "@/context/ToastContext";
import customerService from "@/services/customerService";
import sessionService from "@/services/sessionService";
import { ICustomerResponse } from "@/types/customer";
import { Camera, X, CheckCircle, User, Phone, Star } from "lucide-react";
import { ITableBilliardResponse } from "@/types/tableBilliard";
import { getCustomerRankDisplay } from "@/utils/customerUtils";

interface FaceScanModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    availableTables: ITableBilliardResponse[];
    branchId?: number;
}

export const FaceScanModal: React.FC<FaceScanModalProps> = ({
    open,
    onClose,
    onSuccess,
    availableTables,
    branchId,
}) => {
    const {
        success: showSuccess,
        error: showError,
        warning: showWarning,
    } = useToast();

    const [step, setStep] = useState<"scan" | "select-table" | "confirm">(
        "scan",
    );
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [recognizedCustomer, setRecognizedCustomer] =
        useState<ICustomerResponse | null>(null);
    const [customerPhone, setCustomerPhone] = useState("");
    const [selectedTable, setSelectedTable] =
        useState<ITableBilliardResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Cleanup camera on unmount or close
    useEffect(() => {
        if (!open) {
            handleCloseCamera();
            resetModal();
        }
    }, [open]);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, isCameraOpen]);

    const resetModal = () => {
        setStep("scan");
        setRecognizedCustomer(null);
        setCustomerPhone("");
        setSelectedTable(null);
        setIsLoading(false);
    };

    const handleOpenCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
            });
            setStream(mediaStream);
            setIsCameraOpen(true);
        } catch (error) {
            console.error("Error accessing camera:", error);
            showError(
                "Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.",
            );
        }
    };

    const handleCloseCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

    const handleCapture = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            if (!blob) {
                showError("Không thể chụp ảnh");
                return;
            }

            setIsLoading(true);
            try {
                const file = new File([blob], "face.jpg", {
                    type: "image/jpeg",
                });
                const response = await customerService.recognizeFace(
                    file,
                    branchId,
                );

                if (response.data?.matched && response.data.customer) {
                    setRecognizedCustomer(response.data.customer);
                    showSuccess(
                        `Nhận diện thành công: ${response.data.customer.name}!`,
                    );
                    handleCloseCamera();
                    setStep("select-table");
                } else {
                    showError(
                        response.data?.message ||
                            "Không nhận diện được khuôn mặt. Vui lòng thử lại.",
                    );
                }
            } catch (error: any) {
                console.error("Error recognizing face:", error);
                showError(
                    error.response?.data?.message ||
                        "Lỗi khi nhận diện khuôn mặt",
                );
            } finally {
                setIsLoading(false);
            }
        }, "image/jpeg");
    };

    const handleSelectTable = (table: ITableBilliardResponse) => {
        setSelectedTable(table);
        setStep("confirm");
    };

    const handleStartSession = async () => {
        if (!recognizedCustomer || !selectedTable) return;

        if (!customerPhone) {
            showWarning("Vui lòng nhập số điện thoại liên hệ");
            return;
        }

        setIsLoading(true);
        try {
            await sessionService.startSelfServiceSession({
                tableId: selectedTable.id,
                customerId: recognizedCustomer.id,
                customerPhone: customerPhone,
                notes: "Quét mặt tại quầy",
            });

            showSuccess("Bắt đầu phiên chơi thành công!");
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error starting session:", error);
            showError(
                error.response?.data?.message || "Không thể bắt đầu phiên chơi",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={open} onClose={onClose} className="max-w-3xl">
            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        🎭 Quét mặt khách hàng
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {step === "scan" && "Bước 1: Nhận diện khuôn mặt"}
                        {step === "select-table" && "Bước 2: Chọn bàn"}
                        {step === "confirm" && "Bước 3: Xác nhận thông tin"}
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Step 1: Face Scan */}
                    {step === "scan" && (
                        <>
                            {!isCameraOpen ? (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground mb-4">
                                        Bật camera để quét khuôn mặt khách hàng
                                    </p>
                                    <Button
                                        onClick={handleOpenCamera}
                                        size="sm">
                                        <Camera className="mr-2 h-5 w-5" />
                                        Bật Camera
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            className="w-full h-full object-cover"
                                        />
                                        <Button
                                            variant="danger"
                                            size="icon"
                                            className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                                            onClick={handleCloseCamera}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <canvas
                                        ref={canvasRef}
                                        className="hidden"
                                    />
                                    <Button
                                        onClick={handleCapture}
                                        disabled={isLoading}
                                        className="w-full"
                                        size="sm">
                                        {isLoading
                                            ? "Đang nhận diện..."
                                            : "Chụp và Nhận diện"}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Step 2: Select Table */}
                    {step === "select-table" && recognizedCustomer && (
                        <>
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg space-y-2">
                                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                    <CheckCircle className="h-5 w-5" />
                                    <span className="font-semibold">
                                        Nhận diện thành công:{" "}
                                        {recognizedCustomer.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    {recognizedCustomer.phoneNumber}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    Hạng:{" "}
                                    {
                                        getCustomerRankDisplay(
                                            recognizedCustomer.rank,
                                        ).displayName
                                    }
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-3">
                                    Chọn bàn trống:
                                </h3>
                                {availableTables.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-8">
                                        Hiện không có bàn trống
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                        {availableTables.map((table) => (
                                            <Button
                                                key={table.id}
                                                variant="outline"
                                                className="h-20 flex flex-col items-center justify-center gap-1"
                                                onClick={() =>
                                                    handleSelectTable(table)
                                                }>
                                                <div className="font-bold">
                                                    {table.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {table.type?.name ||
                                                        "Chưa xác định"}
                                                </div>
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Step 3: Confirm */}
                    {step === "confirm" &&
                        recognizedCustomer &&
                        selectedTable && (
                            <>
                                <div className="space-y-3 bg-muted p-4 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                        <span className="font-medium">
                                            Khách hàng:
                                        </span>
                                        <span>{recognizedCustomer.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                            Bàn:
                                        </span>
                                        <span>
                                            {selectedTable.name} -{" "}
                                            {selectedTable.type?.name ||
                                                "Chưa xác định"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star className="h-5 w-5 text-yellow-500" />
                                        <span className="font-medium">
                                            Hạng:
                                        </span>
                                        <span>
                                            {
                                                getCustomerRankDisplay(
                                                    recognizedCustomer.rank,
                                                ).displayName
                                            }
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">
                                        Số điện thoại liên hệ *
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="Nhập số điện thoại khách hàng"
                                        value={customerPhone}
                                        onChange={(e) =>
                                            setCustomerPhone(e.target.value)
                                        }
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Số điện thoại để liên hệ nếu khách hàng
                                        chưa thanh toán
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setStep("select-table");
                                            setSelectedTable(null);
                                        }}
                                        className="flex-1">
                                        Quay lại
                                    </Button>
                                    <Button
                                        onClick={handleStartSession}
                                        disabled={isLoading || !customerPhone}
                                        className="flex-1">
                                        {isLoading
                                            ? "Đang xử lý..."
                                            : "Bắt đầu phiên chơi"}
                                    </Button>
                                </div>
                            </>
                        )}
                </div>
            </div>
        </Modal>
    );
};
