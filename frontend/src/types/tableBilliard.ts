import { IBaseResponse } from "./base";
import { IBranchResponse } from "./branch";
import { ITableBilliardTypeResponse } from "./tableBilliardType";

export interface ITableBilliardRequest {
    name: string;
    description: string;
    typeId: number | null;
    zoneId: number | null;
    pricePerHour?: number;
    branchId: number | null;
}

export interface ITableBilliardResponse extends IBaseResponse {
    name: string;
    description: string;
    type: ITableBilliardTypeResponse | null;
    pricePerHour: number;
    branch: IBranchResponse | null;
}
