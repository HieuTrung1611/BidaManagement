"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmEndSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
    tableName?: string;
}

export const ConfirmEndSessionModal: React.FC<
    ConfirmEndSessionModalProps
> = ({ isOpen, onClose, onConfirm, isLoading, tableName }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-md"
            showCloseButton={!isLoading}>
            <div className="space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-amber-600" />
                    </div>
                </div>

                {/* Content */}
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">
                        Xác nhận kết thúc phiên chơi
                    </h3>
                    <p className="text-gray-600">
                        Bạn có chắc chắn muốn kết thúc phiên chơi{" "}
                        {tableName && (
                            <span className="font-semibold">{tableName}</span>
                        )}{" "}
                        không?
                    </p>
                    <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                        ⚠️ Sau khi xác nhận, hệ thống sẽ tính toán và tạo hóa
                        đơn. Bạn sẽ cần hoàn tất thanh toán trước khi có thể
                        tiếp tục.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={onClose}
                        disabled={isLoading}>
                        Hủy
                    </Button>
                    <Button
                        variant="danger"
                        className="flex-1"
                        onClick={onConfirm}
                        disabled={isLoading}>
                        {isLoading ? "Đang xử lý..." : "Xác nhận kết thúc"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
