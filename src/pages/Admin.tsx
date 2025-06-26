import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Users,
    CreditCard,
    BarChart2,
    Settings,
    Crown,
    Loader2,
    UserCheck,
    UserX,
    TrendingUp,
} from "lucide-react";
import { adminService } from "@/services/adminService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 10;

const Admin: React.FC = () => {
    const [adminToken, setAdminToken] = useState<string | null>(null);
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState("");

    const [users, setUsers] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [revenue, setRevenue] = useState<{
        totalRevenue: number;
        totalTransactions: number;
    }>({ totalRevenue: 0, totalTransactions: 0 });
    const [revenueLoading, setRevenueLoading] = useState(true);

    const proUsers = users.filter(u => u.isPro).length;
    const freeUsers = users.filter(u => !u.isPro).length;

    useEffect(() => {
        if (adminToken) fetchUsers(page);
    }, [page, adminToken]);

    useEffect(() => {
        if (adminToken) {
            setRevenueLoading(true);
            adminService
                .getProRevenue(adminToken)
                .then((res) => setRevenue(res.data))
                .catch(() =>
                    setRevenue({ totalRevenue: 0, totalTransactions: 0 })
                )
                .finally(() => setRevenueLoading(false));
        }
    }, [adminToken]);

    const fetchUsers = (page: number) => {
        if (!adminToken) return;
        setLoading(true);
        setError("");
        adminService
            .getUsers(adminToken, page, PAGE_SIZE)
            .then((res) => {
                setUsers(res.data.items || []);
                setTotal(res.data.totalCount || 0);
            })
            .catch(() => setError("Không thể tải danh sách user"))
            .finally(() => setLoading(false));
    };

    const totalPages = Math.ceil(total / PAGE_SIZE);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError("");
        try {
            const res = await adminService.adminLogin(
                loginData.username,
                loginData.password
            );
            setAdminToken(res.data.token);
        } catch (err: any) {
            setLoginError(err.response?.data?.message || "Đăng nhập thất bại");
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = () => {
        setAdminToken(null);
        setUsers([]);
        setRevenue({ totalRevenue: 0, totalTransactions: 0 });
        setPage(1);
    };

    if (!adminToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                            <Crown className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-800">Admin Login</CardTitle>
                        <p className="text-gray-600 mt-2">Đăng nhập để quản lý hệ thống</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">Username</label>
                                <Input
                                    value={loginData.username}
                                    onChange={e => setLoginData({ ...loginData, username: e.target.value })}
                                    placeholder="admin"
                                    required
                                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">Password</label>
                                <Input
                                    type="password"
                                    value={loginData.password}
                                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                                    placeholder="••••••••"
                                    required
                                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            {loginError && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{loginError}</div>}
                            <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold" disabled={loginLoading}>
                                {loginLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                                Đăng nhập
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between py-8">
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                                <Crown className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white">Admin Dashboard</h1>
                                <p className="text-blue-100 mt-1">Quản lý toàn bộ hệ thống và người dùng</p>
                            </div>
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={handleLogout} 
                            className="mt-4 md:mt-0 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                        >
                            Đăng xuất
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Tổng người dùng</p>
                                    <p className="text-3xl font-bold">{total}</p>
                                </div>
                                <Users className="h-12 w-12 text-blue-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Người dùng Pro</p>
                                    <p className="text-3xl font-bold">{proUsers}</p>
                                </div>
                                <UserCheck className="h-12 w-12 text-green-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-gray-500 to-gray-600 text-white border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-100 text-sm font-medium">Người dùng Free</p>
                                    <p className="text-3xl font-bold">{freeUsers}</p>
                                </div>
                                <UserX className="h-12 w-12 text-gray-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-100 text-sm font-medium">Doanh thu</p>
                                    <p className="text-3xl font-bold">{revenue.totalRevenue.toLocaleString('vi-VN')}</p>
                                    <p className="text-yellow-200 text-xs">VND</p>
                                </div>
                                <TrendingUp className="h-12 w-12 text-yellow-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                            <CardTitle className="flex items-center gap-3 text-xl font-bold">
                                <Users className="h-6 w-6" /> Danh sách người dùng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
                                </div>
                            ) : error ? (
                                <div className="text-red-500 text-center py-12 bg-red-50 rounded-lg">{error}</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white rounded-lg shadow-lg border border-gray-200">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                                <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">#</th>
                                                <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Username</th>
                                                <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {users.map((u, idx) => (
                                                <tr key={u.id} className="hover:bg-blue-50 transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{u.username}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{u.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {u.isPro ? (
                                                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                                                <Crown className="h-3 w-3" /> Pro
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                                                                Free
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="flex justify-between items-center mt-6 px-2">
                                        <span className="text-sm text-gray-600 font-medium">Tổng: {total} user</span>
                                        <div className="flex items-center gap-3">
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                disabled={page === 1} 
                                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                                className="px-4 py-2 border-blue-300 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Trước
                                            </Button>
                                            <span className="text-sm font-semibold text-gray-700 min-w-[60px] text-center">
                                                {page}/{totalPages || 1}
                                            </span>
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                disabled={page === totalPages || totalPages === 0} 
                                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                className="px-4 py-2 border-blue-300 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Sau
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
                            <CardTitle className="flex items-center gap-3 text-xl font-bold">
                                <CreditCard className="h-6 w-6" /> Thống kê Pro
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {revenueLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="animate-spin h-8 w-8 text-yellow-500" />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <div className="text-4xl font-extrabold text-yellow-600 mb-2">{revenue.totalTransactions}</div>
                                        <div className="text-sm text-gray-600">Giao dịch thành công</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600 mb-2">{revenue.totalRevenue.toLocaleString('vi-VN')}</div>
                                        <div className="text-sm text-gray-600">VND doanh thu</div>
                                    </div>
                                    <div className="bg-white/50 rounded-lg p-4 text-center">
                                        <div className="text-sm text-gray-700">
                                            Tỷ lệ chuyển đổi: {total > 0 ? ((proUsers / total) * 100).toFixed(1) : 0}%
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Admin;
