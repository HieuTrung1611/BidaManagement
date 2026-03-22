import { IBaseResponse } from "./base";

export interface IBranchRequest {
    name: string;
    address: string;
}

export interface IBranchResponse extends IBranchRequest, IBaseResponse {
    branchImages?: Array<{
        id: number;
        imageUrl: string;
    }>;
}
