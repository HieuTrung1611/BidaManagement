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

    // Live clock — updates every 30 s to show current elapsed rental time
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 30000);
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

    const totalAmount =
        products.reduce((sum, p) => sum + p.totalAmount, 0) +
        equipments.reduce((sum, e) => sum + (e.totalAmount || 0), 0) +
        combos.reduce((sum, c) => sum + c.totalAmount, 0);

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
                                        variant="ghost"
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
                            const liveHours = !equipment.isReturned
                                ? (now.getTime() -
                                      new Date(equipment.startTime).getTime()) /
                                  3_600_000
                                : null;
                            const displayHours = equipment.isReturned
                                ? equipment.durationHours
                                : liveHours;
                            const displayAmount = equipment.isReturned
                                ? equipment.totalAmount
                                : liveHours != null
                                  ? liveHours *
                                    equipment.hourlyRate *
                                    equipment.quantity
                                  : null;

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
                                            {displayHours != null && (
                                                <span
                                                    className={
                                                        !equipment.isReturned
                                                            ? "text-amber-600 font-medium"
                                                            : ""
                                                    }>
                                                    {" "}
                                                    ({displayHours.toFixed(2)}h
                                                    {!equipment.isReturned &&
                                                        " đang chạy"}
                                                    )
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {equipment.isReturned ? (
                                            <span className="font-semibold text-green-600">
                                                {equipment.totalAmount!.toLocaleString(
                                                    "vi-VN",
                                                )}{" "}
                                                VNĐ
                                            </span>
                                        ) : (
                                            <span className="font-semibold text-amber-600">
                                                ~
                                                {Math.round(
                                                    displayAmount ?? 0,
                                                ).toLocaleString("vi-VN")}{" "}
                                                VNĐ
                                            </span>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="ghost"
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
                                        variant="ghost"
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

            {/* Total */}
            {(products.length > 0 ||
                equipments.length > 0 ||
                combos.length > 0) && (
                <div className="pt-4 border-t">
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Tổng tạm tính:</span>
                        <span className="text-green-600">
                            {totalAmount.toLocaleString("vi-VN")} VNĐ
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 text-right mt-1">
                        * Chưa bao gồm tiền giờ chơi bàn và giảm giá
                    </p>
                </div>
            )}
        </div>
    );
};
