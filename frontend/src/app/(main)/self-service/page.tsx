"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/context/ToastContext";
import customerService from "@/services/customerService";
import sessionService from "@/services/sessionService";
import { ICustomerResponse } from "@/types/customer";
import { Camera, X, CheckCircle, User, Phone, Star } from "lucide-react";
import tableService from "@/services/tableService";
import { ITableResponse } from "@/types/table";

export default function SelfServicePage() {
    const { showToast } = useToast();

    // States
    const [step, setStep] = useState<"scan" | "select-table" | "confirm">(
        "scan",
    );
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [recognizedCustomer, setRecognizedCustomer] =
        useState<ICustomerResponse | null>(null);
    const [customerPhone, setCustomerPhone] = useState("");
    const [tables, setTables] = useState<ITableResponse[]>([]);
    const [selectedTable, setSelectedTable] = useState<ITableResponse | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    // Assign stream to video element
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, isCameraOpen]);

    const handleOpenCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
            });
            setStream(mediaStream);
            setIsCameraOpen(true);
        } catch (error) {
            console.error("Error accessing camera:", error);
            showToast(
                "Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.",
                "error",
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

        // Set canvas size to video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob
        canvas.toBlob(async (blob) => {
            if (!blob) {
                showToast("Không thể chụp ảnh", "error");
                return;
            }

            setIsLoading(true);
            try {
                const file = new File([blob], "face.jpg", {
                    type: "image/jpeg",
                });

                // Call face recognition API
                const response = await customerService.recognizeFace(file);

                if (response.data?.matched && response.data.customer) {
                    setRecognizedCustomer(response.data.customer);
                    showToast(
                        `Xin chào ${response.data.customer.name}!`,
                        "success",
                    );
                    handleCloseCamera();

                    // Load available tables
                    await loadAvailableTables();
                    setStep("select-table");
                } else {
                    showToast(
                        response.data?.message ||
                            "Không nhận diện được khuôn mặt. Vui lòng thử lại.",
                        "error",
                    );
                }
            } catch (error: any) {
                console.error("Error recognizing face:", error);
                showToast(
                    error.response?.data?.message ||
                        "Lỗi khi nhận diện khuôn mặt",
                    "error",
                );
            } finally {
                setIsLoading(false);
            }
        }, "image/jpeg");
    };

    const loadAvailableTables = async () => {
        try {
            const response = await tableService.getAvailableTablesByBranch(1); // TODO: Get branch from context
            setTables(response.data || []);
        } catch (error) {
            console.error("Error loading tables:", error);
            showToast("Không thể tải danh sách bàn", "error");
        }
    };

    const handleSelectTable = (table: ITableResponse) => {
        setSelectedTable(table);
        setStep("confirm");
    };

    const handleStartSession = async () => {
        if (!recognizedCustomer || !selectedTable) return;

        if (!customerPhone) {
            showToast("Vui lòng nhập số điện thoại liên hệ", "warning");
            return;
        }

        setIsLoading(true);
        try {
            await sessionService.startSelfServiceSession({
                tableId: selectedTable.id,
                customerId: recognizedCustomer.id,
                customerPhone: customerPhone,
                notes: "Tự phục vụ",
            });

            showToast(
                "Bắt đầu phiên chơi thành công! Chúc bạn chơi vui vẻ!",
                "success",
            );

            // Reset
            setTimeout(() => {
                setStep("scan");
                setRecognizedCustomer(null);
                setSelectedTable(null);
                setCustomerPhone("");
            }, 2000);
        } catch (error: any) {
            console.error("Error starting session:", error);
            showToast(
                error.response?.data?.message || "Không thể bắt đầu phiên chơi",
                "error",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold text-center mb-8">
                🎱 Tự Phục Vụ - Kiosk
            </h1>

            {/* Step 1: Face Scan */}
            {step === "scan" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Bước 1: Quét khuôn mặt</CardTitle>
                        <CardDescription>
                            Nhìn vào camera để chúng tôi nhận diện bạn
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!isCameraOpen ? (
                            <div className="text-center">
                                <Button
                                    onClick={handleOpenCamera}
                                    size="lg"
                                    className="w-full max-w-md">
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
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                                        onClick={handleCloseCamera}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <canvas ref={canvasRef} className="hidden" />
                                <Button
                                    onClick={handleCapture}
                                    disabled={isLoading}
                                    className="w-full"
                                    size="lg">
                                    {isLoading
                                        ? "Đang nhận diện..."
                                        : "Chụp và Nhận diện"}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Select Table */}
            {step === "select-table" && recognizedCustomer && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                                Chào mừng, {recognizedCustomer.name}!
                            </CardTitle>
                            <CardDescription className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    {recognizedCustomer.phoneNumber}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    Hạng:{" "}
                                    {recognizedCustomer.rankDisplayName ||
                                        "Chưa có hạng"}
                                </div>
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Bước 2: Chọn bàn</CardTitle>
                            <CardDescription>
                                Chọn bàn bạn muốn chơi
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {tables.map((table) => (
                                    <Button
                                        key={table.id}
                                        variant="outline"
                                        className="h-24 flex flex-col items-center justify-center gap-2"
                                        onClick={() =>
                                            handleSelectTable(table)
                                        }>
                                        <div className="text-lg font-bold">
                                            {table.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {table.typeDisplayName}
                                        </div>
                                    </Button>
                                ))}
                            </div>
                            {tables.length === 0 && (
                                <div className="text-center text-muted-foreground py-8">
                                    Hiện không có bàn trống
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Step 3: Confirm */}
            {step === "confirm" && recognizedCustomer && selectedTable && (
                <Card>
                    <CardHeader>
                        <CardTitle>Bước 3: Xác nhận</CardTitle>
                        <CardDescription>
                            Kiểm tra thông tin và nhập số điện thoại liên hệ
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">Khách hàng:</span>
                                <span>{recognizedCustomer.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Bàn:</span>
                                <span>
                                    {selectedTable.name} -{" "}
                                    {selectedTable.typeDisplayName}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                <span className="font-medium">Hạng:</span>
                                <span>
                                    {recognizedCustomer.rankDisplayName ||
                                        "Chưa có hạng"}
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
                                placeholder="Nhập số điện thoại của bạn"
                                value={customerPhone}
                                onChange={(e) =>
                                    setCustomerPhone(e.target.value)
                                }
                            />
                            <p className="text-sm text-muted-foreground">
                                Số điện thoại này sẽ được dùng để liên hệ nếu
                                cần thiết
                            </p>
                        </div>

                        <div className="flex gap-4">
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
                                {isLoading ? "Đang xử lý..." : "Bắt đầu chơi"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
