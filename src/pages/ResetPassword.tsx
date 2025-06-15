import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, Lock } from "lucide-react";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        email: "",
        token: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const email = searchParams.get("email");
        const token = searchParams.get("token");

        if (!email || !token) {
            setError("Invalid reset password link");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            email,
            token,
        }));
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);
        try {
            const response = await resetPassword(formData);
            toast({
                title: "Success",
                description: response.message,
                className: "bg-green-50 border-green-200",
                icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
            });
            navigate("/login");
        } catch (error: any) {
            setError(
                error.response?.data?.message || "Failed to reset password"
            );
            toast({
                title: "Error",
                description:
                    error.response?.data?.message || "Failed to reset password",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (error && !formData.email && !formData.token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <Card className="w-full max-w-md border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center text-red-600">
                            Invalid Link
                        </CardTitle>
                        <CardDescription className="text-center">
                            {error}
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="w-full max-w-md p-6">
                <Card className="border-none shadow-lg">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-dashboard-primary text-white p-3 rounded-lg">
                                <Lock className="h-6 w-6" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center">
                            Reset Password
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your new password below
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="newPassword"
                                    className="text-sm font-medium"
                                >
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={formData.newPassword}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                newPassword: e.target.value,
                                            })
                                        }
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="confirmPassword"
                                    className="text-sm font-medium"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                confirmPassword: e.target.value,
                                            })
                                        }
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>
                            {error && (
                                <p className="text-sm text-red-600">{error}</p>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full bg-dashboard-primary hover:bg-dashboard-primary/90"
                                disabled={loading}
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
