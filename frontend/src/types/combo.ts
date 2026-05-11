import { IBaseResponse } from "./base";

export type ComboItemType = "PRODUCT" | "EQUIPMENT";

export interface IComboItemRequest {
    itemType: ComboItemType;
    itemId: number;
    quantity: number;
}

export interface IComboItemResponse extends IBaseResponse {
    comboId: number;
    itemType: ComboItemType;
    itemId: number;
    itemName: string;
    quantity: number;
}

export interface IComboRequest {
    name: string;
    description: string | null;
    regularPrice: number;
    discountedPrice: number;
    branchId: number;
    isActive: boolean;
    items: IComboItemRequest[];
}

export interface IComboResponse extends IBaseResponse {
    name: string;
    description: string | null;
    regularPrice: number;
    discountedPrice: number;
    savingsAmount: number;
    savingsPercent: number;
    branchId: number;
    branchName: string;
    isActive: boolean;
    items: IComboItemResponse[];
}
