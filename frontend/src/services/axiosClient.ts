import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    // Bật cờ này để trình duyệt tự động gửi cookie (ví dụ: HttpOnly cookie)
    withCredentials: true,
    validateStatus: () => true, // 🔥 THÊM DÒNG NÀY
});

axiosClient.interceptors.response.use(
    function (response) {
        return response;
    },

    function (error) {
        // TH2: Lỗi từ Axios (400, 401, 403, 500...)
        const message = error?.response?.data?.message;
        return Promise.reject(new Error(message));
    }
);

export default axiosClient;
