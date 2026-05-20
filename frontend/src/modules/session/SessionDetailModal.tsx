"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { useSession } from "@/hooks/useSession";
import sessionService from "@/services/sessionService";
import invoiceService from "@/services/invoiceService";
import { useToast } from "@/context/ToastContext";
import { Loader2, Clock, User, DollarSign } from "lucide-react";
import { AddProductsTab } from "./tabs/AddProductsTab";
import { AddEquipmentsTab } from "./tabs/AddEquipmentsTab";
import { AddCombosTab } from "./tabs/AddCombosTab";
import { SessionItemsTab } from "./tabs/SessionItemsTab";
import { ConfirmEndSessionModal } from "./ConfirmEndSessionModal";
import { PaymentCompletedModal } from "./PaymentCompletedModal";
import { calculateRoundedDuration } from "@/utils/sessionCalculations";
import { ISessionWithDetails } from "@/types/session";
import { IInvoice } from "@/types/invoice";

interface SessionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    sessionId: number;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
    isOpen,
    onClose,
    sessionId,
}) => {
    const { session, isLoading, mutate } = useSession(sessionId);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isEndingSession, setIsEndingSession] = useState(false);
    const [sessionDetails, setSessionDetails] =
        useState<ISessionWithDetails | null>(null);
    const [invoice, setInvoice] = useState<IInvoice | null>(null);
    const [isLoadingPaymentData, setIsLoadingPaymentData] = useState(false);
    const [isCompletingPayment, setIsCompletingPayment] = useState(false);
    const toast = useToast();

    // Check for pending payment on mount and page reload
    useEffect(() => {
        const checkPendingPayment = async () => {
            const pending = localStorage.getItem("pendingPayment");
            if (pending) {
                try {
                    const { sessionId: pendingSessionId } = JSON.parse(pending);
                    if (pendingSessionId === sessionId) {
                        // Load session details and invoice
                        await loadPaymentData(sessionId);
                    }
                } catch (error) {
                    console.error("Error loading pending payment:", error);
                }
            }
        };

        if (isOpen) {
            checkPendingPayment();
        }
    }, [isOpen, sessionId]);

    const loadPaymentData = async (sessionId: number, retryCount = 0) => {
        setIsLoadingPaymentData(true);
        try {
            console.log("========== LOADING PAYMENT DATA (MODAL) ==========");
            console.log("Session ID:", sessionId);
            console.log("Retry attempt:", retryCount + 1);

            // Load session details first
            const sessionDetailsRes = await sessionService.getSessionWithDetails(sessionId);
            console.log("\n=== SESSION DETAILS RESPONSE (MODAL) ===");
            console.log("Full response:", sessionDetailsRes);
            console.log("Response data:", sessionDetailsRes?.data);
            console.log("Response structure:", JSON.stringify(sessionDetailsRes, null, 2));

            if (!sessionDetailsRes.data) {
                throw new Error("Không có dữ liệu session");
            }

            setSessionDetails(sessionDetailsRes.data);

            // Then load invoice - with retry logic for async invoice creation
            try {
                const invoiceRes = await invoiceService.getInvoiceBySessionId(sessionId);
                console.log("\n=== INVOICE RESPONSE (MODAL) ===");
                console.log("Full response:", invoiceRes);
                console.log("Response data:", invoiceRes?.data);
                console.log("Data type:", typeof invoiceRes?.data);
                console.log("Data is null:", invoiceRes?.data === null);
                console.log("Data is undefined:", invoiceRes?.data === undefined);
                console.log("Response structure:", JSON.stringify(invoiceRes, null, 2));

                if (!invoiceRes?.data) {
                    // Invoice might not be created yet (async event), retry up to 5 times
                    if (retryCount < 5) {
                        console.log("Invoice not ready (data is null/undefined), retrying in 500ms...");
                        await new Promise(resolve => setTimeout(resolve, 500));
                        return loadPaymentData(sessionId, retryCount + 1);
                    }
                    throw new Error("Không có dữ liệu hóa đơn sau 5 lần thử");
                }

                console.log("\n=== SETTING INVOICE (MODAL) ===");
                console.log("Invoice to set:", invoiceRes.data);
                setInvoice(invoiceRes.data);
            } catch (invoiceError: any) {
                console.error("\n=== INVOICE FETCH ERROR (MODAL) ===");
                console.error("Full error:", invoiceError);
                console.log("Error response:", invoiceError?.response);
                console.log("Error status:", invoiceError?.response?.status);
                console.log("Error data:", invoiceError?.response?.data);
                console.log("Error message:", invoiceError?.message);
                
                // If 404, invoice not created yet - retry
                if (invoiceError?.response?.status === 404 && retryCount < 5) {
                    console.log("Invoice not found (404), retrying in 500ms...");
                    await new Promise(resolve => setTimeout(resolve, 500));
                    return loadPaymentData(sessionId, retryCount + 1);
                }
                
                // Otherwise, throw to outer catch
                throw invoiceError;
            }

            console.log("\n=== OPENING PAYMENT MODAL (MODAL) ===");
            console.log("Session details state:", sessionDetails);
            console.log("Invoice state:", invoice);
            console.log("Show payment modal:", true);
            setShowPaymentModal(true);
        } catch (error: any) {
            console.error("\n=== PAYMENT DATA LOADING ERROR (MODAL) ===");
            console.error("Full error:", error);
            toast.error(
                "Lỗi",
                error.response?.data?.message || error.message ||
                    "Không thể tải thông tin thanh toán",
            );
        } finally {
            setIsLoadingPaymentData(false);
        }
    };

    const handleEndSession = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmEnd = async () => {
        setIsEndingSession(true);
        try {
            // End session - backend will automatically create invoice
            await sessionService.endSession(sessionId);

            toast.success("Thành công", "Đã kết thúc phiên chơi");

            // Close confirm modal
            setShowConfirmModal(false);

            // Load payment data
            await loadPaymentData(sessionId);
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

    const handleCompletePayment = async () => {
        setIsCompletingPayment(true);
        try {
            // Clear pending payment from localStorage
            localStorage.removeItem("pendingPayment");

            toast.success("Thành công", "Đã hoàn tất thanh toán");

            // Close all modals
            setShowPaymentModal(false);
            mutate();
            onClose();
        } catch (error: any) {
            toast.error("Lỗi", "Có lỗi xảy ra");
        } finally {
            setIsCompletingPayment(false);
        }
    };

    if (isLoading || !session) {
        return (
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                className="max-w-4xl max-h-[90vh] p-8">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </Modal>
        );
    }

    const startTime = new Date(session.startTime);
    const now = new Date();
    const durationMs = now.getTime() - startTime.getTime();
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor(
        (durationMs % (1000 * 60 * 60)) / (1000 * 60),
    );
    const roundedDuration = calculateRoundedDuration(startTime, now);

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                className="max-w-4xl max-h-[90vh] overflow-y-auto p-8">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold">
                            Bàn #{session.tableId} - {session.tableType}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Quản lý phiên chơi đang hoạt động
                        </p>
                    </div>

                    {/* Session Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-500" />
                            <div>
                                <p className="text-xs text-gray-500">
                                    Khách hàng
                                </p>
                                <p className="font-medium">
                                    {session.customerName}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {session.customerPhone}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-green-500" />
                            <div>
                                <p className="text-xs text-gray-500">
                                    Thời gian chơi
                                </p>
                                <p className="font-medium">
                                    {durationHours}h {durationMinutes}m
                                </p>
                                <p className="text-xs text-gray-500">
                                    Tính tiền:{" "}
                                    <span className="font-semibold text-green-600">
                                        {roundedDuration.toFixed(2)}h
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-yellow-500" />
                            <div>
                                <p className="text-xs text-gray-500">
                                    Loại bàn
                                </p>
                                <p className="font-medium">
                                    {session.tableType}
                                </p>
                                <Badge color="success" size="sm">
                                    {session.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="items" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="items">Danh sách</TabsTrigger>
                            <TabsTrigger value="products">Thêm SP</TabsTrigger>
                            <TabsTrigger value="equipments">
                                Thuê thiết bị
                            </TabsTrigger>
                            <TabsTrigger value="combos">Thêm Combo</TabsTrigger>
                        </TabsList>

                        <TabsContent value="items" className="space-y-4">
                            <SessionItemsTab
                                sessionId={sessionId}
                                onUpdate={mutate}
                            />
                        </TabsContent>

                        <TabsContent value="products" className="space-y-4">
                            <AddProductsTab
                                sessionId={sessionId}
                                onSuccess={mutate}
                            />
                        </TabsContent>

                        <TabsContent value="equipments" className="space-y-4">
                            <AddEquipmentsTab
                                sessionId={sessionId}
                                onSuccess={mutate}
                            />
                        </TabsContent>

                        <TabsContent value="combos" className="space-y-4">
                            <AddCombosTab
                                sessionId={sessionId}
                                onSuccess={mutate}
                            />
                        </TabsContent>
                    </Tabs>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button variant="outline" onClick={onClose}>
                            Đóng
                        </Button>
                        <Button
                            onClick={handleEndSession}
                            disabled={isEndingSession}
                            variant="danger">
                            Kết thúc phiên & Thanh toán
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Confirm End Session Modal */}
            <ConfirmEndSessionModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmEnd}
                isLoading={isEndingSession}
                tableName={session?.tableName}
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
