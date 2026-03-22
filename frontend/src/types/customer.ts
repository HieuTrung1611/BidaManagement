import { IUserResponse } from "./auth";
import { IBaseResponse } from "./base";

export enum EMembershipLevel {
    NORMAL = "NORMAL",
    SILVER = "SILVER",
    GOLD = "GOLD",
    DIAMOND = "DIAMOND",
}

export interface ICustomerRequest {
    name: string;
    email: string;
    phone: string;
    address?: string;
    dob?: string;
    points?: number;
    membershipLevel?: EMembershipLevel;
}

export interface ICustomerResponse extends ICustomerRequest, IBaseResponse {
    user: IUserResponse;
}
