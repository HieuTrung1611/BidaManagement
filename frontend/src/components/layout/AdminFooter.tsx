import Link from "next/link";
import React from "react";

const AdminFooter = () => {
    return (
        <div className="w-full flex justify-center items-center text-neutral-700  dark:text-neutral-400  py-4 mt-8">
            © 2025 Designed & Developed by
            <Link
                href="https://www.linkedin.com/in/nhat-minh-pham-977776279/"
                className="ml-1 underline font-semibold hover:text-neutral-900 dark:hover:text-neutral-200">
                klnvz
            </Link>
        </div>
    );
};

export default AdminFooter;
