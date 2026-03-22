"use client";
import {
    DropdownMenuLabel,
    DropdownMenuItem,
} from "../ui/dropdown/dropdown-menu";

interface ActionsDropdownProps<T extends { id: number }> {
    item: T;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
}

export function ActionsDropdown<T extends { id: number }>({
    item,
    onEdit,
    onDelete,
}: ActionsDropdownProps<T>) {
    return (
        <>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit?.(item)}>
                Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete?.(item)}>
                Xóa
            </DropdownMenuItem>
        </>
    );
}
