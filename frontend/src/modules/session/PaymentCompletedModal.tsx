"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import {
    Loader2,
    Receipt,
    CheckCircle2,
    Clock,
    User,
    Package,
    Wrench,
    ShoppingBag,
} from "lucide-react";
import { ISessionWithDetails } from "@/types/session";
import { IInvoice } from "@/types/invoice";
import { formatCurrency } from "@/utils/formatCurrency";

interface PaymentCompletedModalProps {
    isOpen: boolean;
    sessionDetails: ISessionWithDetails | null;
    invoice: IInvoice | null;
    isLoading: boolean;
    onCompletePayment: () => void;
    isCompletingPayment: boolean;
}

export const PaymentCompletedModal: React.FC<PaymentCompletedModalProps> = ({
    isOpen,
    sessionDetails,
    invoice,
    isLoading,
    onCompletePayment,
    isCompletingPayment,
}) => {
    const [countdown, setCountdown] = useState(0);

    // Prevent closing by escape or clicking outside
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        document.addEventListener("keydown", handleKeyDown, true);
        return () =>
            document.removeEventListener("keydown", handleKeyDown, true);
    }, [isOpen]);

    // Save to localStorage to handle page reload
    useEffect(() => {
        if (isOpen && sessionDetails) {
            localStorage.setItem(
                "pendingPayment",
                JSON.stringify({
                    sessionId: sessionDetails.id,
                    timestamp: Date.now(),
                }),
            );
        }
    }, [isOpen, sessionDetails]);

    if (!isOpen) return null;

    if (isLoading || !sessionDetails || !invoice) {
        return (
            <Modal
                isOpen={isOpen}
                onClose={() => {}}
                className="max-w-4xl"
                showCloseButton={false}>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                        <p className="text-gray-600">
                            Đang xử lý thanh toán và tạo hóa đơn...
                        </p>
                    </div>
                </div>
            </Modal>
        );
    }

    const startTime = new Date(sessionDetails.startTime);
    const endTime = sessionDetails.endTime
        ? new Date(sessionDetails.endTime)
        : new Date();

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {}}
            className="max-w-5xl max-h-[90vh] overflow-hidden"
            showCloseButton={false}>
            <div className="flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-linear-to-r from-green-600 to-green-700 p-6">
                    <div className="flex items-center gap-4 text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold">
                                Phiên chơi đã kết thúc
                            </h2>
                            <p className="text-green-100 text-sm">
                                {sessionDetails.tableName} -{" "}
                                {sessionDetails.tableType}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-green-100">Mã hóa đơn</p>
                            <p className="text-xl font-bold">
                                {invoice.invoiceNumber}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Warning Banner */}
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                        <div className="flex items-start gap-3">
                            <Receipt className="w-5 h-5 text-amber-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold text-amber-900">
                                    Vui lòng hoàn tất thanh toán
                                </p>
                                <p className="text-sm text-amber-700 mt-1">
                                    Hóa đơn đã được tạo và lưu vào hệ thống. Bạn
                                    cần xác nhận thanh toán để đóng màn hình
                                    này.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Session Info */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <User className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">
                                    Khách hàng
                                </span>
                            </div>
                            <p className="font-semibold text-gray-900">
                                {sessionDetails.customerName ||
                                    "Khách vãng lai"}
                            </p>
                            {sessionDetails.customerPhone && (
                                <p className="text-sm text-gray-600">
                                    {sessionDetails.customerPhone}
                                </p>
                            )}
                        </div>

                        <div className="bg-green-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-medium text-green-900">
                                    Thời gian
                                </span>
                            </div>
                            <p className="font-semibold text-gray-900">
                                {sessionDetails.durationHours.toFixed(2)} giờ
                            </p>
                            <p className="text-sm text-gray-600">
                                {startTime.toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}{" "}
                                -{" "}
                                {endTime.toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Receipt className="w-5 h-5 text-purple-600" />
                                <span className="text-sm font-medium text-purple-900">
                                    Trạng thái
                                </span>
                            </div>
                            <Badge color="success" size="sm">
                                {invoice.status}
                            </Badge>
                            <p className="text-sm text-gray-600 mt-1">
                                {new Date(invoice.invoiceDate).toLocaleString(
                                    "vi-VN",
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Items Details */}
                    <div className="space-y-4">
                        {/* Products */}
                        {sessionDetails.products.length > 0 && (
                            <div className="border rounded-lg overflow-hidden">
                                <div className="bg-orange-50 px-4 py-2 flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-orange-600" />
                                    <span className="font-semibold text-orange-900">
                                        Sản phẩm (
                                        {sessionDetails.products.length})
                                    </span>
                                </div>
                                <div className="divide-y">
                                    {sessionDetails.products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="px-4 py-3 flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">
                                                    {product.productName}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {product.quantity} x{" "}
                                                    {formatCurrency(
                                                        product.unitPrice,
                                                    )}
                                                </p>
                                            </div>
                                            <span className="font-semibold text-green-600">
                                                {formatCurrency(
                                                    product.totalAmount,
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Equipments */}
                        {sessionDetails.equipments.length > 0 && (
                            <div className="border rounded-lg overflow-hidden">
                                <div className="bg-purple-50 px-4 py-2 flex items-center gap-2">
                                    <Wrench className="w-5 h-5 text-purple-600" />
                                    <span className="font-semibold text-purple-900">
                                        Thiết bị (
                                        {sessionDetails.equipments.length})
                                    </span>
                                </div>
                                <div className="divide-y">
                                    {sessionDetails.equipments.map(
                                        (equipment) => (
                                            <div
                                                key={equipment.id}
                                                className="px-4 py-3 flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium">
                                                        {
                                                            equipment.equipmentName
                                                        }
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {equipment.quantity} x{" "}
                                                        {formatCurrency(
                                                            equipment.hourlyRate,
                                                        )}
                                                        /giờ ×{" "}
                                                        {equipment.durationHours?.toFixed(
                                                            2,
                                                        )}
                                                        h
                                                    </p>
                                                </div>
                                                <span className="font-semibold text-green-600">
                                                    {formatCurrency(
                                                        equipment.totalAmount ||
                                                            0,
                                                    )}
                                                </span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Combos */}
                        {sessionDetails.combos.length > 0 && (
                            <div className="border rounded-lg overflow-hidden">
                                <div className="bg-green-50 px-4 py-2 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-green-600" />
                                    <span className="font-semibold text-green-900">
                                        Combo ({sessionDetails.combos.length})
                                    </span>
                                </div>
                                <div className="divide-y">
                                    {sessionDetails.combos.map((combo) => (
                                        <div
                                            key={combo.id}
                                            className="px-4 py-3 flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">
                                                    {combo.comboName}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {combo.quantity} x{" "}
                                                    {formatCurrency(
                                                        combo.price,
                                                    )}
                                                </p>
                                            </div>
                                            <span className="font-semibold text-green-600">
                                                {formatCurrency(
                                                    combo.totalAmount,
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Invoice Summary */}
                    <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                        <div className="flex justify-between text-lg">
                            <span className="text-gray-700">Tạm tính:</span>
                            <span className="font-semibold">
                                {formatCurrency(invoice.subtotal)}
                            </span>
                        </div>
                        {invoice.discountAmount > 0 && (
                            <div className="flex justify-between text-lg text-red-600">
                                <span>
                                    Giảm giá ({invoice.discountPercent}%):
                                </span>
                                <span className="font-semibold">
                                    -{formatCurrency(invoice.discountAmount)}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between text-2xl font-bold text-green-600 pt-3 border-t-2 border-gray-300">
                            <span>Tổng cộng:</span>
                            <span>{formatCurrency(invoice.totalAmount)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t bg-gray-50 p-6">
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-sm text-gray-600">
                            ⚠️ Vui lòng xác nhận đã nhận tiền từ khách hàng
                            trước khi hoàn tất
                        </p>
                        <Button
                            onClick={onCompletePayment}
                            disabled={isCompletingPayment}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                            {isCompletingPayment ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    Xác nhận đã thanh toán
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
