// components/ui/table/DataTable.tsx (Cập nhật lần cuối)

"use client";

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
    PaginationState,
    OnChangeFn,
} from "@tanstack/react-table";
import { useState, useMemo, useEffect } from "react";
// Import đầy đủ các component UI
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@/components/ui/dropdown/dropdown-menu";

import Button from "../button/Button"; // Component Button của bạn
import {
    Ellipsis,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import Select from "../form/Select";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table/table";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    renderActions: (row: TData) => React.ReactNode;
    // Server-side pagination props
    pageCount?: number;
    pageIndex?: number;
    pageSize?: number;
    totalItems?: number;
    onPaginationChange?: OnChangeFn<PaginationState>;
    manualPagination?: boolean;
    isLoading?: boolean;
    isShowPagination?: boolean;
    pageSizeOptions?: number[];
}

export function DataTable<TData extends { id?: number | string }, TValue>({
    columns,
    data,
    renderActions,
    pageCount,
    pageIndex = 0,
    pageSize = 10,
    totalItems = 0,
    onPaginationChange,
    manualPagination = true,
    isLoading = false,
    isShowPagination = true,
    pageSizeOptions = [5, 10, 20, 30, 50, 100],
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex,
        pageSize,
    });

    // Sync pagination state with props
    useEffect(() => {
        setPagination({
            pageIndex,
            pageSize,
        });
    }, [pageIndex, pageSize]);

    // Generate page numbers to display
    const getPageNumbers = () => {
        const totalPages = manualPagination
            ? (pageCount ?? 1)
            : table.getPageCount();
        const currentPage = table.getState().pagination.pageIndex;
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            // Show all pages if total is 7 or less
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(0);

            if (currentPage > 3) {
                pages.push("...");
            }

            // Show pages around current page
            const start = Math.max(1, currentPage - 1);
            const end = Math.min(totalPages - 2, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 4) {
                pages.push("...");
            }

            // Always show last page
            pages.push(totalPages - 1);
        }

        return pages;
    };

    const columnsWithActions = useMemo(() => {
        const actionColumn: ColumnDef<TData> = {
            id: "actions",
            // Căn giữa Header
            header: () => (
                <div className="text-center text-xs md:text-sm">Hành động</div>
            ),
            enableHiding: false,
            // Responsive width cho cột Actions
            cell: ({ row }) => {
                const rowData = row.original;
                return (
                    // Căn giữa nội dung cell
                    <div className="flex items-center justify-center">
                        {renderActions(rowData)}
                    </div>
                );
            },
        };

        return [...columns, actionColumn];
    }, [columns, renderActions]);

    const table = useReactTable({
        data,
        columns: columnsWithActions,
        pageCount: pageCount ?? -1,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: manualPagination
            ? onPaginationChange
            : setPagination,
        manualPagination,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    });

    return (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-white/5 dark:bg-white/3">
            <div className="w-full overflow-x-auto">
                <Table
                    className="w-full"
                    style={{ maxWidth: "100%", wordBreak: "break-word" }}>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    // Responsive width cho từng cột
                                    const isActionsColumn =
                                        header.id === "actions";
                                    const widthClass = isActionsColumn
                                        ? "w-20 md:w-24" // Actions column: 80px trên mobile, 96px trên desktop
                                        : ""; // Các cột khác: auto width

                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={`text-sm px-2 md:px-4 text-neutral-500 border-r last:border-r-0 ${widthClass}`}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columnsWithActions.length}
                                    className="h-24 text-center">
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                const isDeleted =
                                    (row.original as any).delete === true;

                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                        className={isDeleted ? "relative" : ""}>
                                        {row.getVisibleCells().map((cell) => {
                                            const isActionsColumn =
                                                cell.column.id === "actions";

                                            const widthClass = isActionsColumn
                                                ? "w-20 md:w-24"
                                                : "";

                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    className={`px-2 md:px-4 py-3 border-r last:border-r-0 ${widthClass} ${
                                                        isDeleted &&
                                                        !isActionsColumn
                                                            ? "relative opacity-40 pointer-events-none"
                                                            : ""
                                                    }`}>
                                                    {isDeleted &&
                                                        !isActionsColumn && (
                                                            <div className="absolute inset-0 bg-error-200/60 dark:bg-error-800/60" />
                                                        )}
                                                    <div
                                                        className={`${
                                                            isDeleted &&
                                                            !isActionsColumn
                                                                ? "relative z-0"
                                                                : ""
                                                        } ${!isActionsColumn ? "truncate" : ""}`}>
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </div>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columnsWithActions.length}
                                    className="h-24 text-center ">
                                    Không có dữ liệu.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {isShowPagination && (
                <div className="flex flex-col gap-2 px-3 py-3 border-t border-neutral-200 dark:border-white/5 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left side: Items per page selector and info */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                        {/* Page size selector */}
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-neutral-600 dark:text-neutral-400 whitespace-nowrap hidden xl:inline">
                                Hiển thị
                            </span>
                            <Select
                                options={pageSizeOptions.map((size) => ({
                                    value: size.toString(),
                                    label: size.toString(),
                                }))}
                                defaultValue={table
                                    .getState()
                                    .pagination.pageSize.toString()}
                                onChange={(value) => {
                                    table.setPageSize(Number(value));
                                }}
                                className="w-14"
                                placeholder=""
                            />
                            <span className="text-xs text-neutral-600 dark:text-neutral-400 whitespace-nowrap hidden xl:inline">
                                mục/trang
                            </span>
                        </div>

                        {/* Items info */}
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            {manualPagination && totalItems > 0 ? (
                                <span className="hidden md:inline">
                                    {table.getState().pagination.pageIndex *
                                        table.getState().pagination.pageSize +
                                        1}{" "}
                                    -{" "}
                                    {Math.min(
                                        (table.getState().pagination.pageIndex +
                                            1) *
                                            table.getState().pagination
                                                .pageSize,
                                        totalItems,
                                    )}{" "}
                                    / {totalItems}
                                </span>
                            ) : (
                                <span className="hidden md:inline">
                                    Tổng:{" "}
                                    {table.getFilteredRowModel().rows.length}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right side: Pagination buttons */}
                    <div className="flex items-center gap-1">
                        {/* First page */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                            className="hidden lg:flex items-center justify-center">
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>

                        {/* Previous page */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="flex items-center justify-center">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {/* Mobile page indicator */}
                        <div className="lg:hidden flex items-center px-1">
                            <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                                {table.getState().pagination.pageIndex + 1} /{" "}
                                {manualPagination
                                    ? (pageCount ?? 1)
                                    : table.getPageCount()}
                            </span>
                        </div>

                        {/* Page numbers */}
                        <div className="hidden lg:flex items-center gap-1">
                            {getPageNumbers().map((page, index) => {
                                if (page === "...") {
                                    return (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className="px-2 text-neutral-500">
                                            ...
                                        </span>
                                    );
                                }

                                const pageNumber = page as number;
                                const isCurrentPage =
                                    pageNumber ===
                                    table.getState().pagination.pageIndex;

                                return (
                                    <Button
                                        key={pageNumber}
                                        variant={
                                            isCurrentPage
                                                ? "primary"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={() =>
                                            table.setPageIndex(pageNumber)
                                        }
                                        className="min-w-0 px-2">
                                        {pageNumber + 1}
                                    </Button>
                                );
                            })}
                        </div>

                        {/* Next page */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="flex items-center justify-center">
                            <ChevronRight className="h-4 w-4" />
                        </Button>

                        {/* Last page */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                table.setPageIndex(
                                    (manualPagination
                                        ? (pageCount ?? 1)
                                        : table.getPageCount()) - 1,
                                )
                            }
                            disabled={!table.getCanNextPage()}
                            className="hidden lg:flex items-center justify-center">
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
