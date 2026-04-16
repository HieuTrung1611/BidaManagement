export interface IShiftResponse {
    id: number;
    name: string;
    code: string;
    description: string;
    startTime: string;
    endTime: string;
}

export interface IShiftRequest {
    name: string;
    code: string;
    description: string;
    startTime: string;
    endTime: string;
}
