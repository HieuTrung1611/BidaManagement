import { ICustomerResponse } from "@/types/customer";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, Ellipsis } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useCustomer } from "@/hooks/useCustomer";
import CustomerDetail from "./CustomerDetail";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown/dropdown-menu";
import Badge from "@/components/ui/badge/Badge";
import { IBranchResponse } from "@/types/branch";
import {
    getCustomerRankDisplay,
    getCustomerRankColor,
} from "@/utils/customerUtils";

export const useCustomerColumns = () => {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
        null,
    );

    // Sử dụng useCustomer hook để lấy dữ liệu chi tiết
    const { customer: selectedCustomer, isLoading: isLoadingCustomer } =
        useCustomer(selectedCustomerId || undefined);

    const handleViewDetails = useCallback((customerId: number) => {
        setSelectedCustomerId(customerId);
        setIsDetailOpen(true);
    }, []);

    const handleCloseDetail = useCallback(() => {
        setIsDetailOpen(false);
        setSelectedCustomerId(null);
    }, []);

    const columns = useMemo<ColumnDef<ICustomerResponse>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Khách hàng",
                size: 260,
                cell: ({ row }) => {
                    const customer = row.original;
                    return (
                        <button
                            type="button"
                            onClick={() => handleViewDetails(customer.id)}
                            className="group flex cursor-pointer items-center gap-2 text-left font-medium text-foreground transition-colors hover:text-primary">
                            {customer.photoUrl ? (
                                <img
                                    src={customer.photoUrl}
                                    alt={customer.name}
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-700">
                                    {customer.name
                                        ?.trim()
                                        .charAt(0)
                                        .toUpperCase() || "?"}
                                </div>
                            )}
                            <span className="group-hover:underline">
                                {customer.name}
                            </span>
                            <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </button>
                    );
                },
            },
            {
                accessorKey: "email",
                header: "Email",
                size: 240,
            },
            {
                accessorKey: "phoneNumber",
                header: "Số điện thoại",
                size: 160,
            },
            {
                accessorKey: "branch",
                header: "Chi nhánh",
                size: 200,
                cell: ({ row }) => {
                    const branch = row.getValue("branch") as IBranchResponse;
                    return (
                        <Badge color="info" variant="light">
                            {branch?.name ? branch.name : "Chưa có chi nhánh"}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "rank",
                header: "Hạng",
                size: 140,
                cell: ({ row }) => {
                    const rank = row.getValue(
                        "rank",
                    ) as ICustomerResponse["rank"];
                    const rankDisplay = getCustomerRankDisplay(rank);
                    return (
                        <Badge
                            color={getCustomerRankColor(rank)}
                            variant="light">
                            {rankDisplay.displayName}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "totalSpent",
                header: "Tổng chi tiêu",
                size: 180,
                cell: ({ row }) => {
                    const totalSpent = row.getValue("totalSpent") as number;
                    return (
                        <span className="font-medium">
                            {(totalSpent || 0).toLocaleString("vi-VN")} VNĐ
                        </span>
                    );
                },
            },
            {
                accessorKey: "visitCount",
                header: "Lần ghé",
                size: 120,
                cell: ({ row }) => {
                    const visitCount = row.getValue("visitCount") as number;
                    return (
                        <span className="font-medium">{visitCount || 0}</span>
                    );
                },
            },
            {
                accessorKey: "isActive",
                header: "Trạng thái",
                size: 160,
                cell: ({ row }) => {
                    const isActive = row.original.isActive;
                    return (
                        <Badge
                            color={isActive ? "success" : "error"}
                            variant="light">
                            {isActive ? "Hoạt động" : "Bị vô hiệu hóa"}
                        </Badge>
                    );
                },
            },
        ],
        [handleViewDetails],
    );

    const DetailDrawer = () => (
        <CustomerDetail
            isOpen={isDetailOpen}
            onClose={handleCloseDetail}
            customer={selectedCustomer || null}
            isLoading={isLoadingCustomer}
        />
    );

    return {
        columns,
        DetailDrawer,
    };
};

export const renderCustomerActions = (
    customer: ICustomerResponse,
    onEdit?: (customer: ICustomerResponse) => void,
    onDeactivate?: (customer: ICustomerResponse) => void,
    onReactivate?: (customer: ICustomerResponse) => void,
) => {
    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Ellipsis className="cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onEdit?.(customer)}>
                        Sửa
                    </DropdownMenuItem>
                    {customer.isActive ? (
                        <DropdownMenuItem
                            onClick={() => onDeactivate?.(customer)}
                            className="text-orange-600">
                            Vô hiệu hóa
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem
                            onClick={() => onReactivate?.(customer)}
                            className="text-green-600">
                            Kích hoạt
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
