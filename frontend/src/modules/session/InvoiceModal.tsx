import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { IInvoiceDTO } from "@/types/invoice";
import { X, Loader2, Receipt } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoice: IInvoiceDTO | null | undefined;
    isLoading: boolean;
    onConfirm: () => void;
    isConfirming: boolean;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
    isOpen,
    onClose,
    invoice,
    isLoading,
    onConfirm,
    isConfirming,
}) => {
    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-4xl max-h-[90vh] overflow-hidden"
            showCloseButton={false}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-linear-to-r from-blue-600 to-blue-700">
                <div className="flex items-center gap-3 text-white">
                    <Receipt className="w-6 h-6" />
                    <div>
                        <h3 className="text-xl font-bold">
                            Hóa đơn thanh toán
                        </h3>
                        <p className="text-sm text-blue-100">
                            Xác nhận thông tin trước khi hoàn tất
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : invoice ? (
                    <div className="space-y-6">
                        {/* Branch Info */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">
                                {invoice.branchName}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {invoice.branchAddress}
                            </p>
                            <p className="text-sm text-gray-600">
                                SĐT: {invoice.branchPhone}
                            </p>
                        </div>

                        {/* Session Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Bàn</p>
                                <p className="font-semibold">
                                    {invoice.tableName} ({invoice.tableType})
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    Thời gian chơi
                                </p>
                                <p className="font-semibold">
                                    {invoice.durationHours.toFixed(2)} giờ
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Bắt đầu</p>
                                <p className="font-semibold">
                                    {new Date(invoice.startTime).toLocaleString(
                                        "vi-VN",
                                        {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        },
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    Kết thúc
                                </p>
                                <p className="font-semibold">
                                    {invoice.endTime
                                        ? new Date(
                                              invoice.endTime,
                                          ).toLocaleString("vi-VN", {
                                              day: "2-digit",
                                              month: "2-digit",
                                              year: "numeric",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          })
                                        : "N/A"}
                                </p>
                            </div>
                        </div>

                        {/* Customer Info */}
                        {invoice.customerName && (
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Thông tin khách hàng
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Tên
                                        </p>
                                        <p className="font-medium">
                                            {invoice.customerName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            SĐT
                                        </p>
                                        <p className="font-medium">
                                            {invoice.customerPhone}
                                        </p>
                                    </div>
                                </div>
                                {invoice.customerRank && (
                                    <p className="text-sm text-blue-700 mt-2">
                                        Hạng: {invoice.customerRank}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Items */}
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-semibold">
                                            Hạng mục
                                        </th>
                                        <th className="px-4 py-2 text-right text-sm font-semibold">
                                            Đơn giá
                                        </th>
                                        <th className="px-4 py-2 text-right text-sm font-semibold">
                                            SL
                                        </th>
                                        <th className="px-4 py-2 text-right text-sm font-semibold">
                                            Thành tiền
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {/* Table Rental */}
                                    <tr>
                                        <td className="px-4 py-3">
                                            Thuê bàn ({invoice.tableType})
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {formatCurrency(
                                                invoice.tableHourlyRate,
                                            )}
                                            /giờ
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {invoice.durationHours.toFixed(2)}h
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold">
                                            {formatCurrency(
                                                invoice.tableRentalCost,
                                            )}
                                        </td>
                                    </tr>

                                    {/* Products */}
                                    {invoice.products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="px-4 py-3">
                                                {product.productName}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {formatCurrency(
                                                    product.unitPrice,
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {product.quantity}
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold">
                                                {formatCurrency(
                                                    product.totalAmount,
                                                )}
                                            </td>
                                        </tr>
                                    ))}

                                    {/* Equipments */}
                                    {invoice.equipments.map((equipment) => (
                                        <tr key={equipment.id}>
                                            <td className="px-4 py-3">
                                                {equipment.equipmentName}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {formatCurrency(
                                                    equipment.hourlyRate,
                                                )}
                                                /giờ
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {equipment.quantity} ×{" "}
                                                {equipment.durationHours?.toFixed(
                                                    2,
                                                )}
                                                h
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold">
                                                {formatCurrency(
                                                    equipment.totalAmount,
                                                )}
                                            </td>
                                        </tr>
                                    ))}

                                    {/* Combos */}
                                    {invoice.combos.map((combo) => (
                                        <tr key={combo.comboId}>
                                            <td className="px-4 py-3">
                                                Combo: {combo.comboName}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {formatCurrency(combo.price)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {combo.quantity}
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold">
                                                {formatCurrency(
                                                    combo.totalAmount,
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-700">Tạm tính:</span>
                                <span className="font-semibold">
                                    {formatCurrency(invoice.subtotal)}
                                </span>
                            </div>
                            {invoice.discountAmount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>
                                        Giảm giá ({invoice.discountReason}):
                                    </span>
                                    <span className="font-semibold">
                                        -
                                        {formatCurrency(invoice.discountAmount)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold text-blue-600 pt-2 border-t">
                                <span>Tổng cộng:</span>
                                <span>
                                    {formatCurrency(invoice.totalAmount)}
                                </span>
                            </div>
                        </div>

                        {/* Notes */}
                        {invoice.notes && (
                            <div className="bg-yellow-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">
                                    Ghi chú:
                                </p>
                                <p className="text-gray-900">{invoice.notes}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        Không thể tải thông tin hóa đơn
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t bg-gray-50">
                <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isConfirming}
                    className="flex-1">
                    Hủy
                </Button>
                <Button
                    onClick={onConfirm}
                    disabled={isLoading || !invoice || isConfirming}
                    className="flex-1">
                    {isConfirming ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang xử lý...
                        </>
                    ) : (
                        "Hoàn thành thanh toán"
                    )}
                </Button>
            </div>
        </Modal>
    );
};
