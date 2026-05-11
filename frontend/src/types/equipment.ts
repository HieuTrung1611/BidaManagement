import { IBaseResponse } from "./base";

export type EquipmentType = "STICK" | "CHALK" | "GLOVES" | "BRIDGE" | "OTHER";

export interface IEquipmentRequest {
    name: string;
    description: string | null;
    type: EquipmentType;
    rentalPricePerHour: number;
    totalQuantity: number;
    availableQuantity: number;
    branchId: number;
    isActive: boolean;
}

export interface IEquipmentResponse extends IBaseResponse {
    name: string;
    description: string | null;
    type: EquipmentType;
    rentalPricePerHour: number;
    totalQuantity: number;
    availableQuantity: number;
    branchId: number;
    branchName: string;
    isActive: boolean;
}
