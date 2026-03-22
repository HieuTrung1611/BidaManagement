export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER",
    MANAGER = "MANAGER",
    EMPLOYEE = "EMPLOYEE",
    ACCOUNTANT = "ACCOUNTANT",
}

export interface ILoginReq {
    username: string;
    password: string;
}
