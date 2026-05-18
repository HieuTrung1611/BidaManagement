"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { useSession } from "@/hooks/useSession";
import sessionService from "@/services/sessionService";
import { useToast } from "@/context/ToastContext";
import { Loader2, Clock, User, DollarSign } from "lucide-react";
import { AddProductsTab } from "./tabs/AddProductsTab";
import { AddEquipmentsTab } from "./tabs/AddEquipmentsTab";
import { AddCombosTab } from "./tabs/AddCombosTab";
import { SessionItemsTab } from "./tabs/SessionItemsTab";
import { InvoiceModal } from "./InvoiceModal";
import { useInvoicePreview } from "@/hooks/useInvoice";
import { IInvoiceDTO } from "@/types/invoice";

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
    const [isEndingSession, setIsEndingSession] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [sessionIdForInvoice, setSessionIdForInvoice] = useState<
        number | null
    >(null);
    const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
    const toast = useToast();

    // Fetch invoice preview when modal is shown
    const { invoice, isLoading: isLoadingInvoice } = useInvoicePreview(
        showInvoiceModal ? sessionIdForInvoice : null,
    );

    const handleEndSession = async () => {
        // Show invoice modal first
        setSessionIdForInvoice(sessionId);
        setShowInvoiceModal(true);
    };

    const handleConfirmPayment = async () => {
        if (!sessionIdForInvoice) return;

        try {
            setIsConfirmingPayment(true);
            // End session - backend will automatically create invoice
            await sessionService.endSession(sessionIdForInvoice);

            toast.success(
                "Thành công",
                "Đã kết thúc phiên chơi và lưu hóa đơn",
            );

            // Close modals and refresh
            setShowInvoiceModal(false);
            setSessionIdForInvoice(null);
            mutate();
            onClose();
        } catch (error: any) {
            toast.error(
                "Lỗi",
                error.response?.data?.message ||
                    "Không thể kết thúc phiên chơi",
            );
        } finally {
            setIsConfirmingPayment(false);
        }
    };

    const handleInvoiceClose = () => {
        setShowInvoiceModal(false);
        setSessionIdForInvoice(null);
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
                                    Bắt đầu:{" "}
                                    {startTime.toLocaleTimeString("vi-VN")}
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

            {/* Invoice Modal */}
            <InvoiceModal
                isOpen={showInvoiceModal}
                onClose={handleInvoiceClose}
                invoice={invoice}
                isLoading={isLoadingInvoice}
                onConfirm={handleConfirmPayment}
                isConfirming={isConfirmingPayment}
            />
        </>
    );
};
