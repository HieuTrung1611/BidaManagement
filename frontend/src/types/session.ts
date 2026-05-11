import { IBaseResponse } from "./base";

export type SessionStatus = "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";

export interface ISessionProductRequest {
    productId: number;
    quantity: number;
}

export interface ISessionEquipmentRequest {
    equipmentId: number;
    quantity: number;
}

export interface ISessionComboRequest {
    comboId: number;
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
    price: number;
    totalAmount: number;
}

export interface IBilliardSessionResponse extends IBaseResponse {
    tableId: number;
    tableName: string;
    customerId: number | null;
    customerName: string | null;
    branchId: number;
    branchName: string;
    startTime: string;
    endTime: string | null;
    status: SessionStatus;
}

export interface IInvoiceDTO {
    sessionId: number;
    sessionStatus: SessionStatus;
    startTime: string;
    endTime: string | null;
    durationHours: number;
    tableName: string;
    tableType: string;
    tableHourlyRate: number;
    customerName: string | null;
    customerPhone: string | null;
    customerRank: string | null;
    branchName: string;
    branchAddress: string;
    branchPhone: string;
    tableRentalCost: number;
    combos: ISessionComboResponse[];
    combosCost: number;
    products: ISessionProductResponse[];
    productsCost: number;
    equipments: ISessionEquipmentResponse[];
    equipmentsCost: number;
    subtotal: number;
    discountPercent: number;
    discountAmount: number;
    totalAmount: number;
}
