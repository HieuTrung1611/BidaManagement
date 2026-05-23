import { IBaseResponse } from "./base";

export type SessionStatus = "ONGOING" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "PAID" | "UNPAID" | "PENDING" | "DEBT";

export interface IStartSessionRequest {
    tableId: number;
    customerId: number | null; // Optional: for member benefits
    notes?: string;
}

export interface ISessionProductRequest {
    sessionId: number;
    productId: number;
    quantity: number;
}

export interface ISessionEquipmentRequest {
    sessionId: number;
    equipmentId: number;
    quantity: number;
}

export interface ISessionComboRequest {
    sessionId: number;
    comboId: number;
    quantity: number;
}

export interface ISessionProductResponse extends IBaseResponse {
    sessionId: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
}

export interface ISessionEquipmentResponse extends IBaseResponse {
    sessionId: number;
    equipmentId: number;
    equipmentName: string;
    quantity: number;
    startTime: string;
    endTime: string | null;
    hourlyRate: number;
    durationHours: number | null;
    totalAmount: number | null;
    isReturned: boolean;
}

export interface ISessionComboResponse extends IBaseResponse {
    sessionId: number;
    comboId: number;
    comboName: string;
    quantity: number;
    price: number;
    totalAmount: number;
}

export interface IBilliardSessionResponse extends IBaseResponse {
    tableId: number;
    tableName?: string;
    tableType: string;
    customerId: number;
    customerName: string;
    customerPhone: string;
    branchId: number;
    branchName: string;
    startTime: string;
    endTime: string | null;
    durationHours: number;
    status: SessionStatus;
    totalAmount: number;
    notes: string | null;
    isSelfService?: boolean;
    paymentStatus?: PaymentStatus;
    customerPhoneForDebt?: string;
}

export interface ISessionWithDetails extends IBilliardSessionResponse {
    tableName: string;
    products: ISessionProductResponse[];
    combos: ISessionComboResponse[];
    equipments: ISessionEquipmentResponse[];
}
