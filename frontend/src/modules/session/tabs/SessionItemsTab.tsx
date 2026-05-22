"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import sessionService from "@/services/sessionService";
import {
    ISessionComboResponse,
    ISessionEquipmentResponse,
    ISessionProductResponse,
} from "@/types/session";
import { Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useInvoicePreview } from "@/hooks/useInvoice";
import {
    calculateRoundedDuration,
    calculateEquipmentCost,
    calculateTotal,
    calculateDiscount,
    roundHalfUp,
} from "@/utils/sessionCalculations";

interface SessionItemsTabProps {
    sessionId: number;
    onUpdate: () => void;
}

export const SessionItemsTab: React.FC<SessionItemsTabProps> = ({
    sessionId,
    onUpdate,
}) => {
    const [products, setProducts] = useState<ISessionProductResponse[]>([]);
    const [equipments, setEquipments] = useState<ISessionEquipmentResponse[]>(
        [],
    );
    const [combos, setCombos] = useState<ISessionComboResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [now, setNow] = useState(new Date());
    const toast = useToast();

    // Fetch invoice preview for pricing info
    const { invoice, isLoading: isLoadingInvoice } =
        useInvoicePreview(sessionId);

    // Live clock — updates every second for real-time calculation
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const [productsRes, equipmentsRes, combosRes] = await Promise.all([
                sessionService.getProductsBySession(sessionId),
                sessionService.getEquipmentsBySession(sessionId),
                sessionService.getCombosBySession(sessionId),
            ]);

            setProducts(productsRes.data || []);
            setEquipments(equipmentsRes.data || []);
            setCombos(combosRes.data || []);
        } catch (error) {
            toast.error("Lỗi", "Không thể tải danh sách items");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [sessionId]);

    const handleDeleteProduct = async (id: number) => {
        try {
            await sessionService.deleteSessionProduct(id);
            toast.success("Thành công", "Xóa sản phẩm thành công");
            fetchItems();
            onUpdate();
        } catch (error) {
            toast.error("Lỗi", "Không thể xóa sản phẩm");
        }
    };

    const handleDeleteEquipment = async (id: number) => {
        try {
            await sessionService.deleteSessionEquipment(id);
            toast.success("Thành công", "Xóa thiết bị thành công");
            fetchItems();
            onUpdate();
        } catch (error) {
            toast.error("Lỗi", "Không thể xóa thiết bị");
        }
    };

    const handleDeleteCombo = async (id: number) => {
        try {
            await sessionService.deleteSessionCombo(id);
            toast.success("Thành công", "Xóa combo thành công");
            fetchItems();
            onUpdate();
        } catch (error) {
            toast.error("Lỗi", "Không thể xóa combo");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    // Calculate real-time costs with proper rounding
    // Products cost - sum all products and round
    const productsCost = roundHalfUp(
        products.reduce((sum, p) => sum + p.totalAmount, 0),
        2,
    );

    // Equipments cost - NEW LOGIC: Equipment is charged 1 hour upfront
    const equipmentsCost = roundHalfUp(
        equipments.reduce((sum, e) => {
            // If totalAmount is set, equipment is already charged (new logic: 1 hour upfront)
            if (e.totalAmount !== null && e.totalAmount !== undefined) {
                return sum + e.totalAmount;
            }
            // Backward compatibility: Old equipment without totalAmount (shouldn't happen with new rentals)
            // Calculate with 1 hour charge
            const cost = calculateEquipmentCost(
                e.quantity,
                e.hourlyRate,
                new Date(e.startTime),
                now,
            );
            return sum + cost;
        }, 0),
        2,
    );

    // Combos cost - sum all combos and round
    const combosCost = roundHalfUp(
        combos.reduce((sum, c) => sum + c.totalAmount, 0),
        2,
    );

    // Total items cost (already rounded components)
    const itemsCost = calculateTotal([
        productsCost,
        equipmentsCost,
        combosCost,
    ]);

    // Calculate table rental cost with rounded duration
    let tableRentalCost = 0;
    let roundedDuration = 0;
    if (invoice) {
        const startTime = new Date(invoice.startTime);
        const endTime = invoice.endTime ? new Date(invoice.endTime) : now;
        roundedDuration = calculateRoundedDuration(startTime, endTime);
        // Calculate and round table rental cost (hourlyRate * duration)
        tableRentalCost = roundHalfUp(
            invoice.tableHourlyRate * roundedDuration,
            2,
        );
    }

    // Calculate subtotal with proper rounding
    const subtotal = calculateTotal([tableRentalCost, itemsCost]);

    // Calculate discount with proper rounding (like backend BigDecimal)
    let discountAmount = 0;
    let discountPercent = 0;
    if (
        invoice?.customerRank &&
        invoice.discountAmount > 0 &&
        invoice.subtotal > 0
    ) {
        // Calculate discount percent from invoice snapshot
        // Backend: discountAmount = subtotal * discountPercent / 100
        // So: discountPercent = discountAmount / subtotal * 100
        discountPercent = roundHalfUp(
            (invoice.discountAmount / invoice.subtotal) * 100,
            2,
        );
        // Apply discount percent to current subtotal
        discountAmount = calculateDiscount(subtotal, discountPercent);
    }

    // Grand total with proper rounding
    const grandTotal = roundHalfUp(subtotal - discountAmount, 2);

    return (
        <div className="space-y-6">
            {/* Products */}
            {products.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Badge color="warning">Sản phẩm</Badge>
                        <span className="text-sm text-gray-500">
                            ({products.length})
                        </span>
                    </h3>
                    <div className="space-y-2">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium">
                                        {product.productName}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {product.quantity} x{" "}
                                        {product.unitPrice.toLocaleString(
                                            "vi-VN",
                                        )}{" "}
                                        VNĐ
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-green-600">
                                        {product.totalAmount.toLocaleString(
                                            "vi-VN",
                                        )}{" "}
                                        VNĐ
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            handleDeleteProduct(product.id)
                                        }>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Equipments */}
            {equipments.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Badge color="info">Thiết bị</Badge>
                        <span className="text-sm text-gray-500">
                            ({equipments.length})
                        </span>
                    </h3>
                    <div className="space-y-2">
                        {equipments.map((equipment) => {
                            const startTime = new Date(equipment.startTime);
                            const endTime = equipment.endTime
                                ? new Date(equipment.endTime)
                                : now;

                            // NEW LOGIC: Equipment is charged 1 hour upfront
                            // If totalAmount is set, show it directly (no dynamic calculation)
                            const isCharged =
                                equipment.totalAmount !== null &&
                                equipment.totalAmount !== undefined;
                            const displayAmount = isCharged
                                ? equipment.totalAmount
                                : calculateEquipmentCost(
                                      equipment.quantity,
                                      equipment.hourlyRate,
                                      startTime,
                                      endTime,
                                  );

                            // For charged equipment, always show 1.00h
                            // For old equipment (backward compatibility), calculate duration
                            const displayHours = isCharged
                                ? 1.0
                                : calculateRoundedDuration(startTime, endTime);

                            return (
                                <div
                                    key={equipment.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium">
                                            {equipment.equipmentName}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {equipment.quantity} x{" "}
                                            {equipment.hourlyRate.toLocaleString(
                                                "vi-VN",
                                            )}{" "}
                                            VNĐ/giờ
                                            <span
                                                className={
                                                    isCharged
                                                        ? "text-green-600 font-medium"
                                                        : "text-amber-600 font-medium"
                                                }>
                                                {" "}
                                                ({displayHours.toFixed(2)}h
                                                {isCharged
                                                    ? " - Đã tính"
                                                    : " đang chạy"}
                                                )
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isCharged ? (
                                            <span className="font-semibold text-green-600">
                                                {displayAmount!.toLocaleString(
                                                    "vi-VN",
                                                )}{" "}
                                                VNĐ
                                            </span>
                                        ) : (
                                            <span className="font-semibold text-amber-600">
                                                ~
                                                {displayAmount!.toLocaleString(
                                                    "vi-VN",
                                                )}{" "}
                                                VNĐ
                                            </span>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                handleDeleteEquipment(
                                                    equipment.id,
                                                )
                                            }>
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Combos */}
            {combos.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Badge color="success">Combo</Badge>
                        <span className="text-sm text-gray-500">
                            ({combos.length})
                        </span>
                    </h3>
                    <div className="space-y-2">
                        {combos.map((combo) => (
                            <div
                                key={combo.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium">
                                        {combo.comboName}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {combo.quantity} x{" "}
                                        {combo.price.toLocaleString("vi-VN")}{" "}
                                        VNĐ
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-green-600">
                                        {combo.totalAmount.toLocaleString(
                                            "vi-VN",
                                        )}{" "}
                                        VNĐ
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            handleDeleteCombo(combo.id)
                                        }>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {products.length === 0 &&
                equipments.length === 0 &&
                combos.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>Chưa có items nào trong phiên chơi</p>
                        <p className="text-sm">
                            Sử dụng các tab bên trên để thêm items
                        </p>
                    </div>
                )}

            {/* Cost Breakdown */}
            {invoice && (
                <div className="pt-4 border-t space-y-3">
                    {/* Table Rental */}
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                            Tiền bàn ({invoice.tableType} -{" "}
                            {roundedDuration.toFixed(2)}h)
                        </span>
                        <span className="font-medium">
                            {tableRentalCost.toLocaleString("vi-VN")} VNĐ
                        </span>
                    </div>

                    {/* Items Cost */}
                    {itemsCost > 0 && (
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">
                                Sản phẩm & Dịch vụ
                            </span>
                            <span className="font-medium">
                                {itemsCost.toLocaleString("vi-VN")} VNĐ
                            </span>
                        </div>
                    )}

                    {/* Subtotal */}
                    <div className="flex justify-between items-center text-sm pt-2 border-t border-dashed">
                        <span className="text-gray-700 font-medium">
                            Tạm tính
                        </span>
                        <span className="font-semibold">
                            {subtotal.toLocaleString("vi-VN")} VNĐ
                        </span>
                    </div>

                    {/* Discount */}
                    {discountAmount > 0 && (
                        <div className="flex justify-between items-center text-sm text-red-600">
                            <span>
                                Giảm giá
                                {invoice.customerRank &&
                                    ` (${invoice.customerRank})`}
                            </span>
                            <span className="font-medium">
                                -{discountAmount.toLocaleString("vi-VN")} VNĐ
                            </span>
                        </div>
                    )}

                    {/* Grand Total */}
                    <div className="flex justify-between items-center text-lg font-bold pt-2 border-t">
                        <span>Tổng cộng</span>
                        <span className="text-green-600">
                            {grandTotal.toLocaleString("vi-VN")} VNĐ
                        </span>
                    </div>

                    <p className="text-xs text-gray-500 text-center">
                        * Tính toán theo mốc 15 phút (làm tròn lên)
                    </p>
                </div>
            )}

            {/* Loading Invoice Info */}
            {isLoadingInvoice && !invoice && (
                <div className="pt-4 border-t">
                    <div className="flex items-center justify-center py-4 text-gray-500 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Đang tải thông tin tính giá...
                    </div>
                </div>
            )}
        </div>
    );
};
