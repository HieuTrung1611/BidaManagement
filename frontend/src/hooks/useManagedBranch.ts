import { useAuth } from "@/context/AuthContext";
import employeeService from "@/services/employeeService";
import { UserRole } from "@/types/auth";
import useSWR from "swr";
import { useAccountByUsername } from "./useAccount";

const getManagedBranchIdFetcher = async (email: string): Promise<number> => {
    const res = await employeeService.getAllEmployees(email, undefined, {
        page: 0,
        size: 50,
        sortBy: "id",
        sortDirection: "asc",
    });

    if (!res.data) {
        throw new Error("Không thể tải thông tin chi nhánh của quản lý");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const managerEmployee = res.data.content.find(
        (employee) => employee.email?.trim().toLowerCase() === normalizedEmail,
    );

    if (!managerEmployee?.branch?.id) {
        throw new Error("Không tìm thấy chi nhánh của tài khoản quản lý");
    }

    return managerEmployee.branch.id;
};

export const useManagedBranch = () => {
    const { user } = useAuth();
    const isManager = user?.role === UserRole.MANAGER;

    const { account, isLoading: isLoadingAccount } = useAccountByUsername(
        user?.username,
    );

    const managerEmail = isManager ? account?.email : undefined;

    const { data, error, isLoading, mutate } = useSWR<number>(
        managerEmail ? ["/managed-branch", managerEmail] : null,
        () => getManagedBranchIdFetcher(managerEmail!),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        },
    );

    return {
        managedBranchId: data,
        isLoading: isManager ? isLoading || isLoadingAccount : false,
        isError: error,
        mutate,
    };
};
