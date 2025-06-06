import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Database, Plus } from "lucide-react";

const AppLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-2">
                <Outlet />
            </main>
            <footer className="border-t border-dashboard-border py-2">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    InsightHub © {new Date().getFullYear()} - Data visualization
                    platform
                </div>
            </footer>
        </div>
    );
};

export default AppLayout;
