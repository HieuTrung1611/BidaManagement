import { IBranchResponse } from "@/types/branch";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, Ellipsis } from "lucide-react";
import { useCallback, useMemo } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown/dropdown-menu";
import Badge from "@/components/ui/badge/Badge";
import { useRouter } from "next/navigation";

export const useBranchActions = () => {
    const router = useRouter();

    const handleViewDetails = useCallback(
        (branchId: number) => {
            router.push(`/admin/branches/${branchId}`);
        },
        [router],
    );

    const columns = useMemo<ColumnDef<IBranchResponse>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Tên chi nhánh",
                size: 240,
                cell: ({ row }) => {
                    const branch = row.original;
                    return (
                        <button
                            type="button"
                            onClick={() => handleViewDetails(branch.id)}
                            className="group flex items-center gap-1 text-left font-medium text-foreground transition-colors hover:text-primary">
                            <span className="group-hover:underline">
                                {branch.name}
                            </span>
                            <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </button>
                    );
                },
            },
            {
                accessorKey: "address",
                header: "Địa chỉ",
                size: 320,
            },
            {
                accessorKey: "managerName",
                header: "Quản lý",
                size: 200,
            },
            {
                accessorKey: "managerPhoneNumber",
                header: "SĐT quản lý",
                size: 160,
            },
            {
                accessorKey: "employeesCount",
                header: "Nhân viên",
                size: 140,
                cell: ({ row }) => {
                    const count = row.getValue("employeesCount") as number;
                    return (
                        <Badge color="info" variant="light">
                            {count}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "description",
                header: "Mô tả",
                size: 300,
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
        [handleViewDetails],
    );

    return {
        columns,
    };
};

export const renderBranchActions = (
    branch: IBranchResponse,
    onEdit?: (branch: IBranchResponse) => void,
    onDelete?: (branch: IBranchResponse) => void,
) => {
    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Ellipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onEdit?.(branch)}>
                        Sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => onDelete?.(branch)}
                        className="text-destructive">
                        Xóa
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
