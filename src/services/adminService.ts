import axiosInstance from "@/lib/axios";

export const adminService = {
    adminLogin: (username: string, password: string) =>
        axiosInstance.post("/auth/admin-login", { username, password }),
    getUsers: (token: string, page = 1, pageSize = 10) =>
        axiosInstance.get("/auth/users", {
            params: { page, pageSize },
            headers: { Authorization: `Bearer ${token}` },
        }),
    getProRevenue: (token: string) =>
        axiosInstance.get("/auth/payment/total-revenue", {
            headers: { Authorization: `Bearer ${token}` },
        }),
};
