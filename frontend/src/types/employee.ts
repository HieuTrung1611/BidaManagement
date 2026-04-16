import { IBaseResponse } from "./base";
import { IBranchResponse } from "./branch";
import { IEmployeePositionResponse } from "./employeePosition";
import { IShiftResponse } from "./shift";

export type EmployeeSalaryType = "FIXED" | "HOURLY" | "COMMISSION";

export interface IEmployeeRequest {
    name: string;
    email: string;
    phoneNumber: string;
    dob: string;
    address: string;
    identityNumber: string;
    bankAccount: string;
    bankName: string;
    hireDate: string;
    salaryType: EmployeeSalaryType | null;
    baseSalary: number | null;
    emergencyContactName: string;
    emergencyContactPhone: string;
    isActive: boolean;
    positionId: number | null;
    branchId: number | null;
    shiftId: number | null;
}

export interface IEmployeeResponse extends IBaseResponse {
    name: string;
    email: string;
    phoneNumber: string;
    dob: string;
    address: string;
    identityNumber: string;
    bankAccount: string;
    bankName: string;
    hireDate: string;
    salaryType: EmployeeSalaryType | null;
    baseSalary: number | null;
    emergencyContactName: string;
    emergencyContactPhone: string;
    isActive: boolean;
    position: IEmployeePositionResponse | null;
    branch: IBranchResponse | null;
    shift: IShiftResponse | null;
}
