"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/ui/form/Label";
import Button from "@/components/ui/button/Button";
import { useCustomers } from "@/hooks/useCustomer";
import { ITableBilliardResponse } from "@/types/tableBilliard";
import sessionService from "@/services/sessionService";
import { useToast } from "@/context/ToastContext";
import { Loader2 } from "lucide-react";

interface StartSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    table: ITableBilliardResponse | null;
    onSuccess: () => void;
}

export const StartSessionModal: React.FC<StartSessionModalProps> = ({
    isOpen,
    onClose,
    table,
    onSuccess,
}) => {
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
        null,
    );
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    // Fetch all customers for selection
    const { customers, isLoading: isLoadingCustomers } = useCustomers(
        "",
        undefined,
        { page: 0, size: 1000 },
    );

    useEffect(() => {
        if (isOpen) {
            setSelectedCustomerId(null);
            setNotes("");
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!table) {
            toast.error("Lỗi", "Bàn không hợp lệ");
            return;
        }

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

            // Call onSuccess to refresh data
            onSuccess();

            // Delay closing modal so user can see the success message
            setTimeout(() => {
                onClose();
                setIsSubmitting(false);
            }, 800);
        } catch (error: any) {
            toast.error(
                "Lỗi",
                error.response?.data?.message || "Không thể mở bàn",
            );
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold">Mở bàn {table?.name}</h2>
                    <p className="text-sm text-gray-500">
                        Chọn khách hàng (tùy chọn) để áp dụng ưu đãi thành viên
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="customer">Khách hàng (tùy chọn)</Label>
                        {isLoadingCustomers ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                        ) : (
                            <select
                                id="customer"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                value={selectedCustomerId || ""}
                                onChange={(e) =>
                                    setSelectedCustomerId(
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null,
                                    )
                                }>
                                <option value="">-- Khách vãng lai --</option>
                                {customers.map((customer) => (
                                    <option
                                        key={customer.id}
                                        value={customer.id}>
                                        {customer.name} - {customer.phoneNumber}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Ghi chú</Label>
                        <textarea
                            id="notes"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Ghi chú về phiên chơi..."
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                "Mở bàn"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
