"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/ui/form/Label";
import { useEquipments } from "@/hooks/useEquipment";
import { useManagedBranch } from "@/hooks/useManagedBranch";
import sessionService from "@/services/sessionService";
import { useToast } from "@/context/ToastContext";
import { Loader2, Plus } from "lucide-react";

interface AddEquipmentsTabProps {
    sessionId: number;
    onSuccess: () => void;
}

export const AddEquipmentsTab: React.FC<AddEquipmentsTabProps> = ({
    sessionId,
    onSuccess,
}) => {
    const { managedBranchId } = useManagedBranch();
    const [equipmentId, setEquipmentId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    // Fetch active equipments
    const { equipments, isLoading } = useEquipments(
        undefined,
        undefined,
        true,
        { page: 0, size: 1000 },
        managedBranchId,
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!equipmentId) {
            toast.error("Lỗi", "Vui lòng chọn thiết bị");
            return;
        }

        setIsSubmitting(true);
        try {
            await sessionService.rentEquipment({
                sessionId,
                equipmentId,
                quantity,
            });

            toast.success("Thành công", "Thuê thiết bị thành công");
            setEquipmentId(null);
            setQuantity(1);
            onSuccess();
        } catch (error: any) {
            toast.error(
                "Lỗi",
                error.response?.data?.message || "Không thể thuê thiết bị",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedEquipment = equipments.find((e) => e.id === equipmentId);

    const getEquipmentTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            STICK: "Cơ",
            CHALK: "Phấn",
            GLOVES: "Găng tay",
            BRIDGE: "Chống",
            OTHER: "Khác",
        };
        return labels[type] || type;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="equipment">
                    Thiết bị <span className="text-red-500">*</span>
                </Label>
                {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                ) : (
                    <select
                        id="equipment"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={equipmentId || ""}
                        onChange={(e) => setEquipmentId(Number(e.target.value))}
                        required>
                        <option value="">-- Chọn thiết bị --</option>
                        {equipments.map((equipment) => (
                            <option key={equipment.id} value={equipment.id}>
                                {equipment.name} -{" "}
                                {equipment.rentalPricePerHour.toLocaleString(
                                    "vi-VN",
                                )}{" "}
                                VNĐ/giờ (Còn: {equipment.availableQuantity}/
                                {equipment.totalQuantity})
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
                    max={selectedEquipment?.availableQuantity || 999}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                />
                {selectedEquipment && (
                    <p className="text-xs text-gray-500">
                        Tối đa: {selectedEquipment.availableQuantity} thiết bị
                    </p>
                )}
            </div>

            {selectedEquipment && (
                <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Thông tin thiết bị</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="text-gray-600">Loại:</span>
                            <span className="ml-2 font-medium">
                                {getEquipmentTypeLabel(selectedEquipment.type)}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">Giá thuê:</span>
                            <span className="ml-2 font-medium text-green-600">
                                {selectedEquipment.rentalPricePerHour.toLocaleString(
                                    "vi-VN",
                                )}{" "}
                                VNĐ/giờ
                            </span>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs text-amber-600">
                                * Tính phí theo thời gian thực tế sử dụng
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !equipmentId}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang thuê...
                    </>
                ) : (
                    <>
                        <Plus className="w-4 h-4 mr-2" />
                        Thuê thiết bị
                    </>
                )}
            </Button>
        </form>
    );
};
