import { IComboResponse } from "@/types/combo";
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

export const useComboColumns = () => {
    const columns = useMemo<ColumnDef<IComboResponse>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Tên combo",
                size: 260,
                cell: ({ row }) => {
                    const combo = row.original;
                    return (
                        <div>
                            <div className="font-medium text-foreground">
                                {combo.name}
                            </div>
                            {combo.description && (
                                <div className="text-xs text-gray-500">
                                    {combo.description}
                                </div>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: "items",
                header: "Sản phẩm",
                size: 200,
                cell: ({ row }) => {
                    const items = row.original.items || [];
                    return (
                        <div className="flex flex-col gap-1">
                            <span className="text-sm">
                                {items.length} sản phẩm
                            </span>
                            <div className="flex flex-wrap gap-1">
                                {items.slice(0, 3).map((item, idx) => (
                                    <Badge
                                        key={idx}
                                        color={
                                            item.itemType === "PRODUCT"
                                                ? "warning"
                                                : "info"
                                        }
                                        variant="light"
                                        className="text-xs">
                                        {item.itemName} x{item.quantity}
                                    </Badge>
                                ))}
                                {items.length > 3 && (
                                    <span className="text-xs text-gray-500">
                                        +{items.length - 3}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: "regularPrice",
                header: "Giá gốc",
                size: 140,
                cell: ({ row }) => {
                    const price = row.original.regularPrice;
                    return (
                        <span className="text-gray-500 line-through">
                            {price.toLocaleString("vi-VN")} đ
                        </span>
                    );
                },
            },
            {
                accessorKey: "discountedPrice",
                header: "Giá combo",
                size: 140,
                cell: ({ row }) => {
                    const price = row.original.discountedPrice;
                    return (
                        <span className="font-medium text-green-600">
                            {price.toLocaleString("vi-VN")} đ
                        </span>
                    );
                },
            },
            {
                accessorKey: "savings",
                header: "Tiết kiệm",
                size: 140,
                cell: ({ row }) => {
                    const { savingsAmount, savingsPercent } = row.original;
                    return (
                        <div className="flex flex-col gap-0.5">
                            <Badge color="success" variant="light">
                                -{savingsPercent.toFixed(0)}%
                            </Badge>
                            <span className="text-xs text-gray-500">
                                {savingsAmount.toLocaleString("vi-VN")} đ
                            </span>
                        </div>
                    );
                },
            },
            {
                accessorKey: "branchName",
                header: "Chi nhánh",
                size: 200,
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

export const renderComboActions = (
    combo: IComboResponse,
    onEdit?: (combo: IComboResponse) => void,
    onDelete?: (combo: IComboResponse) => void,
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
                            onClick={() => onEdit(combo)}
                            className="gap-2">
                            <Edit className="h-4 w-4" />
                            Chỉnh sửa
                        </DropdownMenuItem>
                    )}
                    {onDelete && (
                        <DropdownMenuItem
                            onClick={() => onDelete(combo)}
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
