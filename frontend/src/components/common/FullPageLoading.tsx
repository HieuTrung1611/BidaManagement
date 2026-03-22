"use client";

import Lottie from "lottie-react";
import loadingAnimation from "@/assets/lottie/loadingfullpage.json";

export default function PageLoading() {
    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white dark:bg-neutral-900">
            <div className="w-40">
                <Lottie animationData={loadingAnimation} loop={true} />
            </div>
        </div>
    );
}
