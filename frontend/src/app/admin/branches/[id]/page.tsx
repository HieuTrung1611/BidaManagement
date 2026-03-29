import React from "react";
import BranchDetailPage from "@/modules/branch/BranchDetailPage";

export default async function BranchDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const branchId = Number(id);
    return <BranchDetailPage id={branchId} />;
}
