import { IEmployeeResponse } from "@/types/employee";
import { IEmployeePositionResponse } from "@/types/employeePosition";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, Edit, Ellipsis, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useEmployee } from "@/hooks/useEmployee";
import EmployeeDetail from "./EmployeeDetail";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown/dropdown-menu";
import Badge from "@/components/ui/badge/Badge";
import { IBranchResponse } from "@/types/branch";

export const useEmployeeColumns = () => {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
        null,
    );

    // Sử dụng useEmployee hook để lấy dữ liệu chi tiết
    const { employee: selectedEmployee, isLoading: isLoadingEmployee } =
        useEmployee(selectedEmployeeId || undefined);

    const handleViewDetails = useCallback((employeeId: number) => {
        setSelectedEmployeeId(employeeId);
        setIsDetailOpen(true);
    }, []);

    const handleCloseDetail = useCallback(() => {
        setIsDetailOpen(false);
        setSelectedEmployeeId(null);
    }, []);

    const columns = useMemo<ColumnDef<IEmployeeResponse>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Nhân viên",
                size: 260,
                cell: ({ row }) => {
                    const employee = row.original;
                    return (
                        <button
                            type="button"
                            onClick={() => handleViewDetails(employee.id)}
                            className="group flex cursor-pointer items-center gap-1 text-left font-medium text-foreground transition-colors hover:text-primary">
                            <span className="group-hover:underline">
                                {employee.name}
                            </span>
                            <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </button>
                    );
                },
            },
            {
                accessorKey: "email",
                header: "Email",
                size: 260,
            },
            {
                accessorKey: "phoneNumber",
                header: "Số điện thoại",
                size: 160,
            },
            {
                accessorKey: "position",
                header: "Vị trí",
                size: 220,
                cell: ({ row }) => {
                    const position = row.getValue(
                        "position",
                    ) as IEmployeePositionResponse;
                    return (
                        <Badge color="info" variant="light">
                            {position.name}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "branch",
                header: "Chi nhánh",
                size: 220,
                cell: ({ row }) => {
                    const branch = row.getValue("branch") as IBranchResponse;
                    return (
                        <Badge color="info" variant="light">
                            {branch?.name ? branch.name : "Chưa có chi nhánh"}
                        </Badge>
                    );
                },
            },
        ],
        [handleViewDetails],
    );

    const DetailDrawer = () => (
        <EmployeeDetail
            isOpen={isDetailOpen}
            onClose={handleCloseDetail}
            employee={selectedEmployee || null}
            isLoading={isLoadingEmployee}
        />
    );

    return {
        columns,
        DetailDrawer,
    };
};

export const renderEmployeeActions = (
    employee: IEmployeeResponse,
    onEdit?: (employee: IEmployeeResponse) => void,
    onDelete?: (employee: IEmployeeResponse) => void,
) => {
    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Ellipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onEdit?.(employee)}>
                        Sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => onDelete?.(employee)}
                        className="text-destructive">
                        Xóa
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
