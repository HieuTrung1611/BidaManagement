"use client";

import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import Label from "@/components/ui/form/Label";
import { ITableBilliardResponse } from "@/types/tableBilliard";
import { IBilliardSessionResponse } from "@/types/session";
import { useSession, useSessions } from "@/hooks/useSession";
import { useCustomers } from "@/hooks/useCustomer";
import { ICustomerResponse } from "@/types/customer";
import sessionService from "@/services/sessionService";
import customerService from "@/services/customerService";
import { useToast } from "@/context/ToastContext";
import { getCustomerRankDisplay } from "@/utils/customerUtils";
import {
    Loader2,
    Clock,
    User,
    DollarSign,
    X,
    Play,
    List,
    ShoppingBag,
    Wrench,
    Package,
    Camera,
    CheckCircle,
    Star,
} from "lucide-react";
import { AddProductsTab } from "./tabs/AddProductsTab";
import { AddEquipmentsTab } from "./tabs/AddEquipmentsTab";
import { AddCombosTab } from "./tabs/AddCombosTab";
import { SessionItemsTab } from "./tabs/SessionItemsTab";
import { ConfirmEndSessionModal } from "./ConfirmEndSessionModal";
import { PaymentCompletedModal } from "./PaymentCompletedModal";
import { calculateRoundedDuration } from "@/utils/sessionCalculations";
import { ISessionWithDetails } from "@/types/session";
import { IInvoice } from "@/types/invoice";
import invoiceService from "@/services/invoiceService";

interface SessionDetailCardProps {
    table: ITableBilliardResponse | null;
    session: IBilliardSessionResponse | null;
    onClose: () => void;
    onSuccess: () => void;
}

export const SessionDetailCard: React.FC<SessionDetailCardProps> = ({
    table,
    session,
    onClose,
    onSuccess,
}) => {
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
        null,
    );
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isEndingSession, setIsEndingSession] = useState(false);
    const [sessionDetails, setSessionDetails] =
        useState<ISessionWithDetails | null>(null);
    const [invoice, setInvoice] = useState<IInvoice | null>(null);
    const [isLoadingPaymentData, setIsLoadingPaymentData] = useState(false);
    const [isCompletingPayment, setIsCompletingPayment] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Face scanning states
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [recognizedCustomer, setRecognizedCustomer] =
        useState<ICustomerResponse | null>(null);
    const [isScanningFace, setIsScanningFace] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const toast = useToast();
    const { customers, isLoading: isLoadingCustomers } = useCustomers("", {
        page: 0,
        size: 1000,
    });

    // Fetch active session for this table
    const { sessions: activeSessions, mutate: mutateSessions } = useSessions(
        table?.id,
        undefined,
        "ONGOING",
        { page: 0, size: 1 },
        undefined,
        !!table?.id,
    );

    const activeSession = activeSessions?.[0] || session;

    // Check for pending payment on component mount (only once per session)
    useEffect(() => {
        const checkPendingPayment = async () => {
            const pending = localStorage.getItem("pendingPayment");
            if (
                pending &&
                activeSession &&
                !showPaymentModal &&
                !isLoadingPaymentData
            ) {
                try {
                    const { sessionId: pendingSessionId } = JSON.parse(pending);
                    if (pendingSessionId === activeSession.id) {
                        // Load session details and invoice
                        await loadPaymentData(activeSession.id);
                    }
                } catch (error) {
                    console.error("Error loading pending payment:", error);
                }
            }
        };

        if (activeSession) {
            checkPendingPayment();
        }
    }, [activeSession?.id, showPaymentModal, isLoadingPaymentData]);

    useEffect(() => {
        setSelectedCustomerId(null);
        setNotes("");
        setRecognizedCustomer(null);
        handleCloseCamera();
    }, [table?.id]);

    // Camera stream effect
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, isCameraOpen]);

    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    // Auto-update timer every second for active session
    useEffect(() => {
        if (!activeSession) return;

        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, [activeSession]);

    const loadPaymentData = async (sessionId: number, retryCount = 0) => {
        setIsLoadingPaymentData(true);
        try {
            console.log("========== LOADING PAYMENT DATA ==========");
            console.log("Session ID:", sessionId);
            console.log("Retry attempt:", retryCount + 1);

            // Load session details first
            const sessionDetailsRes =
                await sessionService.getSessionWithDetails(sessionId);
            console.log("\n=== SESSION DETAILS RESPONSE ===");
            console.log("Full response:", sessionDetailsRes);
            console.log("Response data:", sessionDetailsRes?.data);
            console.log(
                "Response structure:",
                JSON.stringify(sessionDetailsRes, null, 2),
            );

            if (!sessionDetailsRes.data) {
                throw new Error("Không có dữ liệu session");
            }

            setSessionDetails(sessionDetailsRes.data);

            // Then load invoice - with retry logic for async invoice creation
            try {
                const invoiceRes =
                    await invoiceService.getInvoiceBySessionId(sessionId);
                console.log("\n=== INVOICE RESPONSE ===");
                console.log("Full response:", invoiceRes);
                console.log("Response data:", invoiceRes?.data);
                console.log("Data type:", typeof invoiceRes?.data);
                console.log("Data is null:", invoiceRes?.data === null);
                console.log(
                    "Data is undefined:",
                    invoiceRes?.data === undefined,
                );
                console.log(
                    "Response structure:",
                    JSON.stringify(invoiceRes, null, 2),
                );

                if (!invoiceRes?.data) {
                    // Invoice might not be created yet (async event), retry up to 5 times
                    if (retryCount < 5) {
                        console.log(
                            "Invoice not ready (data is null/undefined), retrying in 500ms...",
                        );
                        await new Promise((resolve) =>
                            setTimeout(resolve, 500),
                        );
                        return loadPaymentData(sessionId, retryCount + 1);
                    }
                    throw new Error("Không có dữ liệu hóa đơn sau 5 lần thử");
                }

                console.log("\n=== SETTING INVOICE ===");
                console.log("Invoice to set:", invoiceRes.data);
                setInvoice(invoiceRes.data);
            } catch (invoiceError: any) {
                console.error("\n=== INVOICE FETCH ERROR ===");
                console.error("Full error:", invoiceError);
                console.log("Error response:", invoiceError?.response);
                console.log("Error status:", invoiceError?.response?.status);
                console.log("Error data:", invoiceError?.response?.data);
                console.log("Error message:", invoiceError?.message);

                // If 404, invoice not created yet - retry
                if (invoiceError?.response?.status === 404 && retryCount < 5) {
                    console.log(
                        "Invoice not found (404), retrying in 500ms...",
                    );
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    return loadPaymentData(sessionId, retryCount + 1);
                }

                // Otherwise, throw to outer catch
                throw invoiceError;
            }

            console.log("\n=== OPENING PAYMENT MODAL ===");
            console.log("Session details state:", sessionDetails);
            console.log("Invoice state:", invoice);
            console.log("Show payment modal:", true);
            setShowPaymentModal(true);
        } catch (error: any) {
            console.error("\n=== PAYMENT DATA LOADING ERROR ===");
            console.error("Full error:", error);
            toast.error(
                "Lỗi",
                error.response?.data?.message ||
                    error.message ||
                    "Không thể tải thông tin thanh toán",
            );
        } finally {
            setIsLoadingPaymentData(false);
        }
    };

    const handleStartSession = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!table) return;

        setIsSubmitting(true);
        try {
            const res = await sessionService.startSession({
                tableId: table.id,
                customerId: selectedCustomerId,
                notes: notes || undefined,
            });

            toast.success(
                "Thành công",
                `Đã mở ${table.name} - ${selectedCustomerId ? "Khách thành viên" : "Khách vãng lai"}`,
            );

            // Refresh both tables and sessions
            onSuccess();
            mutateSessions();
            setIsSubmitting(false);
        } catch (error: any) {
            toast.error(
                "Lỗi",
                error.response?.data?.message || "Không thể mở bàn",
            );
            setIsSubmitting(false);
        }
    };

    const handleEndSession = () => {
        if (!activeSession) return;
        setShowConfirmModal(true);
    };

    const handleConfirmEnd = async () => {
        if (!activeSession) return;

        setIsEndingSession(true);
        try {
            // End session - backend will automatically create invoice
            await sessionService.endSession(activeSession.id);

            toast.success("Thành công", "Đã kết thúc phiên chơi");

            // Close confirm modal
            setShowConfirmModal(false);

            // Load payment data
            await loadPaymentData(activeSession.id);

            // Refresh sessions
            mutateSessions();
        } catch (error: any) {
            toast.error(
                "Lỗi",
                error.response?.data?.message ||
                    "Không thể kết thúc phiên chơi",
            );
        } finally {
            setIsEndingSession(false);
        }
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
            toast.error(
                "Lỗi",
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

    const handleCaptureFace = async () => {
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
                toast.error("Lỗi", "Không thể chụp ảnh");
                return;
            }

            setIsScanningFace(true);
            try {
                const file = new File([blob], "face.jpg", {
                    type: "image/jpeg",
                });
                const branchId = table?.branch?.id;
                const response = await customerService.recognizeFace(
                    file,
                    branchId,
                );

                if (response.data?.matched && response.data.customer) {
                    const customer = response.data.customer;
                    setRecognizedCustomer(customer);
                    setSelectedCustomerId(customer.id);
                    toast.success(
                        "Thành công",
                        `Nhận diện thành công: ${customer.name}!`,
                    );
                    handleCloseCamera();
                } else {
                    toast.error(
                        "Không tìm thấy",
                        response.data?.message ||
                            "Không nhận diện được khuôn mặt. Vui lòng thử lại.",
                    );
                }
            } catch (error: any) {
                console.error("Error recognizing face:", error);
                toast.error(
                    "Lỗi",
                    error.response?.data?.message ||
                        "Lỗi khi nhận diện khuôn mặt",
                );
            } finally {
                setIsScanningFace(false);
            }
        }, "image/jpeg");
    };

    const handleCompletePayment = async () => {
        setIsCompletingPayment(true);
        try {
            // Clear pending payment from localStorage
            localStorage.removeItem("pendingPayment");

            toast.success("Thành công", "Đã hoàn tất thanh toán");

            // Close all modals
            setShowPaymentModal(false);
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error("Lỗi", "Có lỗi xảy ra");
        } finally {
            setIsCompletingPayment(false);
        }
    };

    if (!table) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <div className="flex items-center justify-center h-[calc(100vh-200px)] text-gray-400">
                    <div className="text-center">
                        <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Chọn một bàn</p>
                        <p className="text-sm">
                            để bắt đầu hoặc quản lý phiên chơi
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const displaySession = activeSession;

    return (
        <>
            <div className="bg-white rounded-lg shadow-lg sticky top-4 max-h-[calc(100vh-100px)] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-primary600 text-white p-4 rounded-t-lg">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-bold">{table.name}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {table.type?.name}
                        </span>
                        <span>
                            {table.type?.pricePerHour?.toLocaleString("vi-VN")}{" "}
                            VNĐ/giờ
                        </span>
                        <Badge
                            color={
                                table.status === "AVAILABLE"
                                    ? "success"
                                    : table.status === "IN_USE"
                                      ? "warning"
                                      : "error"
                            }>
                            {table.status === "AVAILABLE"
                                ? "Trống"
                                : table.status === "IN_USE"
                                  ? "Đang chơi"
                                  : "Bảo trì"}
                        </Badge>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    {!displaySession ? (
                        // Form mở bàn
                        <form
                            onSubmit={handleStartSession}
                            className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <Play className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <p className="text-center font-medium text-blue-900">
                                    Bàn đang trống
                                </p>
                                <p className="text-center text-sm text-blue-700">
                                    Chọn khách hàng và mở bàn để bắt đầu
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="customer">
                                        Khách hàng (tùy chọn)
                                    </Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={
                                            isCameraOpen
                                                ? handleCloseCamera
                                                : handleOpenCamera
                                        }
                                        className="flex items-center gap-2">
                                        <Camera className="w-4 h-4" />
                                        {isCameraOpen
                                            ? "Đóng camera"
                                            : "Quét mặt"}
                                    </Button>
                                </div>

                                {/* Camera View */}
                                {isCameraOpen && (
                                    <div className="space-y-2">
                                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <canvas
                                            ref={canvasRef}
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleCaptureFace}
                                            disabled={isScanningFace}
                                            className="w-full"
                                            size="sm">
                                            {isScanningFace ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Đang nhận diện...
                                                </>
                                            ) : (
                                                <>
                                                    <Camera className="w-4 h-4 mr-2" />
                                                    Chụp và Nhận diện
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}

                                {/* Recognized Customer Info */}
                                {recognizedCustomer && (
                                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-lg space-y-2">
                                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                            <CheckCircle className="h-5 w-5" />
                                            <span className="font-semibold">
                                                Nhận diện thành công!
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium">
                                                    {recognizedCustomer.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-600">
                                                    📞{" "}
                                                    {
                                                        recognizedCustomer.phoneNumber
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Star className="h-4 w-4 text-yellow-500" />
                                                <span className="font-medium">
                                                    Hạng:{" "}
                                                    {
                                                        getCustomerRankDisplay(
                                                            recognizedCustomer.rank,
                                                        ).displayName
                                                    }
                                                </span>
                                                <Badge color="warning">
                                                    -
                                                    {
                                                        getCustomerRankDisplay(
                                                            recognizedCustomer.rank,
                                                        ).discountPercent
                                                    }
                                                    %
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {isLoadingCustomers ? (
                                    <div className="flex items-center justify-center py-4">
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    </div>
                                ) : (
                                    <select
                                        id="customer"
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={selectedCustomerId || ""}
                                        onChange={(e) => {
                                            const customerId = e.target.value
                                                ? Number(e.target.value)
                                                : null;
                                            setSelectedCustomerId(customerId);
                                            // Update recognized customer if manually changed
                                            if (customerId) {
                                                const customer = customers.find(
                                                    (c) => c.id === customerId,
                                                );
                                                setRecognizedCustomer(
                                                    customer || null,
                                                );
                                            } else {
                                                setRecognizedCustomer(null);
                                            }
                                        }}>
                                        <option value="">
                                            -- Khách vãng lai --
                                        </option>
                                        {customers.map((customer) => (
                                            <option
                                                key={customer.id}
                                                value={customer.id}>
                                                {customer.name} -{" "}
                                                {customer.phoneNumber}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Ghi chú</Label>
                                <textarea
                                    id="notes"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Ghi chú về phiên chơi..."
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                size="md"
                                disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5 mr-2" />
                                        Mở bàn
                                    </>
                                )}
                            </Button>
                        </form>
                    ) : (
                        // Session đang hoạt động
                        <div className="space-y-4">
                            {/* Session Info Cards */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-blue-50 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <User className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs text-blue-600 font-medium">
                                            Khách hàng
                                        </span>
                                    </div>
                                    <p className="font-semibold text-sm truncate">
                                        {displaySession.customerName ||
                                            "Khách vãng lai"}
                                    </p>
                                    {displaySession.customerPhone && (
                                        <p className="text-xs text-gray-600">
                                            {displaySession.customerPhone}
                                        </p>
                                    )}
                                    {displaySession.customerRank && (
                                        <div className="flex items-center gap-1 mt-1">
                                            <Star className="w-3 h-3 text-yellow-500" />
                                            <span className="text-xs font-medium text-yellow-700">
                                                {displaySession.customerRank}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-green-50 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock className="w-4 h-4 text-green-600" />
                                        <span className="text-xs text-green-600 font-medium">
                                            Thời gian
                                        </span>
                                    </div>
                                    <p className="font-semibold text-sm">
                                        {(() => {
                                            const start = new Date(
                                                displaySession.startTime,
                                            );
                                            const ms =
                                                currentTime.getTime() -
                                                start.getTime();
                                            const h = Math.floor(
                                                ms / (1000 * 60 * 60),
                                            );
                                            const m = Math.floor(
                                                (ms % (1000 * 60 * 60)) /
                                                    (1000 * 60),
                                            );
                                            const s = Math.floor(
                                                (ms % (1000 * 60)) / 1000,
                                            );
                                            return `${h}h ${m}m ${s}s`;
                                        })()}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Tính tiền:{" "}
                                        <span className="font-semibold text-green-700">
                                            {calculateRoundedDuration(
                                                new Date(
                                                    displaySession.startTime,
                                                ),
                                                currentTime,
                                            ).toFixed(2)}
                                            h
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Tabs */}
                            <Tabs defaultValue="items" className="w-full">
                                <TabsList className="grid w-full grid-cols-4 gap-2 bg-transparent p-0">
                                    <TabsTrigger
                                        value="items"
                                        className="flex flex-col items-center gap-1 py-3 px-2 rounded-lg border-2 border-gray-200 bg-white data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 transition-all hover:border-blue-300 hover:shadow-sm">
                                        <List className="w-5 h-5" />
                                        <span className="text-xs font-medium">
                                            Danh sách
                                        </span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="products"
                                        className="flex flex-col items-center gap-1 py-3 px-2 rounded-lg border-2 border-gray-200 bg-white data-[state=active]:border-orange-500 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 transition-all hover:border-orange-300 hover:shadow-sm">
                                        <ShoppingBag className="w-5 h-5" />
                                        <span className="text-xs font-medium">
                                            Sản phẩm
                                        </span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="equipments"
                                        className="flex flex-col items-center gap-1 py-3 px-2 rounded-lg border-2 border-gray-200 bg-white data-[state=active]:border-purple-500 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 transition-all hover:border-purple-300 hover:shadow-sm">
                                        <Wrench className="w-5 h-5" />
                                        <span className="text-xs font-medium">
                                            Thiết bị
                                        </span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="combos"
                                        className="flex flex-col items-center gap-1 py-3 px-2 rounded-lg border-2 border-gray-200 bg-white data-[state=active]:border-green-500 data-[state=active]:bg-green-50 data-[state=active]:text-green-700 transition-all hover:border-green-300 hover:shadow-sm">
                                        <Package className="w-5 h-5" />
                                        <span className="text-xs font-medium">
                                            Combo
                                        </span>
                                    </TabsTrigger>
                                </TabsList>

                                <div className="mt-6 max-h-100 overflow-y-auto">
                                    <TabsContent
                                        value="items"
                                        className="mt-0 pt-4">
                                        <SessionItemsTab
                                            sessionId={displaySession.id}
                                            onUpdate={mutateSessions}
                                        />
                                    </TabsContent>

                                    <TabsContent
                                        value="products"
                                        className="mt-0 pt-4">
                                        <AddProductsTab
                                            sessionId={displaySession.id}
                                            onSuccess={mutateSessions}
                                        />
                                    </TabsContent>

                                    <TabsContent
                                        value="equipments"
                                        className="mt-0 pt-4">
                                        <AddEquipmentsTab
                                            sessionId={displaySession.id}
                                            onSuccess={mutateSessions}
                                        />
                                    </TabsContent>

                                    <TabsContent
                                        value="combos"
                                        className="mt-0 pt-4">
                                        <AddCombosTab
                                            sessionId={displaySession.id}
                                            onSuccess={mutateSessions}
                                        />
                                    </TabsContent>
                                </div>
                            </Tabs>

                            {/* End Session Button */}
                            <Button
                                onClick={handleEndSession}
                                disabled={showPaymentModal || isEndingSession}
                                variant="danger"
                                className="w-full"
                                size="md">
                                Kết thúc phiên & Thanh toán
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirm End Session Modal */}
            <ConfirmEndSessionModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmEnd}
                isLoading={isEndingSession}
                tableName={table?.name}
            />

            {/* Payment Completed Modal */}
            <PaymentCompletedModal
                isOpen={showPaymentModal}
                sessionDetails={sessionDetails}
                invoice={invoice}
                isLoading={isLoadingPaymentData}
                onCompletePayment={handleCompletePayment}
                isCompletingPayment={isCompletingPayment}
            />
        </>
    );
};
