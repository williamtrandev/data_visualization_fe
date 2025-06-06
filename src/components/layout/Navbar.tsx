import React from "react";
import { Link } from "react-router-dom";
import {
    Search,
    Settings,
    User,
    LogOut,
    LayoutDashboard,
    Database,
    Users,
    FileText,
    Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
    return (
        <header className="w-full border-b border-dashboard-border">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-dashboard-primary text-white p-1 rounded">
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
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                        </div>
                        <span className="font-bold text-xl tracking-tight">
                            InsightHub
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-4">
                        <Link
                            to="/"
                            className="text-sm font-medium hover:text-dashboard-primary transition-colors flex items-center gap-1"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboards
                        </Link>
                        <Link
                            to="/reports"
                            className="text-sm font-medium hover:text-dashboard-primary transition-colors flex items-center gap-1"
                        >
                            <FileText className="h-4 w-4" />
                            Reports
                        </Link>
                        <Link
                            to="/workspaces"
                            className="text-sm font-medium hover:text-dashboard-primary transition-colors flex items-center gap-1"
                        >
                            <Users className="h-4 w-4" />
                            Workspaces
                        </Link>
                        <Link
                            to="/data"
                            className="text-sm font-medium hover:text-dashboard-primary transition-colors flex items-center gap-1"
                        >
                            <Database className="h-4 w-4" />
                            Data Sources
                        </Link>
                        <Link
                            to="/datasets/merge"
                            className="text-sm font-medium hover:text-dashboard-primary transition-colors flex items-center gap-1"
                        >
                            <Plus className="h-4 w-4" />
                            Merge Datasets
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <input
                            className="h-9 rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Search dashboards..."
                        />
                    </div>

                    <Button variant="ghost" size="icon">
                        <Settings className="h-5 w-5" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                            >
                                <User className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={logout}
                                className="text-red-600"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
