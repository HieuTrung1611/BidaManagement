// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";
import ROUTES from "./constants/routes";

const JWT_SECRET = process.env.JWT_SECRET;
const LOGIN_URL = "/login";
const ADMIN_URL = "/admin";

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env.local");
}

// Middleware async
export default async function middleware(request: NextRequest) {
    const token = request.cookies.get("JWT_TOKEN")?.value;
    const url = request.nextUrl.clone();

    const secret = new TextEncoder().encode(JWT_SECRET);

    // Áp dụng cho các đường dẫn /admin
    if (url.pathname.startsWith(ADMIN_URL)) {
        if (!token) {
            url.pathname = LOGIN_URL;
            return NextResponse.redirect(url);
        }

        try {
            // Verify JWT async
            await jose.jwtVerify(token, secret);

            // Token hợp lệ → đi tiếp
            return NextResponse.next();
        } catch (error) {
            console.error("JWT Verification Failed:", error);
            url.pathname = LOGIN_URL;
            return NextResponse.redirect(url);
        }
    }

    // Nếu truy cập /auth → có token hợp lệ thì redirect về /admin
    if (url.pathname === LOGIN_URL) {
        if (token) {
            try {
                await jose.jwtVerify(token, secret);
                url.pathname = ROUTES.HOMEADMIN.path;
                return NextResponse.redirect(url);
            } catch {
                // Token invalid → vẫn cho vào trang login
                return NextResponse.next();
            }
        }
    }
    // Các đường dẫn khác → cho đi tiếp
    return NextResponse.next();
}

// Chỉ áp dụng cho /admin và tất cả sub-path
export const config = {
    matcher: ["/admin/:path*", "/login"],
};
