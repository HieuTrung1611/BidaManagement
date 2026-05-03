import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { ITableBilliardTypeResponse } from "@/types/tableBilliardType";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Ellipsis, Trash2 } from "lucide-react";
import { useMemo } from "react";

const formatCurrency = (value: number) =>
    value.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });

export const useTableTypeActions = () => {
    const columns = useMemo<ColumnDef<ITableBilliardTypeResponse>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Tên loại bàn",
                size: 220,
            },
            {
                accessorKey: "pricePerHour",
                header: "Giá theo giờ",
                size: 180,
                cell: ({ row }) => {
                    const pricePerHour = row.getValue("pricePerHour") as number;
                    return formatCurrency(pricePerHour);
                },
            },
            {
                accessorKey: "costPrice",
                header: "Giá nhập",
                size: 180,
                cell: ({ row }) => {
                    const costPrice = row.getValue("costPrice") as number;
                    return formatCurrency(costPrice);
                },
            },
            {
                accessorKey: "supplier",
                header: "Nhà cung cấp",
                size: 200,
            },
            {
                accessorKey: "supplierPhone",
                header: "SĐT NCC",
                size: 160,
                cell: ({ row }) => {
                    const phone = row.getValue("supplierPhone") as string;
                    return (
                        <Badge color="info" variant="light">
                            {phone}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "description",
                header: "Mô tả",
                size: 280,
                cell: ({ row }) => {
                    const description = row.getValue("description") as
                        | string
                        | undefined;
                    return description && description.length > 0
                        ? description
                        : "-";
                },
            },
        ],
        [],
    );

    return {
        columns,
    };
};

export const renderTableTypeActions = (
    tableType: ITableBilliardTypeResponse,
    onEdit?: (tableType: ITableBilliardTypeResponse) => void,
    onDelete?: (tableType: ITableBilliardTypeResponse) => void,
) => {
    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(tableType)}
                className="h-8 w-fit p-0"
                startIcon={<Edit className="h-4 w-4" />}>
                Sửa
            </Button>
            <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete?.(tableType)}
                className="h-8 w-fit p-0 text-error hover:text-error hover:bg-error/10"
                startIcon={<Trash2 className="h-4 w-4" />}>
                Xóa
            </Button>
        </div>
    );
};
