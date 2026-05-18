"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/ui/form/Label";
import Badge from "@/components/ui/badge/Badge";
import { useCombos } from "@/hooks/useCombo";
import { useManagedBranch } from "@/hooks/useManagedBranch";
import sessionService from "@/services/sessionService";
import { useToast } from "@/context/ToastContext";
import { Loader2, Plus } from "lucide-react";

interface AddCombosTabProps {
    sessionId: number;
    onSuccess: () => void;
}

export const AddCombosTab: React.FC<AddCombosTabProps> = ({
    sessionId,
    onSuccess,
}) => {
    const { managedBranchId } = useManagedBranch();
    const [comboId, setComboId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    // Fetch active combos
    const { combos, isLoading } = useCombos(
        undefined,
        true,
        { page: 0, size: 1000 },
        managedBranchId,
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!comboId) {
            toast.error("Lỗi", "Vui lòng chọn combo");
            return;
        }

        setIsSubmitting(true);
        try {
            await sessionService.addCombo({
                sessionId,
                comboId,
                quantity,
            });

            toast.success("Thành công", "Thêm combo thành công");
            setComboId(null);
            setQuantity(1);
            onSuccess();
        } catch (error: any) {
            toast.error(
                "Lỗi",
                error.response?.data?.message || "Không thể thêm combo",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedCombo = combos.find((c) => c.id === comboId);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="combo">
                    Combo <span className="text-red-500">*</span>
                </Label>
                {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                ) : (
                    <select
                        id="combo"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={comboId || ""}
                        onChange={(e) => setComboId(Number(e.target.value))}
                        required>
                        <option value="">-- Chọn combo --</option>
                        {combos.map((combo) => (
                            <option key={combo.id} value={combo.id}>
                                {combo.name} -{" "}
                                {combo.discountedPrice.toLocaleString("vi-VN")}{" "}
                                VNĐ (Tiết kiệm:{" "}
                                {combo.savingsPercent.toFixed(0)}%)
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="quantity">
                    Số lượng <span className="text-red-500">*</span>
                </Label>
                <input
                    id="quantity"
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                />
            </div>

            {selectedCombo && (
                <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                    <h4 className="font-semibold">Chi tiết combo</h4>

                    {/* Items */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                            Bao gồm:
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {selectedCombo.items
                                .slice(0, 5)
                                .map((item, idx) => (
                                    <Badge
                                        key={idx}
                                        variant={
                                            item.itemType === "PRODUCT"
                                                ? "warning"
                                                : "info"
                                        }
                                        className="text-xs">
                                        {item.itemName} x{item.quantity}
                                    </Badge>
                                ))}
                            {selectedCombo.items.length > 5 && (
                                <Badge color="primary" className="text-xs">
                                    +{selectedCombo.items.length - 5} items
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Price Info */}
                    <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
                        <div>
                            <span className="text-gray-600">Giá gốc:</span>
                            <span className="ml-2 line-through text-gray-400">
                                {selectedCombo.regularPrice.toLocaleString(
                                    "vi-VN",
                                )}{" "}
                                VNĐ
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">Giá ưu đãi:</span>
                            <span className="ml-2 font-medium text-green-600">
                                {selectedCombo.discountedPrice.toLocaleString(
                                    "vi-VN",
                                )}{" "}
                                VNĐ
                            </span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-gray-600">
                                Tổng ({quantity} combo):
                            </span>
                            <span className="ml-2 font-bold text-green-600">
                                {(
                                    selectedCombo.discountedPrice * quantity
                                ).toLocaleString("vi-VN")}{" "}
                                VNĐ
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !comboId}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang thêm...
                    </>
                ) : (
                    <>
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm combo
                    </>
                )}
            </Button>
        </form>
    );
};
