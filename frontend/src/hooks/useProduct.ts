import productService from "@/services/productService";
import { PaginationParams } from "@/types/base";
import { IProductResponse, ProductType } from "@/types/product";
import useSWR from "swr";

const getProductByIdFetcher = async (id: number): Promise<IProductResponse> => {
    const res = await productService.getProductById(id);
    if (!res.data) {
        throw new Error("Không tìm thấy sản phẩm");
    }
    return res.data;
};

const getProductsFetcher = async (
    keyword: string,
    type: ProductType | null,
    branchId: number | null | undefined,
    isActive: boolean | null,
    params: PaginationParams,
) => {
    const res = await productService.getAllProducts(
        keyword,
        type,
        branchId,
        isActive,
        params,
    );
    if (!res.data) {
        throw new Error("Lỗi khi tải danh sách sản phẩm");
    }
    return res.data;
};

export const useProduct = (id?: number) => {
    const shouldFetch = id !== undefined;

    const { data, error, isLoading, mutate } = useSWR<IProductResponse>(
        shouldFetch ? ["/products", id] : null,
        () => getProductByIdFetcher(id!),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        },
    );

    return {
        product: data,
        isLoading,
        isError: error,
        mutate,
    };
};

export const useProducts = (
    keyword: string,
    type: ProductType | null,
    isActive: boolean | null,
    params: PaginationParams,
    branchId?: number,
) => {
    const { data, error, isLoading, mutate } = useSWR(
        [
            "/products",
            keyword,
            type,
            branchId,
            isActive,
            params.page,
            params.size,
            params.sortBy,
            params.sortDirection,
        ],
        () => getProductsFetcher(keyword, type, branchId, isActive, params),
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            keepPreviousData: true,
        },
    );

    return {
        products: data?.content ?? [],
        pageNumber: data?.pageNumber ?? params.page ?? 0,
        pageSize: data?.pageSize ?? params.size ?? 10,
        totalElements: data?.totalElements ?? 0,
        totalPages: data?.totalPages ?? 1,
        isLoading,
        isError: error,
        mutate,
    };
};
