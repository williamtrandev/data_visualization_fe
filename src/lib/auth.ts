import axiosInstance from "./axios";

export interface RegisterData {
    username: string;
    email: string;
    fullName: string;
    password: string;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    token: string;
}

export interface ResetPasswordData {
    email: string;
    token: string;
    newPassword: string;
    confirmPassword: string;
}

export interface UpdateProfileData {
    fullName: string;
    phone?: string;
    company?: string;
}

export interface VerifyEmailData {
    email: string;
    otp: string;
}

export interface RequestEmailChangeData {
    newEmail: string;
}

export interface VerifyEmailChangeData {
    newEmail: string;
    otp: string;
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
};

export const logout = () => {
    removeAuthToken();
    window.location.href = "/login";
};

export const setAuthToken = (token: string) => {
    localStorage.setItem("token", token);
};

export const getAuthToken = () => {
    return localStorage.getItem("token");
};

export const removeAuthToken = () => {
    localStorage.removeItem("token");
};

export const resetPassword = async (
    data: ResetPasswordData
): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/reset-password", data);
    return response.data;
};

export const updateProfile = async (
    data: UpdateProfileData
): Promise<AuthResponse> => {
    const response = await axiosInstance.put("/auth/profile", data);
    return response.data;
};

export const requestEmailVerification = async (
    email: string
): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/verify-email/request", {
        email,
    });
    return response.data;
};

export const verifyEmail = async (
    data: VerifyEmailData
): Promise<AuthResponse> => {
    const response = await axiosInstance.post(
        "/auth/verify-email/verify",
        data
    );
    return response.data;
};

export const requestEmailChange = async (
    data: RequestEmailChangeData
): Promise<AuthResponse> => {
    const response = await axiosInstance.post(
        "/auth/request-email-change",
        data
    );
    return response.data;
};

export const verifyEmailChange = async (
    data: VerifyEmailChangeData
): Promise<AuthResponse> => {
    const response = await axiosInstance.post(
        "/auth/verify-email-change",
        data
    );
    return response.data;
};
