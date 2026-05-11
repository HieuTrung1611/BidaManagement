import { IEquipmentResponse } from "@/types/equipment";
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

export const useEquipmentColumns = () => {
    const columns = useMemo<ColumnDef<IEquipmentResponse>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Tên thiết bị",
                size: 260,
                cell: ({ row }) => {
                    const equipment = row.original;
                    return (
                        <div className="font-medium text-foreground">
                            {equipment.name}
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
                    const typeLabels: Record<string, string> = {
                        STICK: "Cơ",
                        CHALK: "Phấn",
                        GLOVES: "Găng tay",
                        BRIDGE: "Chống",
                        OTHER: "Khác",
                    };
                    return (
                        <Badge color="info" variant="light">
                            {typeLabels[type] || type}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "rentalPricePerHour",
                header: "Giá thuê/giờ",
                size: 160,
                cell: ({ row }) => {
                    const price = row.original.rentalPricePerHour;
                    return (
                        <span className="font-medium text-green-600">
                            {price.toLocaleString("vi-VN")} đ/h
                        </span>
                    );
                },
            },
            {
                accessorKey: "availability",
                header: "Tình trạng",
                size: 160,
                cell: ({ row }) => {
                    const { availableQuantity, totalQuantity } = row.original;
                    const isAvailable = availableQuantity > 0;
                    return (
                        <div className="flex flex-col gap-1">
                            <Badge
                                color={isAvailable ? "success" : "error"}
                                variant="light">
                                {isAvailable ? "Còn trống" : "Hết"}
                            </Badge>
                            <span className="text-xs text-gray-500">
                                {availableQuantity}/{totalQuantity}
                            </span>
                        </div>
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
                            {isActive ? "Hoạt động" : "Ngưng cho thuê"}
                        </Badge>
                    );
                },
            },
        ],
        [],
    );

    return { columns };
};

export const renderEquipmentActions = (
    equipment: IEquipmentResponse,
    onEdit?: (equipment: IEquipmentResponse) => void,
    onDelete?: (equipment: IEquipmentResponse) => void,
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
                            onClick={() => onEdit(equipment)}
                            className="gap-2">
                            <Edit className="h-4 w-4" />
                            Chỉnh sửa
                        </DropdownMenuItem>
                    )}
                    {onDelete && (
                        <DropdownMenuItem
                            onClick={() => onDelete(equipment)}
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
