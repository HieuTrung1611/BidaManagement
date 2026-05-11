import React from "react";
import { AxiosError } from "axios";
import { PaginationState } from "@tanstack/react-table";

import { useProductColumns, renderProductActions } from "./useProductAction";
import { ProductModal } from "./ProductModal";
import { useProducts } from "@/hooks/useProduct";
import { useCrudActions } from "@/hooks/useCrudActions";
import productService from "@/services/productService";
import { IProductRequest, IProductResponse, ProductType } from "@/types/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputSearch from "@/components/common/InputSearch";
import Button from "@/components/ui/button/Button";
import { DataTable } from "@/components/ui/table/DataTable";
import { useBranches } from "@/hooks/useBranch";
import Select from "@/components/ui/form/Select";

interface ProductListTabProps {
    branchId?: number;
}

const ProductListTab: React.FC<ProductListTabProps> = ({ branchId }) => {
    const [keyword, setKeyword] = React.useState("");
    const [selectedType, setSelectedType] = React.useState<ProductType | null>(null);
    const [selectedBranchId, setSelectedBranchId] = React.useState<number | undefined>(
        undefined,
    );
    const [isActiveFilter, setIsActiveFilter] = React.useState<boolean | null>(null);
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const isBranchFixed = branchId !== undefined;
    const effectiveBranchId = isBranchFixed ? branchId : selectedBranchId;

    React.useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [keyword, selectedType, effectiveBranchId, isActiveFilter]);

    const { branches } = useBranches();

    const branchFilterOptions = React.useMemo(
        () => [
            { value: "", label: "Tất cả chi nhánh" },
            ...branches.map((branch) => ({
                value: branch.id.toString(),
                label: branch.name,
            })),
        ],
        [branches],
    );

    const typeFilterOptions = React.useMemo(
        () => [
            { value: "", label: "Tất cả loại" },
            { value: "FOOD", label: "Đồ ăn" },
            { value: "BEVERAGE", label: "Đồ uống" },
        ],
        [],
    );

    const statusFilterOptions = React.useMemo(
        () => [
            { value: "", label: "Tất cả trạng thái" },
            { value: "true", label: "Đang hoạt động" },
            { value: "false", label: "Ngưng bán" },
        ],
        [],
    );

    const {
        products,
        pageNumber,
        pageSize,
        totalElements,
        totalPages,
        isLoading,
        isError,
        mutate,
    } = useProducts(
        keyword,
        selectedType,
        isActiveFilter,
        {
            page: pagination.pageIndex,
            size: pagination.pageSize,
            sortBy: "createdAt",
            sortDirection: "desc",
        },
        effectiveBranchId,
    );

    const { columns } = useProductColumns();

    const {
        modalState,
        openAddModal,
        openEditModal,
        closeModal,
        handleSubmit,
        deleteState,
        openDeleteConfirm,
        handleConfirmDelete,
        closeDeleteConfirm,
        fieldErrors,
    } = useCrudActions<IProductRequest, IProductResponse, number>({
        onSuccess: mutate,
        service: {
            create: productService.createProduct,
            update: productService.updateProduct,
            remove: productService.deleteProduct,
            getId: (product) => product.id,
        },
        extractErrorMessage: (error) => {
            const axiosError = error as AxiosError<{ message?: string }>;
            return axiosError.response?.data?.message;
        },
    });

    return (
        <Card className="min-w-0">
            <CardHeader>
                <CardTitle>Quản lý sản phẩm đồ ăn/đồ uống</CardTitle>
            </CardHeader>
            <CardContent className="min-w-0">
                <div className="mb-4 flex flex-col gap-4 min-w-0">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <InputSearch
                            value={keyword}
                            onChange={setKeyword}
                            placeholder="Tìm kiếm sản phẩm..."
                            className="flex-1 min-w-0"
                        />
                        <Button
                            size="sm"
                            className="shrink-0 sm:ml-auto"
                            onClick={openAddModal}>
                            Thêm sản phẩm
                        </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Select
                            options={typeFilterOptions}
                            value={selectedType ?? ""}
                            onChange={(value) =>
                                setSelectedType(value ? (value as ProductType) : null)
                            }
                            placeholder="Lọc theo loại"
                            className="h-10 w-full sm:w-48"
                        />
                        {!isBranchFixed && (
                            <Select
                                options={branchFilterOptions}
                                value={selectedBranchId ? selectedBranchId.toString() : ""}
                                onChange={(value) =>
                                    setSelectedBranchId(value ? Number(value) : undefined)
                                }
                                placeholder="Lọc theo chi nhánh"
                                className="h-10 w-full sm:w-56"
                            />
                        )}
                        <Select
                            options={statusFilterOptions}
                            value={
                                isActiveFilter === null
                                    ? ""
                                    : isActiveFilter.toString()
                            }
                            onChange={(value) =>
                                setIsActiveFilter(
                                    value === "" ? null : value === "true",
                                )
                            }
                            placeholder="Lọc theo trạng thái"
                            className="h-10 w-full sm:w-56"
                        />
                    </div>
                </div>

                {isError ? (
                    <p className="p-4 text-center text-red-500">
                        Đã xảy ra lỗi khi lấy dữ liệu.
                    </p>
                ) : (
                    <div className="min-w-0">
                        <DataTable
                            columns={columns}
                            data={products}
                            renderActions={(product) =>
                                renderProductActions(
                                    product,
                                    openEditModal,
                                    openDeleteConfirm,
                                )
                            }
                            isLoading={isLoading}
                            manualPagination
                            pageCount={totalPages}
                            pageIndex={pageNumber}
                            pageSize={pageSize}
                            totalItems={totalElements}
                            onPaginationChange={setPagination}
                        />
                    </div>
                )}

                <ProductModal
                    isOpen={modalState.isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    isSubmitting={modalState.isSubmitting}
                    initialData={modalState.editingEntity}
                    errors={fieldErrors}
                    branches={branches}
                />

                {deleteState.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                Xác nhận xóa
                            </h3>
                            <p className="mb-6 text-gray-600">
                                Bạn có chắc chắn muốn xóa sản phẩm{" "}
                                <span className="font-medium">
                                    &quot;{deleteState.entity?.name}&quot;
                                </span>
                                ? Hành động này không thể hoàn tác.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={closeDeleteConfirm}
                                    disabled={deleteState.isDeleting}>
                                    Hủy
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={handleConfirmDelete}
                                    disabled={deleteState.isDeleting}>
                                    {deleteState.isDeleting ? "Đang xóa..." : "Xóa"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ProductListTab;
