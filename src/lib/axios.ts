import axios from "axios";
import { removeAuthToken } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors here
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            switch (error.response.status) {
                case 401:
                    // Handle unauthorized
                    removeAuthToken();
                    window.location.href = "/login";
                    break;
                case 403:
                    // Handle forbidden
                    break;
                case 404:
                    // Handle not found
                    break;
                case 500:
                    // Handle server error
                    break;
                default:
                    break;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
