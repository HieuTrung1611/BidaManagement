import { IProductResponse } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, Ellipsis } from "lucide-react";
import { useMemo } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown/dropdown-menu";
import Badge from "@/components/ui/badge/Badge";

export const useProductColumns = () => {
    const columns = useMemo<ColumnDef<IProductResponse>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Tên sản phẩm",
                size: 260,
                cell: ({ row }) => {
                    const product = row.original;
                    return (
                        <div className="font-medium text-foreground">
                            {product.name}
                        </div>
                    );
                },
            },
            {
                accessorKey: "type",
                header: "Loại",
                size: 160,
                cell: ({ row }) => {
                    const type = row.original.type;
                    return (
                        <Badge
                            color={type === "FOOD" ? "warning" : "info"}
                            variant="light">
                            {type === "FOOD" ? "Đồ ăn" : "Đồ uống"}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "purchasePrice",
                header: "Giá nhập",
                size: 160,
                cell: ({ row }) => {
                    const price = row.original.purchasePrice;
                    return (
                        <span className="text-gray-600">
                            {price.toLocaleString("vi-VN")} đ
                        </span>
                    );
                },
            },
            {
                accessorKey: "salePrice",
                header: "Giá bán",
                size: 160,
                cell: ({ row }) => {
                    const price = row.original.salePrice;
                    return (
                        <span className="font-medium text-green-600">
                            {price.toLocaleString("vi-VN")} đ
                        </span>
                    );
                },
            },
            {
                accessorKey: "stockQuantity",
                header: "Tồn kho",
                size: 120,
                cell: ({ row }) => {
                    const stock = row.original.stockQuantity;
                    const isLowStock = stock < 10;
                    return (
                        <Badge
                            color={isLowStock ? "error" : "success"}
                            variant="light">
                            {stock} {row.original.unit}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "branchName",
                header: "Chi nhánh",
                size: 220,
            },
            {
                accessorKey: "isActive",
                header: "Trạng thái",
                size: 150,
                cell: ({ row }) => {
                    const isActive = row.original.isActive;
                    return (
                        <Badge
                            color={isActive ? "success" : "error"}
                            variant="light">
                            {isActive ? "Hoạt động" : "Ngưng bán"}
                        </Badge>
                    );
                },
            },
        ],
        [],
    );

    return { columns };
};

export const renderProductActions = (
    product: IProductResponse,
    onEdit?: (product: IProductResponse) => void,
    onDelete?: (product: IProductResponse) => void,
) => {
    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Ellipsis className="h-5 w-5" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {onEdit && (
                        <DropdownMenuItem
                            onClick={() => onEdit(product)}
                            className="gap-2">
                            <Edit className="h-4 w-4" />
                            Chỉnh sửa
                        </DropdownMenuItem>
                    )}
                    {onDelete && (
                        <DropdownMenuItem
                            onClick={() => onDelete(product)}
                            className="gap-2 text-red-600 focus:text-red-600">
                            <Trash2 className="h-4 w-4" />
                            Xóa
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
