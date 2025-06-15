import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, setAuthToken } from "@/lib/auth";
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
import { CheckCircle2, User, Lock } from "lucide-react";

const Login = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await login(formData);
            setAuthToken(response.token);
            toast({
                title: "Success",
                description: response.message,
                className: "bg-green-50 border-green-200",
                icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
            });
            navigate("/");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Login failed",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="w-full max-w-md p-6">
                <Card className="border-none shadow-lg">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-dashboard-primary text-white p-3 rounded-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect
                                        x="3"
                                        y="3"
                                        width="7"
                                        height="7"
                                    ></rect>
                                    <rect
                                        x="14"
                                        y="3"
                                        width="7"
                                        height="7"
                                    ></rect>
                                    <rect
                                        x="14"
                                        y="14"
                                        width="7"
                                        height="7"
                                    ></rect>
                                    <rect
                                        x="3"
                                        y="14"
                                        width="7"
                                        height="7"
                                    ></rect>
                                </svg>
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center">
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="username"
                                    className="text-sm font-medium"
                                >
                                    Username
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="username"
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                username: e.target.value,
                                            })
                                        }
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                password: e.target.value,
                                            })
                                        }
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="link"
                                    className="text-sm text-dashboard-primary hover:text-dashboard-primary/90"
                                    onClick={() => navigate("/forgot-password")}
                                >
                                    Forgot password?
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full bg-dashboard-primary hover:bg-dashboard-primary/90"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                            <p className="text-sm text-center text-muted-foreground">
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className="text-dashboard-primary hover:underline font-medium"
                                >
                                    Register
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
