import axiosClient from "./axiosClient";
import { IProductRequest, IProductResponse, ProductType } from "@/types/product";
import { ApiResponse, PageResponse, PaginationParams } from "@/types/base";

const API_URL = "/products";

const productService = {
    createProduct: async (req: IProductRequest): Promise<ApiResponse<null>> => {
        const res = await axiosClient.post(API_URL, req);
        return res.data;
    },
    updateProduct: async (
        id: number,
        req: IProductRequest,
    ): Promise<ApiResponse<null>> => {
        const res = await axiosClient.put(`${API_URL}/${id}`, req);
        return res.data;
    },
    getProductById: async (
        id: number,
    ): Promise<ApiResponse<IProductResponse>> => {
        const res = await axiosClient.get(`${API_URL}/${id}`);
        return res.data;
    },
    getAllProducts: async (
        keyword: string = "",
        type: ProductType | null = null,
        branchId: number | null | undefined,
        isActive: boolean | null = null,
        params: PaginationParams,
    ): Promise<ApiResponse<PageResponse<IProductResponse>>> => {
        const res = await axiosClient.get(API_URL, {
            params: {
                keyword: keyword,
                type: type,
                branchId: branchId,
                isActive: isActive,
                page: params.page ?? 0,
                size: params.size ?? 10,
                sort: `${params.sortBy ?? "createdAt"},${params.sortDirection ?? "desc"}`,
            },
        });
        return res.data;
    },
    deleteProduct: async (id: number): Promise<ApiResponse<null>> => {
        const res = await axiosClient.delete(`${API_URL}/${id}`);
        return res.data;
    },
    getLowStockProducts: async (
        branchId: number | null | undefined,
    ): Promise<ApiResponse<IProductResponse[]>> => {
        const res = await axiosClient.get(`${API_URL}/low-stock`, {
            params: { branchId },
        });
        return res.data;
    },
};

export default productService;
