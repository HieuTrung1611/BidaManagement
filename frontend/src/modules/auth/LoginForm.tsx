"use client";
import * as React from "react";
import { ILoginReq } from "@/types/auth";
import authService from "@/services/authService";
import { ChevronLeft, EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "../../components/ui/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { useToast } from "@/context/ToastContext";
import ROUTES from "@/constants/routes";
import Footer from "../../components/common/Footer";
import LogoMHBilliards from "../../components/common/Logo";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
    const [loginData, setLoginData] = React.useState<ILoginReq>({
        username: "",
        password: "",
    });
    const { reloadUser } = useAuth();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const router = useRouter();

    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const { success, error } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 1. Lấy tên trường
        const { name, value } = e.target;

        // Cập nhật state một cách dynamic
        setLoginData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await authService.login(loginData);
            if (result.success) {
                success("Đăng nhập thành công!", result.message);
                await reloadUser();
            } else {
                error("Đăng nhập thất bại!", result.message);
            }
            router.push(ROUTES.HOMEADMIN.path);
        } catch (err: any) {
            error("Đăng nhập thất bại!", err.message);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex flex-col px-8 py-8">
            {/* Form with background */}
            <div className="bg-white/30 dark:bg-neutral-800/30 backdrop-blur-md border border-white/10 rounded-lg p-6 mb-6">
                {/* Back button */}
                <div className="flex justify-start">
                    <Link
                        href={ROUTES.HOME.path}
                        className="inline-flex items-center text-neutral-400 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-white">
                        <ChevronLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            Quay lại trang chủ
                        </span>
                    </Link>
                </div>
                {/* Logo section */}
                <div className="flex justify-center my-6">
                    <div className="flex items-center gap-3">
                        <LogoMHBilliards />
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-kkul bold">
                                MHBilliards
                            </h1>
                            <span className="text-sm font-kkul">
                                The best billiards club
                            </span>
                        </div>
                    </div>
                </div>

                <form className="w-full space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <p className="text-neutral-400">
                            Tên đăng nhập<span className="text-red-500">*</span>
                        </p>
                        <Input
                            className="border-neutral-400"
                            type="text"
                            placeholder="VD: dat.minh@company.com"
                            name="username"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <p className="text-neutral-400">
                            Mật khẩu <span className="text-red-500">*</span>
                        </p>
                        <div className="relative">
                            <Input
                                className="border-neutral-400"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Tối thiểu 8 ký tự"
                                onChange={handleChange}
                            />

                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                                {showPassword ? (
                                    <EyeIcon className="w-4 text-neutral-400" />
                                ) : (
                                    <EyeOffIcon className="w-4 text-neutral-400" />
                                )}
                            </span>
                        </div>
                        <div className="flex">
                            <Link
                                href="/reset-password"
                                className="ml-auto text-sm text-neutral-500 hover:text-neutral-800">
                                Quên mật khẩu?
                            </Link>
                        </div>
                    </div>

                    <Button
                        className="w-full"
                        type="submit"
                        disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            "Đăng nhập"
                        )}
                    </Button>
                </form>
                <div className="w-full flex justify-center mt-6">
                    <Footer />
                </div>
            </div>
        </div>
    );
}
