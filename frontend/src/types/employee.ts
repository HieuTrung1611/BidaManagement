import { IBaseResponse } from "./base";
import { IEmployeePositionResponse } from "./employeePosition";

export interface IEmployeeRequest {
    name: string;
    email: string;
    phoneNumber: string;
    dob: string;
    address: string;
    positionId: number | null;
}

export interface IEmployeeResponse extends IBaseResponse {
    name: string;
    email: string;
    phoneNumber: string;
    dob: string;
    address: string;
    position: IEmployeePositionResponse;
}
