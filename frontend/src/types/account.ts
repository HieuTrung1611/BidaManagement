import { IBaseResponse } from "./base";

export interface IAccountDetailsResponse
    extends IAccountResponse, IBaseResponse {}

export interface IAccountResponse {
    id: number;
    username: string;
    role: USERROLE;
    email: string;
    isActive: boolean;
}

export enum USERROLE {
    ADMIN = "ADMIN",
    EMPLOYEE = "EMPLOYEE",
    ACCOUNTANT = "ACCOUNTANT",
    MANAGER = "MANAGER",
}

export interface IUpdatePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface IAccountRequest {
    email: string;
    username: string;
    password: string;
    role: USERROLE;
}
