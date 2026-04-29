import { EmployeeSalaryType } from "./employee";

export interface ISalaryResponse {
    id: number;
    employeeId: number;
    employeeName: string;
    positionName: string;
    branchId: number;
    branchName: string;
    salaryMonth: string;
    salaryType: EmployeeSalaryType;
    baseSalary: number;
    bonus: number;
    deduction: number;
    totalSalary: number;
    workingDays: number;
    workingHours: number;
    isPaid: boolean;
    notes?: string;
}

export interface ISalaryBranchSummaryResponse {
    branchId: number;
    branchName: string;
    employeeCount: number;
    totalWorkingDays: number;
    totalWorkingHours: number;
    totalSalary: number;
}

export interface ISalarySummaryResponse {
    salaryMonth: string;
    fromDate: string;
    toDate: string;
    branchId?: number;
    branchName?: string;
    employeeCount: number;
    totalWorkingDays: number;
    totalWorkingHours: number;
    totalSalary: number;
    branchSummaries: ISalaryBranchSummaryResponse[];
    salaries: ISalaryResponse[];
}

export interface ISalaryBranchStatisticsResponse {
    branchId: number;
    branchName: string;
    employeeCount: number;
    paidEmployeeCount: number;
    totalSalary: number;
    allPaid: boolean;
}

export interface ISalaryStatisticsResponse {
    salaryMonth: string;
    branchId?: number;
    keyword?: string;
    totalBranches: number;
    totalEmployees: number;
    totalPaidEmployees: number;
    totalSalary: number;
    allPaid: boolean;
    branchStatistics: ISalaryBranchStatisticsResponse[];
}
