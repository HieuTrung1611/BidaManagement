"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useBranch } from "@/hooks/useBranch";
import Badge from "@/components/ui/badge/Badge";
import Breadcrumbs, { BreadcrumbItem } from "@/components/common/Breadcrumbs";
import { formatDate } from "@/utils/date";
import ROUTES from "@/constants/routes";
import branchService from "@/services/branchService";
import { useToast } from "@/context/ToastContext";
import { BranchFormData, BranchModal } from "./branchList/BranchModal";
import { Modal } from "@/components/ui/modal";
import DetailField from "@/components/common/DetailField";
import {
    CalendarDays,
    FileText,
    MapPin,
    Phone,
    User,
    UserStar,
} from "lucide-react";
import Image from "next/image";
import ImageSlideshow from "@/components/common/ImageSlideShow";
import EmployeeListTab from "../employee/EmployeeListTab";

interface BranchDetailPageProps {
    id: number;
}

const BranchDetailPage: React.FC<BranchDetailPageProps> = ({ id }) => {
    const router = useRouter();
    const toast = useToast();
    const { branch, isLoading, isError, mutate } = useBranch(id);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsSubmitting(true);
            const response = await branchService.deleteBranchById(id);
            if (response.success) {
                toast.success("Thành công", "Xóa chi nhánh thành công");
                router.push(ROUTES.BRANCH.path);
            } else {
                toast.error(
                    "Lỗi",
                    response.message || "Không thể xóa chi nhánh",
                );
            }
        } catch (error) {
            console.error("Error deleting branch:", error);
            toast.error("Lỗi", "Không thể xóa chi nhánh");
        } finally {
            setIsSubmitting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const handleEditSubmit = async (data: BranchFormData, id?: number) => {
        if (!id) {
            return;
        }

        try {
            setIsSubmitting(true);
            const { images, ...payload } = data;
            const response = await branchService.updateBranchById(
                id,
                payload,
                images && images.length > 0 ? images : undefined,
            );
            if (response.success === true) {
                toast.success("Thành công", "Cập nhật chi nhánh thành công");
                mutate();
                setIsEditModalOpen(false);
            } else {
                toast.error(
                    "Lỗi",
                    response.message || "Không thể cập nhật chi nhánh",
                );
            }
        } catch (error) {
            console.error("Error updating branch:", error);
            toast.error("Lỗi", "Không thể cập nhật chi nhánh");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderFallback = (value?: string | number | null) => {
        if (value === undefined || value === null || value === "") {
            return <span className="text-muted-foreground">Chưa có</span>;
        }
        return value;
    };

    const LoadingState = () => (
        <Card>
            <CardHeader>
                <CardTitle>Đang tải chi tiết chi nhánh...</CardTitle>
                <CardDescription>Vui lòng đợi trong giây lát.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="grid gap-2">
                            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                            <div className="h-10 w-full animate-pulse rounded border bg-muted" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );

    const ErrorState = () => (
        <Card>
            <CardHeader>
                <CardTitle>Không thể tải chi tiết chi nhánh</CardTitle>
                <CardDescription>
                    Vui lòng thử lại sau hoặc liên hệ quản trị viên.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" onClick={() => router.back()}>
                    Quay lại
                </Button>
            </CardContent>
        </Card>
    );

    if (isLoading) {
        return <LoadingState />;
    }

    if (isError || !branch) {
        return <ErrorState />;
    }

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: ROUTES.BRANCH.title, href: ROUTES.BRANCH.path },
        { label: ROUTES.BRANCHDETAIL.title },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Breadcrumbs items={breadcrumbItems} />
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditModalOpen(true)}
                        disabled={isSubmitting}>
                        Chỉnh sửa
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setIsDeleteModalOpen(true)}
                        disabled={isSubmitting}>
                        Xóa
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>{branch.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-start gap-3">
                                <DetailField
                                    label="Địa chỉ"
                                    value={renderFallback(branch.address)}
                                    className="gap-1"
                                    valueClassName="text-base font-semibold"
                                    icon={<MapPin />}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <DetailField
                                    label="Người quản lý"
                                    value={renderFallback(branch.managerName)}
                                    icon={<UserStar />}
                                />
                                <DetailField
                                    label="Số điện thoại quản lý"
                                    value={renderFallback(
                                        branch.managerPhoneNumber,
                                    )}
                                    icon={<Phone />}
                                />
                                <DetailField
                                    label="Mô tả"
                                    value={renderFallback(branch.description)}
                                    icon={<FileText />}
                                />
                            </div>
                            {branch.branchImages &&
                                branch.branchImages.length > 0 && (
                                    <Card className="p-6 mt-6">
                                        <h3 className="text-lg font-semibold mb-4">
                                            Hình ảnh chi nhánh
                                        </h3>
                                        <ImageSlideshow
                                            images={branch.branchImages}
                                            alt={branch.name}
                                            slidesToShow={3}
                                            autoPlay={true}
                                            interval={5000}
                                        />
                                    </Card>
                                )}

                            <div className="grid gap-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Nhân viên
                                </label>
                                {branch.employeesCount === undefined ||
                                branch.employeesCount === null ? (
                                    <span className="text-muted-foreground">
                                        Chưa có nhân viên
                                    </span>
                                ) : (
                                    <DetailField
                                        label="Nhân viên"
                                        value={`${branch.employeesCount} nhân viên`}
                                        icon={<User />}
                                    />
                                )}
                                <EmployeeListTab branchId={branch.id} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin bổ sung</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <DetailField label="ID" value={branch.id} />
                            <DetailField
                                label="Trạng thái"
                                value="Hoạt động"
                                valueClassName="text-green-500"
                            />

                            <div className="border-t pt-6">
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                                    {branch.createdAt && (
                                        <DetailField
                                            label="Ngày tạo"
                                            value={formatDate(branch.createdAt)}
                                            icon={
                                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                            }
                                        />
                                    )}
                                    <DetailField
                                        label="Người tạo"
                                        value={renderFallback(branch.createdBy)}
                                        icon={
                                            <User className="h-4 w-4 text-muted-foreground" />
                                        }
                                    />
                                    {branch.updatedAt && (
                                        <DetailField
                                            label="Cập nhật lần cuối"
                                            value={formatDate(branch.updatedAt)}
                                            icon={
                                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                            }
                                        />
                                    )}
                                    <DetailField
                                        label="Người chỉnh sửa cuối cùng"
                                        value={renderFallback(branch.updatedBy)}
                                        icon={
                                            <User className="h-4 w-4 text-muted-foreground" />
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <BranchModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleEditSubmit}
                isSubmitting={isSubmitting}
                initialData={branch}
            />

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                className="max-w-md p-6">
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    Xác nhận xóa
                </h3>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    Bạn có chắc chắn muốn xóa chi nhánh
                    <span className="font-medium"> "{branch.name}"</span>? Hành
                    động này không thể hoàn tác.
                </p>
                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setIsDeleteModalOpen(false)}
                        disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        disabled={isSubmitting}>
                        {isSubmitting ? "Đang xóa..." : "Xóa"}
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default BranchDetailPage;
