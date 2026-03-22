"use client";
import { useTitle } from "@/context/TitleContext";
import React, { useEffect } from "react";

const AdminHome = () => {
    const { setTitle } = useTitle();

    useEffect(() => {
        setTitle("Tổng quan hệ thống");
    }, [setTitle]);

    return <div>AdminDashboard</div>;
};

export default AdminHome;
