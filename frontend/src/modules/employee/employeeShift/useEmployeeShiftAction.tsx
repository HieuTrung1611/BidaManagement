import { IShiftResponse } from "@/types/shift";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { ArrowRight, Clock3, Edit, Trash2 } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { useShift } from "@/hooks/useShift";
import EmployeeShiftDetail from "./EmployeeShiftDetail";

export const useEmployeeShiftActions = () => {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null);

    const { shift: selectedShift, isLoading: isLoadingShift } = useShift(
        selectedShiftId || undefined,
    );

    const handleViewDetails = useCallback((shift: IShiftResponse) => {
        setSelectedShiftId(shift.id);
        setIsDetailOpen(true);
    }, []);

    const handleCloseDetail = useCallback(() => {
        setIsDetailOpen(false);
        setSelectedShiftId(null);
    }, []);

    const columns = useMemo<ColumnDef<IShiftResponse>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Tên ca",
                size: 250,
                cell: ({ row }) => {
                    const name = row.getValue("name") as string;
                    const shift = row.original;
                    return (
                        <button
                            type="button"
                            onClick={() => handleViewDetails(shift)}
                            className="group flex cursor-pointer items-center gap-1 text-left font-medium text-foreground transition-colors hover:text-primary">
                            <span className="group-hover:underline">
                                {name}
                            </span>
                            <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </button>
                    );
                },
            },
            {
                accessorKey: "code",
                header: "Mã ca",
                size: 140,
                cell: ({ row }) => {
                    const code = row.getValue("code") as string;
                    return (
                        <Badge color="info" variant="light">
                            {code}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "timeRange",
                header: "Khung giờ",
                size: 220,
                cell: ({ row }) => {
                    const shift = row.original;
                    return (
                        <div className="inline-flex items-center gap-2 rounded-md border border-neutral-200 px-2 py-1 text-sm dark:border-neutral-700">
                            <Clock3 className="h-4 w-4 text-neutral-500" />
                            <span>{shift.startTime}</span>
                            <span>-</span>
                            <span>{shift.endTime}</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: "description",
                header: "Mô tả",
                size: 350,
                cell: ({ row }) => {
                    const description =
                        (row.getValue("description") as string) || "-";
                    return <span className="line-clamp-2">{description}</span>;
                },
            },
        ],
        [handleViewDetails],
    );

    const DetailDrawer = () => (
        <EmployeeShiftDetail
            isOpen={isDetailOpen}
            onClose={handleCloseDetail}
            shift={selectedShift || null}
            isLoading={isLoadingShift}
        />
    );

    return {
        columns,
        DetailDrawer,
    };
};

export const renderEmployeeShiftActions = (
    shift: IShiftResponse,
    onEdit?: (shift: IShiftResponse) => void,
    onDelete?: (shift: IShiftResponse) => void,
) => {
    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(shift)}
                className="h-8 w-fit p-0"
                startIcon={<Edit className="h-4 w-4" />}>
                Sửa
            </Button>
            <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete?.(shift)}
                className="h-8 w-fit p-0 text-error hover:bg-error/10 hover:text-error"
                startIcon={<Trash2 className="h-4 w-4" />}>
                Xóa
            </Button>
        </div>
    );
};
