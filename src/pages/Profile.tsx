import { useState, useEffect } from "react";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    User,
    Mail,
    Pencil,
    Check,
    X,
    Building,
    Phone,
    Lock,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import {
    updateProfile,
    requestEmailChange,
    verifyEmailChange,
} from "@/lib/auth";

interface UserProfile {
    id: number;
    username: string;
    email: string;
    fullName: string;
    phone?: string;
    company?: string;
}

const Profile = () => {
    const { toast } = useToast();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        fullName: "",
        phone: "",
        company: "",
    });
    const [showEmailDialog, setShowEmailDialog] = useState(false);
    const [emailStep, setEmailStep] = useState<"input" | "verify">("input");
    const [emailData, setEmailData] = useState({
        newEmail: "",
        otp: "",
    });
    const [isRequestingOTP, setIsRequestingOTP] = useState(false);
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axiosInstance.get("/auth/profile");
            setProfile(response.data);
            setEditData({
                fullName: response.data.fullName || "",
                phone: response.data.phone || "",
                company: response.data.company || "",
            });
        } catch (error: any) {
            setError(error.response?.data?.message || "Failed to load profile");
            toast({
                title: "Error",
                description:
                    error.response?.data?.message || "Failed to load profile",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({
            fullName: profile?.fullName || "",
            phone: profile?.phone || "",
            company: profile?.company || "",
        });
    };

    const handleSave = async () => {
        try {
            const response = await updateProfile(editData);
            setProfile((prev) => (prev ? { ...prev, ...editData } : null));
            setIsEditing(false);
            toast({
                title: "Success",
                description: response.message,
                className: "bg-green-50 border-green-200",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message || "Failed to update profile",
                variant: "destructive",
            });
        }
    };

    const handleRequestOTP = async () => {
        if (!emailData.newEmail) {
            toast({
                title: "Error",
                description: "Please enter a new email address",
                variant: "destructive",
            });
            return;
        }

        setIsRequestingOTP(true);
        try {
            await requestEmailChange({ newEmail: emailData.newEmail });
            setEmailStep("verify");
            toast({
                title: "Success",
                description: "OTP has been sent to your new email",
                className: "bg-green-50 border-green-200",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message || "Failed to send OTP",
                variant: "destructive",
            });
        } finally {
            setIsRequestingOTP(false);
        }
    };

    const handleVerifyEmail = async () => {
        if (!emailData.otp) {
            toast({
                title: "Error",
                description: "Please enter the OTP",
                variant: "destructive",
            });
            return;
        }

        setIsVerifyingEmail(true);
        try {
            const response = await verifyEmailChange({
                newEmail: emailData.newEmail,
                otp: emailData.otp,
            });
            setProfile((prev) =>
                prev ? { ...prev, email: emailData.newEmail } : null
            );
            setShowEmailDialog(false);
            setEmailStep("input");
            setEmailData({ newEmail: "", otp: "" });
            toast({
                title: "Success",
                description: response.message,
                className: "bg-green-50 border-green-200",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message || "Failed to verify email",
                variant: "destructive",
            });
        } finally {
            setIsVerifyingEmail(false);
        }
    };

    const handleCloseEmailDialog = () => {
        setShowEmailDialog(false);
        setEmailStep("input");
        setEmailData({ newEmail: "", otp: "" });
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({
                title: "Error",
                description: "New passwords do not match",
                variant: "destructive",
            });
            return;
        }

        setIsChangingPassword(true);
        try {
            await axiosInstance.post("/auth/change-password", {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword,
            });
            setShowPasswordDialog(false);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            toast({
                title: "Success",
                description: "Password has been changed successfully",
                className: "bg-green-50 border-green-200",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message ||
                    "Failed to change password",
                variant: "destructive",
            });
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dashboard-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center text-red-600">
                            Error
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
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-dashboard-primary text-white p-3 rounded-full">
                                    <User className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold">
                                        Profile Information
                                    </CardTitle>
                                    <CardDescription>
                                        Your personal account details
                                    </CardDescription>
                                </div>
                            </div>
                            {!isEditing ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleEdit}
                                    className="flex items-center gap-2"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Edit Profile
                                </Button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCancel}
                                        className="flex items-center gap-2"
                                    >
                                        <X className="h-4 w-4" />
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleSave}
                                        className="flex items-center gap-2 bg-dashboard-primary hover:bg-dashboard-primary/90"
                                    >
                                        <Check className="h-4 w-4" />
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Username
                                </label>
                                <Input
                                    value={profile?.username}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        value={profile?.email}
                                        disabled
                                        className="bg-muted flex-1"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setEmailData({
                                                newEmail: "",
                                                otp: "",
                                            });
                                            setEmailStep("input");
                                            setShowEmailDialog(true);
                                        }}
                                    >
                                        Change
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <Input
                                        value={editData.fullName}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                fullName: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    <Input
                                        value={profile?.fullName}
                                        disabled
                                        className="bg-muted"
                                    />
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    Phone
                                </label>
                                {isEditing ? (
                                    <Input
                                        value={editData.phone}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                phone: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    <Input
                                        value={profile?.phone || ""}
                                        disabled
                                        className="bg-muted"
                                    />
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Building className="h-4 w-4" />
                                    Company
                                </label>
                                {isEditing ? (
                                    <Input
                                        value={editData.company}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                company: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    <Input
                                        value={profile?.company || ""}
                                        disabled
                                        className="bg-muted"
                                    />
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-dashboard-primary text-white p-3 rounded-full">
                                    <Lock className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold">
                                        Security
                                    </CardTitle>
                                    <CardDescription>
                                        Manage your password and security
                                        settings
                                    </CardDescription>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    Password
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        type="password"
                                        value="••••••••"
                                        disabled
                                        className="bg-muted flex-1"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setShowPasswordDialog(true)
                                        }
                                    >
                                        Change
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Email Dialog */}
                <Dialog
                    open={showEmailDialog}
                    onOpenChange={handleCloseEmailDialog}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {emailStep === "input"
                                    ? "Change Email"
                                    : "Verify New Email"}
                            </DialogTitle>
                            <DialogDescription>
                                {emailStep === "input"
                                    ? "Enter your new email address"
                                    : "Enter the OTP sent to your new email address"}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {emailStep === "input" ? (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        New Email
                                    </label>
                                    <Input
                                        type="email"
                                        value={emailData.newEmail}
                                        onChange={(e) =>
                                            setEmailData({
                                                ...emailData,
                                                newEmail: e.target.value,
                                            })
                                        }
                                        placeholder="Enter new email address"
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        OTP
                                    </label>
                                    <Input
                                        value={emailData.otp}
                                        onChange={(e) =>
                                            setEmailData({
                                                ...emailData,
                                                otp: e.target.value,
                                            })
                                        }
                                        placeholder="Enter OTP"
                                    />
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={handleCloseEmailDialog}
                            >
                                Cancel
                            </Button>
                            {emailStep === "input" ? (
                                <Button
                                    onClick={handleRequestOTP}
                                    disabled={isRequestingOTP}
                                    className="bg-dashboard-primary hover:bg-dashboard-primary/90"
                                >
                                    {isRequestingOTP
                                        ? "Sending..."
                                        : "Send OTP"}
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleVerifyEmail}
                                    disabled={isVerifyingEmail}
                                    className="bg-dashboard-primary hover:bg-dashboard-primary/90"
                                >
                                    {isVerifyingEmail
                                        ? "Verifying..."
                                        : "Verify & Save"}
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Password Dialog */}
                <Dialog
                    open={showPasswordDialog}
                    onOpenChange={setShowPasswordDialog}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogDescription>
                                Enter your current password and choose a new one
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    Current Password
                                </label>
                                <Input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            currentPassword: e.target.value,
                                        })
                                    }
                                    placeholder="Enter your current password"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    New Password
                                </label>
                                <Input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            newPassword: e.target.value,
                                        })
                                    }
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    Confirm New Password
                                </label>
                                <Input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            confirmPassword: e.target.value,
                                        })
                                    }
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowPasswordDialog(false);
                                    setPasswordData({
                                        currentPassword: "",
                                        newPassword: "",
                                        confirmPassword: "",
                                    });
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleChangePassword}
                                disabled={isChangingPassword}
                                className="bg-dashboard-primary hover:bg-dashboard-primary/90"
                            >
                                {isChangingPassword
                                    ? "Changing..."
                                    : "Change Password"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Profile;
