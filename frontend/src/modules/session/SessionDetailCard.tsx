"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import Label from "@/components/ui/form/Label";
import { ITableBilliardResponse } from "@/types/tableBilliard";
import { IBilliardSessionResponse } from "@/types/session";
import { useSession, useSessions } from "@/hooks/useSession";
import { useCustomers } from "@/hooks/useCustomer";
import sessionService from "@/services/sessionService";
import { useToast } from "@/context/ToastContext";
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
} from "lucide-react";
import { AddProductsTab } from "./tabs/AddProductsTab";
import { AddEquipmentsTab } from "./tabs/AddEquipmentsTab";
import { AddCombosTab } from "./tabs/AddCombosTab";
import { SessionItemsTab } from "./tabs/SessionItemsTab";
import { InvoiceModal } from "./InvoiceModal";
import { useInvoicePreview } from "@/hooks/useInvoice";
import { IInvoiceDTO } from "@/types/invoice";

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
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [sessionIdForInvoice, setSessionIdForInvoice] = useState<
        number | null
    >(null);
    const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Fetch invoice preview when modal is shown
    const { invoice, isLoading: isLoadingInvoice } = useInvoicePreview(
        showInvoiceModal ? sessionIdForInvoice : null,
    );

    const toast = useToast();
    const { customers, isLoading: isLoadingCustomers } = useCustomers(
        "",
        undefined,
        { page: 0, size: 1000 },
    );

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

    useEffect(() => {
        setSelectedCustomerId(null);
        setNotes("");
    }, [table?.id]);

    // Auto-update timer every second for active session
    useEffect(() => {
        if (!activeSession) return;

        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, [activeSession]);

    const handleStartSession = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!table) return;

        setIsSubmitting(true);
        try {
            await sessionService.startSession({
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

    const handleEndSession = async () => {
        if (!displaySession?.id) return;

        // Show invoice modal first
        setSessionIdForInvoice(displaySession.id);
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

            // Close modal and refresh
            setShowInvoiceModal(false);
            setSessionIdForInvoice(null);
            onSuccess();
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
                                <Label htmlFor="customer">
                                    Khách hàng (tùy chọn)
                                </Label>
                                {isLoadingCustomers ? (
                                    <div className="flex items-center justify-center py-4">
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    </div>
                                ) : (
                                    <select
                                        id="customer"
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={selectedCustomerId || ""}
                                        onChange={(e) =>
                                            setSelectedCustomerId(
                                                e.target.value
                                                    ? Number(e.target.value)
                                                    : null,
                                            )
                                        }>
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
                                        Bắt đầu:{" "}
                                        {new Date(
                                            displaySession.startTime,
                                        ).toLocaleTimeString("vi-VN", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
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
                                disabled={showInvoiceModal}
                                variant="danger"
                                className="w-full"
                                size="md">
                                Kết thúc phiên & Thanh toán
                            </Button>
                        </div>
                    )}
                </div>
            </div>

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
