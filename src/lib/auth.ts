import axiosInstance from "./axios";

export interface RegisterData {
    username: string;
    email: string;
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
