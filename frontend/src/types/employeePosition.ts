import { IBaseResponse } from "./base";

export interface IEmployeePositionRequest {
    name: string;
    code: string;
    hourlyRate: number;
}

export interface IEmployeePositionResponse
    extends IEmployeePositionRequest, IBaseResponse {}
