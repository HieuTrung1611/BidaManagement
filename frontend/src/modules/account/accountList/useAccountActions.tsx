import { getUserRoleColor, getUserRoleName } from "@/constants/userRoles";
import { IAccountResponse } from "@/types/account";
import { ColumnDef } from "@tanstack/react-table";
import Badge from "../../../components/ui/badge/Badge";
import Button from "../../../components/ui/button/Button";
import { useCallback, useMemo, useState } from "react";
import {
    ArrowRight,
    Edit,
    Trash2,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import { useAccount } from "@/hooks/useAccount";
import { useBranches } from "@/hooks/useBranch";
import AccountDetail from "./AccountDetail";

export const useAccountActions = () => {
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
        null,
    );

    const { account: selectedAccount, isLoading: isLoadingAccount } =
        useAccount(selectedAccountId || undefined);

    const { branches } = useBranches();

    const handleViewDetails = useCallback((account: IAccountResponse) => {
        setSelectedAccountId(account.id);
        setIsDetailOpen(true);
    }, []);

    const handleCloseDetail = useCallback(() => {
        setIsDetailOpen(false);
        setSelectedAccountId(null);
    }, []);

    const columns = useMemo<ColumnDef<IAccountResponse>[]>(
        () => [
            {
                accessorKey: "username",
                header: "Tên đăng nhập",
                size: 200,
                cell: ({ row }) => {
                    const username = row.getValue("username") as string;
                    const account = row.original;
                    return (
                        <button
                            type="button"
                            onClick={() => handleViewDetails(account)}
                            className="group flex cursor-pointer items-center gap-1 text-left font-medium text-foreground transition-colors hover:text-primary">
                            <span className="group-hover:underline">
                                {username}
                            </span>
                            <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </button>
                    );
                },
            },
            {
                accessorKey: "email",
                header: "Email",
                size: 250,
                cell: ({ row }) => {
                    const email = row.getValue("email") as string;
                    return <span className="text-sm">{email}</span>;
                },
            },
            {
                accessorKey: "role",
                header: "Vai trò",
                size: 150,
                cell: ({ row }) => {
                    const role = row.getValue("role") as string;
                    return (
                        <Badge color={getUserRoleColor(role)} variant="light">
                            {getUserRoleName(role)}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "branchId",
                header: "Chi nhánh",
                size: 180,
                cell: ({ row }) => {
                    const branchId = row.getValue("branchId") as number | null;
                    if (!branchId) {
                        return (
                            <span className="text-sm text-muted-foreground italic">
                                Không có (Admin)
                            </span>
                        );
                    }
                    const branch = branches.find((b) => b.id === branchId);
                    return (
                        <span className="text-sm">
                            {branch ? branch.name : `#${branchId}`}
                        </span>
                    );
                },
            },
            {
                accessorKey: "isActive",
                header: "Trạng thái",
                size: 120,
                cell: ({ row }) => {
                    const isActive = row.getValue("isActive") as boolean;
                    return (
                        <Badge
                            color={isActive ? "success" : "error"}
                            variant="light">
                            {isActive ? "Hoạt động" : "Tạm khóa"}
                        </Badge>
                    );
                },
            },
        ],
        [handleViewDetails, branches],
    );

    const DetailDrawer = () => (
        <AccountDetail
            isOpen={isDetailOpen}
            onClose={handleCloseDetail}
            account={selectedAccount || null}
            isLoading={isLoadingAccount}
        />
    );

    return {
        columns,
        DetailDrawer,
    };
};

export const renderAccountActions = (
    account: IAccountResponse,
    onEdit: (account: IAccountResponse) => void,
    onDelete: (account: IAccountResponse) => void,
    onToggleActivation: (account: IAccountResponse) => void,
) => (
    <div className="flex items-center gap-2">
        <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleActivation(account)}
            className="h-8 w-8"
            startIcon={
                account.isActive ? (
                    <ToggleRight className="h-4 w-4 text-green-600" />
                ) : (
                    <ToggleLeft className="h-4 w-4 text-red-600" />
                )
            }></Button>
        <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(account)}
            className="h-8 w-8"
            startIcon={<Edit className="h-4 w-4" />}></Button>
        <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(account)}
            className="h-8 w-8 text-destructive hover:text-destructive"
            startIcon={<Trash2 className="h-4 w-4" />}></Button>
    </div>
);
