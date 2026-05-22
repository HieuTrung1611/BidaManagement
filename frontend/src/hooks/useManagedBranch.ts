import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import { useAccountByUsername } from "./useAccount";

/**
 * Hook để lấy branchId của tài khoản hiện tại
 * - ADMIN: branchId = null (quản lý tất cả chi nhánh)
 * - MANAGER/EMPLOYEE: branchId = số cụ thể (quản lý/làm việc tại chi nhánh đó)
 */
export const useManagedBranch = () => {
    const { user } = useAuth();
    const isManager = user?.role === UserRole.MANAGER;

    const {
        account,
        isLoading: isLoadingAccount,
        isError,
    } = useAccountByUsername(user?.username);

    // branchId được lấy trực tiếp từ account
    // null = ADMIN (có thể quản lý tất cả chi nhánh)
    // number = MANAGER/EMPLOYEE (làm việc tại chi nhánh cụ thể)
    const managedBranchId = account?.branchId ?? undefined;

    return {
        managedBranchId,
        isLoading: isLoadingAccount,
        isError,
    };
};
