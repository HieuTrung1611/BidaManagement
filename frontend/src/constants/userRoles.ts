import { USERROLE } from "@/types/account";
import { UserRole } from "@/types/auth";

export type RoleBadgeColor =
    | "primary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "light"
    | "dark";

export interface UserRoleMeta {
    label: string;
    badgeColor: RoleBadgeColor;
}

const DEFAULT_ROLE_META: UserRoleMeta = {
    label: "Người dùng",
    badgeColor: "primary",
};

const ROLE_META_MAP = {
    [USERROLE.ADMIN]: {
        label: "Quản trị viên",
        badgeColor: "error",
    },
    [USERROLE.MANAGER]: {
        label: "Quản lý",
        badgeColor: "warning",
    },
    [USERROLE.ACCOUNTANT]: {
        label: "Kế toán",
        badgeColor: "info",
    },
    [USERROLE.EMPLOYEE]: {
        label: "Nhân viên",
        badgeColor: "success",
    },
    [UserRole.USER]: {
        label: "Người dùng",
        badgeColor: "primary",
    },
} as const satisfies Record<string, UserRoleMeta>;

export type RoleKey = keyof typeof ROLE_META_MAP;

export const getUserRoleMeta = (role?: string): UserRoleMeta => {
    if (!role) {
        return DEFAULT_ROLE_META;
    }
    return ROLE_META_MAP[role as RoleKey] ?? DEFAULT_ROLE_META;
};

export const getUserRoleName = (role?: string): string =>
    getUserRoleMeta(role).label;

export const getUserRoleColor = (role?: string): RoleBadgeColor =>
    getUserRoleMeta(role).badgeColor;

export const getAllUserRoles = () =>
    Object.entries(ROLE_META_MAP).map(([value, meta]) => ({
        value,
        ...meta,
    }));
