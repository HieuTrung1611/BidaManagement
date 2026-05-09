import { IBaseResponse } from "./base";
import { IBranchResponse } from "./branch";

export type CustomerRank = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

export interface ICustomerRequest {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    branchId: number | null;
    customerNotes?: string;
}

export interface ICustomerResponse extends IBaseResponse {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    rank: CustomerRank;
    totalSpent: number;
    branch: IBranchResponse;
    isActive: boolean;
    photoUrl?: string;
    visitCount: number;
    lastVisitDate?: string;
    customerNotes?: string;
}
