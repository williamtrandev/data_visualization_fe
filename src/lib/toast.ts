import { toast } from "sonner";

const toastStyles = {
    success: {
        style: {
            background: "#10B981",
            color: "white",
            border: "none",
        },
        icon: "✅",
    },
    error: {
        style: {
            background: "#EF4444",
            color: "white",
            border: "none",
        },
        icon: "❌",
    },
    warning: {
        style: {
            background: "#F59E0B",
            color: "white",
            border: "none",
        },
        icon: "⚠️",
    },
    info: {
        style: {
            background: "#3B82F6",
            color: "white",
            border: "none",
        },
        icon: "ℹ️",
    },
};

export const customToast = {
    success: (message: string) => {
        toast.success(message, {
            style: toastStyles.success.style,
            icon: toastStyles.success.icon,
            position: "top-right",
            duration: 3000,
        });
    },
    error: (message: string) => {
        toast.error(message, {
            style: toastStyles.error.style,
            icon: toastStyles.error.icon,
            position: "top-right",
            duration: 3000,
        });
    },
    warning: (message: string) => {
        toast.warning(message, {
            style: toastStyles.warning.style,
            icon: toastStyles.warning.icon,
            position: "top-right",
            duration: 3000,
        });
    },
    info: (message: string) => {
        toast.info(message, {
            style: toastStyles.info.style,
            icon: toastStyles.info.icon,
            position: "top-right",
            duration: 3000,
        });
    },
};
