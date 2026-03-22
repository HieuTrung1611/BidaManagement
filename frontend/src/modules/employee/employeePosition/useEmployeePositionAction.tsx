import { IEmployeePositionResponse } from "@/types/employeePosition";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import EmployeePositionDetail from "./EmployeePositionDetail";
import { ArrowRight, Edit, Trash2 } from "lucide-react";
import { useEmployeePosition } from "@/hooks/useEmployeePosition";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";

export const useEmployeePositionActions = () => {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedPositionId, setSelectedPositionId] = useState<number | null>(
        null,
    );

    const {
        employeePosition: selectedEmployeePosition,
        isLoading: isLoadingEmployeePosition,
    } = useEmployeePosition(selectedPositionId || undefined);

    const handleViewDetails = useCallback(
        (position: IEmployeePositionResponse) => {
            setSelectedPositionId(position.id);
            setIsDetailOpen(true);
        },
        [],
    );

    const handleCloseDetail = useCallback(() => {
        setIsDetailOpen(false);
        setSelectedPositionId(null);
    }, []);

    const columns = useMemo<ColumnDef<IEmployeePositionResponse>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Tên vị trí",
                size: 300,
                cell: ({ row }) => {
                    const name = row.getValue("name") as string;
                    const position = row.original;
                    return (
                        <button
                            type="button"
                            onClick={() => handleViewDetails(position)}
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
                header: "Mã",
                size: 150,
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
                accessorKey: "hourlyRate",
                header: "Mức lương theo giờ",
                size: 250,
                cell: ({ row }) => {
                    const hourlyRate = row.getValue("hourlyRate") as number;
                    return (
                        <span>
                            {hourlyRate.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            })}
                        </span>
                    );
                },
            },
        ],
        [handleViewDetails],
    );

    const DetailDrawer = () => (
        <EmployeePositionDetail
            isOpen={isDetailOpen}
            onClose={handleCloseDetail}
            employeePosition={selectedEmployeePosition || null}
            isLoading={isLoadingEmployeePosition}
        />
    );

    return {
        columns,
        DetailDrawer,
    };
};

export const renderEmployeePositionActions = (
    position: IEmployeePositionResponse,
    onEdit?: (position: IEmployeePositionResponse) => void,
    onDelete?: (position: IEmployeePositionResponse) => void,
) => {
    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(position)}
                className="h-8 w-fit p-0"
                startIcon={<Edit className="h-4 w-4" />}>
                Sửa
            </Button>
            <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete?.(position)}
                className="h-8 w-fit p-0 text-error hover:text-error hover:bg-error/10"
                startIcon={<Trash2 className="h-4 w-4" />}>
                Xóa
            </Button>
        </div>
    );
};
