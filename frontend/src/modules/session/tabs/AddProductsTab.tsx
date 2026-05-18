"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/ui/form/Label";
import { useProducts } from "@/hooks/useProduct";
import { useManagedBranch } from "@/hooks/useManagedBranch";
import sessionService from "@/services/sessionService";
import { useToast } from "@/context/ToastContext";
import { Loader2, Plus } from "lucide-react";

interface AddProductsTabProps {
    sessionId: number;
    onSuccess: () => void;
}

export const AddProductsTab: React.FC<AddProductsTabProps> = ({
    sessionId,
    onSuccess,
}) => {
    const { managedBranchId } = useManagedBranch();
    const [productId, setProductId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    // Fetch active products
    const { products, isLoading } = useProducts(
        undefined,
        undefined,
        true,
        { page: 0, size: 1000 },
        managedBranchId,
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!productId) {
            toast.error("Lỗi", "Vui lòng chọn sản phẩm");
            return;
        }

        setIsSubmitting(true);
        try {
            await sessionService.addProduct({
                sessionId,
                productId,
                quantity,
            });

            toast.success("Thành công", "Thêm sản phẩm thành công");
            setProductId(null);
            setQuantity(1);
            onSuccess();
        } catch (error: any) {
            toast.error(
                "Lỗi",
                error.response?.data?.message || "Không thể thêm sản phẩm",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedProduct = products.find((p) => p.id === productId);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="product">
                    Sản phẩm <span className="text-red-500">*</span>
                </Label>
                {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                ) : (
                    <select
                        id="product"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={productId || ""}
                        onChange={(e) => setProductId(Number(e.target.value))}
                        required>
                        <option value="">-- Chọn sản phẩm --</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name} -{" "}
                                {product.salePrice.toLocaleString("vi-VN")} VNĐ
                                (Còn: {product.stockQuantity})
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
                    max={selectedProduct?.stockQuantity || 999}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                />
                {selectedProduct && (
                    <p className="text-xs text-gray-500">
                        Tối đa: {selectedProduct.stockQuantity}{" "}
                        {selectedProduct.unit}
                    </p>
                )}
            </div>

            {selectedProduct && (
                <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Thông tin sản phẩm</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="text-gray-600">Loại:</span>
                            <span className="ml-2 font-medium">
                                {selectedProduct.type === "FOOD"
                                    ? "Đồ ăn"
                                    : "Đồ uống"}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">Đơn giá:</span>
                            <span className="ml-2 font-medium text-green-600">
                                {selectedProduct.salePrice.toLocaleString(
                                    "vi-VN",
                                )}{" "}
                                VNĐ
                            </span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-gray-600">Tổng:</span>
                            <span className="ml-2 font-bold text-green-600">
                                {(
                                    selectedProduct.salePrice * quantity
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
                disabled={isSubmitting || !productId}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang thêm...
                    </>
                ) : (
                    <>
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm sản phẩm
                    </>
                )}
            </Button>
        </form>
    );
};
