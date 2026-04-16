export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EARLY_LEAVE";

export interface IAttendanceResponse {
    id?: number;
    employeeId: number;
    employeeName: string;
    positionName?: string;
    shiftId?: number;
    shiftName?: string;
    shiftStartTime?: string;
    shiftEndTime?: string;
    branchId?: number;
    branchName?: string;
    attendanceDate: string;
    status: AttendanceStatus;
    workingHours: number;
    notes?: string;
}

export interface IAttendanceUpsertItemRequest {
    employeeId: number;
    status: AttendanceStatus;
    workingHours: number;
    notes?: string;
}

export interface IAttendanceDailyUpsertRequest {
    attendanceDate: string;
    branchId?: number;
    attendances: IAttendanceUpsertItemRequest[];
}

export interface IAttendanceDailyConfirmRequest {
    attendanceDate: string;
    branchId?: number;
}

export interface IAttendanceDailyResponse {
    attendanceDate: string;
    branchId?: number;
    branchName?: string;
    totalEmployees: number;
    confirmed: boolean;
    confirmedAt?: string;
    confirmedBy?: string;
    canConfirm: boolean;
    confirmBlockedReason?: string;
    attendances: IAttendanceResponse[];
}
