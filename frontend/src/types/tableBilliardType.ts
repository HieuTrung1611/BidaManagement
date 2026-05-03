import { IBaseResponse } from "./base";

export interface ITableBilliardTypeRequest {
    name: string;
    description: string;
    costPrice: number;
    pricePerHour: number;
    supplier: string;
    supplierPhone: string;
}

export interface ITableBilliardTypeResponse
    extends ITableBilliardTypeRequest, IBaseResponse {}
