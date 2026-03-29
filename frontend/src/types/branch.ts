import { IBaseResponse } from "./base";

export interface IBranchCreationRequest {
    name: string;
    address: string;
    description: string;
}

export interface IBranchUpdationRequest {
    name: string;
    address: string;
    description: string;
    deleteImageIds?: number[]; // Thêm trường này để gửi danh sách ID ảnh cần xóa
}

export interface IbranchImage {
    id: number;
    url: string;
    publicId: string;
}
export interface IBranchResponse extends IBranchCreationRequest {
    id: number;
    managerName: string;
    managerPhoneNumber: string;
    employeesCount: number;
    branchImages: IbranchImage[];
}

export interface IBranchDetailResponse extends IBranchResponse, IBaseResponse {}
