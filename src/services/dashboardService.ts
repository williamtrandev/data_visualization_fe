import axiosInstance from "@/lib/axios";
import { DashboardItem } from "@/types/dashboard";

export interface CreateDashboardRequest {
    title: string;
    items?: DashboardItem[];
}

export interface UpdateDashboardRequest {
    id: number;
    title: string;
    items?: DashboardItem[];
}

export interface Dashboard {
    id: number;
    title: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    items: DashboardItem[];
}

export interface DashboardListItem {
    id: number;
    title: string;
    createdAt: string;
    updatedAt: string;
    chartCount: number;
    firstChartType: string;
}

export const dashboardService = {
    createDashboard: async (
        data: CreateDashboardRequest
    ): Promise<{ message: string; dashboardId: number }> => {
        try {
            const response = await axiosInstance.post("/Dashboard", data);
            return response.data;
        } catch (error) {
            console.error("Error creating dashboard:", error);
            throw error;
        }
    },

    updateDashboard: async (
        data: UpdateDashboardRequest
    ): Promise<{ message: string }> => {
        try {
            const response = await axiosInstance.put("/Dashboard", data);
            return response.data;
        } catch (error) {
            console.error("Error updating dashboard:", error);
            throw error;
        }
    },

    getDashboard: async (dashboardId: number): Promise<Dashboard> => {
        try {
            const response = await axiosInstance.get(
                `/Dashboard/${dashboardId}`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching dashboard:", error);
            throw error;
        }
    },

    getDashboards: async (): Promise<DashboardListItem[]> => {
        try {
            const response = await axiosInstance.get("/Dashboard");
            return response.data;
        } catch (error) {
            console.error("Error fetching dashboards:", error);
            throw error;
        }
    },

    deleteDashboard: async (
        dashboardId: number
    ): Promise<{ message: string }> => {
        try {
            const response = await axiosInstance.delete(
                `/Dashboard/${dashboardId}`
            );
            return response.data;
        } catch (error) {
            console.error("Error deleting dashboard:", error);
            throw error;
        }
    },
};
