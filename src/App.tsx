import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import DashboardList from "@/pages/DashboardList";
import DashboardEditor from "@/pages/DashboardEditor";
import DashboardViewer from "@/pages/DashboardViewer";
import DataSourceManager from "@/pages/DataSourceManager";
import WorkspaceList from "@/pages/WorkspaceList";
import WorkspaceEditor from "@/pages/WorkspaceEditor";
import ReportList from "@/pages/ReportList";
import ReportEditor from "@/pages/ReportEditor";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { getAuthToken } from "@/lib/auth";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = getAuthToken();
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    const token = getAuthToken();
    if (token) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <AuthRoute>
                                <Login />
                            </AuthRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <AuthRoute>
                                <Register />
                            </AuthRoute>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <AppLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<DashboardList />} />
                        <Route
                            path="dashboard/new"
                            element={<DashboardEditor />}
                        />
                        <Route
                            path="dashboard/edit/:id"
                            element={<DashboardEditor />}
                        />
                        <Route
                            path="dashboard/:id"
                            element={<DashboardViewer />}
                        />
                        <Route path="data" element={<DataSourceManager />} />
                        <Route path="workspaces" element={<WorkspaceList />} />
                        <Route
                            path="workspace/new"
                            element={<WorkspaceEditor />}
                        />
                        <Route
                            path="workspace/edit/:id"
                            element={<WorkspaceEditor />}
                        />
                        <Route path="reports" element={<ReportList />} />
                        <Route path="report/new" element={<ReportEditor />} />
                        <Route
                            path="report/edit/:id"
                            element={<ReportEditor />}
                        />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
