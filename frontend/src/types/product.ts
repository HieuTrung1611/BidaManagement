import { IBaseResponse } from "./base";

export type ProductType = "FOOD" | "BEVERAGE";

export interface IProductRequest {
    name: string;
    description: string | null;
    type: ProductType;
    purchasePrice: number;
    salePrice: number;
    stockQuantity: number;
    unit: string;
    branchId: number;
    isActive: boolean;
}

export interface IProductResponse extends IBaseResponse {
    name: string;
    description: string | null;
    type: ProductType;
    purchasePrice: number;
    salePrice: number;
    stockQuantity: number;
    unit: string;
    branchId: number;
    branchName: string;
    isActive: boolean;
}
