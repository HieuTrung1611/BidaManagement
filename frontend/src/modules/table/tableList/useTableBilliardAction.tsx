import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { ITableBilliardResponse } from "@/types/tableBilliard";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { useMemo } from "react";

const formatCurrency = (value?: number) =>
    (value ?? 0).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });

export const useTableBilliardActions = () => {
    const columns = useMemo<ColumnDef<ITableBilliardResponse>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Tên bàn",
                size: 180,
            },
            {
                accessorKey: "type",
                header: "Loại bàn",
                size: 180,
                cell: ({ row }) => row.original.type?.name || "-",
            },
            {
                accessorKey: "branch",
                header: "Chi nhánh",
                size: 220,
                cell: ({ row }) => row.original.branch?.name || "-",
            },
            {
                accessorKey: "pricePerHour",
                header: "Giá theo giờ",
                size: 170,
                cell: ({ row }) => {
                    const table = row.original;
                    return formatCurrency(
                        table.pricePerHour || table.type?.pricePerHour,
                    );
                },
            },
            {
                accessorKey: "description",
                header: "Mô tả",
                size: 280,
                cell: ({ row }) => row.original.description || "-",
            },
            {
                accessorKey: "createdAt",
                header: "Ngày tạo",
                size: 160,
                cell: ({ row }) => {
                    const createdAt = row.original.createdAt;
                    if (!createdAt) return "-";
                    return new Date(createdAt).toLocaleDateString("vi-VN");
                },
            },
        ],
        [],
    );

    return {
        columns,
    };
};

export const renderTableBilliardActions = (
    table: ITableBilliardResponse,
    options?: {
        canEdit?: boolean;
        canDelete?: boolean;
        onEdit?: (table: ITableBilliardResponse) => void;
        onDelete?: (table: ITableBilliardResponse) => void;
    },
) => {
    const canEdit = options?.canEdit ?? false;
    const canDelete = options?.canDelete ?? false;

    if (!canEdit && !canDelete) {
        return (
            <Badge color="light" variant="light">
                Chỉ xem
            </Badge>
        );
    }

    return (
        <div className="flex items-center gap-2">
            {canEdit && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => options?.onEdit?.(table)}
                    className="h-8 w-fit p-0"
                    startIcon={<Edit className="h-4 w-4" />}>
                    Sửa
                </Button>
            )}
            {canDelete && (
                <Button
                    variant="danger"
                    size="sm"
                    onClick={() => options?.onDelete?.(table)}
                    className="h-8 w-fit p-0 text-error hover:text-error hover:bg-error/10"
                    startIcon={<Trash2 className="h-4 w-4" />}>
                    Xóa
                </Button>
            )}
        </div>
    );
};
