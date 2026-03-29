import { IBaseResponse } from "./base";
import { IBranchResponse } from "./branch";
import { IEmployeePositionResponse } from "./employeePosition";

export interface IEmployeeRequest {
    name: string;
    email: string;
    phoneNumber: string;
    dob: string;
    address: string;
    positionId: number | null;
    branchId: number | null;
}

export interface IEmployeeResponse extends IBaseResponse {
    name: string;
    email: string;
    phoneNumber: string;
    dob: string;
    address: string;
    position: IEmployeePositionResponse | null;
    branch: IBranchResponse | null;
}
