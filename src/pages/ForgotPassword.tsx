import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import axiosInstance from "@/lib/axios";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axiosInstance.post("/auth/forgot-password", { email });
            toast({
                title: "Success",
                description:
                    "Password reset instructions have been sent to your email",
                className: "bg-green-50 border-green-200",
            });
            navigate("/login");
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message ||
                    "Failed to send reset instructions",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate("/login")}
                            className="hover:bg-transparent"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <CardTitle className="text-2xl font-bold">
                                Forgot Password
                            </CardTitle>
                            <CardDescription>
                                Enter your email to receive password reset
                                instructions
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium"
                            >
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-dashboard-primary hover:bg-dashboard-primary/90"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Reset Instructions"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;
