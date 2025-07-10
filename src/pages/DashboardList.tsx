import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    Plus,
    Filter,
    BarChart,
    PieChart,
    LineChart,
    Table,
    Trash2,
    MoreVertical,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    dashboardService,
    DashboardListItem,
} from "@/services/dashboardService";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const getThumbnailIcon = (type: string) => {
    switch (type) {
        case "bar":
            return (
                <BarChart className="h-20 w-20 text-dashboard-primary opacity-20" />
            );
        case "pie":
            return (
                <PieChart className="h-20 w-20 text-dashboard-accent opacity-20" />
            );
        case "line":
            return (
                <LineChart className="h-20 w-20 text-dashboard-secondary opacity-20" />
            );
        case "table":
            return (
                <Table className="h-20 w-20 text-muted-foreground opacity-20" />
            );
        default:
            return (
                <BarChart className="h-20 w-20 text-dashboard-primary opacity-20" />
            );
    }
};

const DashboardList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [dashboards, setDashboards] = useState<DashboardListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [dashboardToDelete, setDashboardToDelete] =
        useState<DashboardListItem | null>(null);

    useEffect(() => {
        const fetchDashboards = async () => {
            try {
                const data = await dashboardService.getDashboards();
                setDashboards(data);
            } catch (err) {
                setError("Failed to fetch dashboards");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboards();
    }, []);

    const handleDeleteClick = (
        dashboard: DashboardListItem,
        e: React.MouseEvent
    ) => {
        e.preventDefault();
        e.stopPropagation();
        setDashboardToDelete(dashboard);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!dashboardToDelete) return;

        try {
            await dashboardService.deleteDashboard(dashboardToDelete.id);
            setDashboards((prev) =>
                prev.filter((d) => d.id !== dashboardToDelete.id)
            );
            toast.success("Dashboard deleted successfully");
        } catch (error) {
            console.error("Error deleting dashboard:", error);
            toast.error("Failed to delete dashboard");
        } finally {
            setDeleteDialogOpen(false);
            setDashboardToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setDashboardToDelete(null);
    };

    const filteredDashboards = dashboards.filter((dashboard) =>
        dashboard.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Dashboards
                    </h1>
                    <p className="text-muted-foreground">
                        Create and manage your data visualizations
                    </p>
                </div>
                <Link to="/dashboard/new">
                    <Button className="bg-dashboard-primary hover:bg-dashboard-primary/90">
                        <Plus className="mr-2 h-4 w-4" /> Create Dashboard
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search dashboards..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
            </div>

            {filteredDashboards.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed">
                    <div className="bg-muted rounded-full p-3">
                        <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">
                        No dashboards found
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        We couldn't find any dashboards matching your search.
                    </p>
                    <Button
                        onClick={() => setSearchQuery("")}
                        variant="link"
                        className="mt-4"
                    >
                        Clear search
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDashboards.map((dashboard) => (
                        <div key={dashboard.id} className="group relative">
                            <Link
                                to={`/dashboard/${dashboard.id}`}
                                className="block"
                            >
                                <Card className="overflow-hidden transition-all hover:shadow-md">
                                    <CardHeader className="p-4 pb-0">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg group-hover:text-dashboard-primary transition-colors flex-1">
                                                {dashboard.title}
                                            </CardTitle>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) =>
                                                            e.preventDefault()
                                                        }
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={(e) =>
                                                            handleDeleteClick(
                                                                dashboard,
                                                                e
                                                            )
                                                        }
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2">
                                        <div className="relative h-32 bg-muted/50 rounded-md flex items-center justify-center mb-3">
                                            {getThumbnailIcon(
                                                dashboard.firstChartType
                                            )}
                                            <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full">
                                                {dashboard.chartCount} charts
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
                                        <div>
                                            Created{" "}
                                            {new Date(
                                                dashboard.createdAt
                                            ).toLocaleDateString()}
                                        </div>
                                        <div>
                                            Updated{" "}
                                            {new Date(
                                                dashboard.updatedAt
                                            ).toLocaleDateString()}
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Link>
                        </div>
                    ))}

                    <Link to="/dashboard/new" className="block h-full">
                        <Card className="border border-dashed h-full flex flex-col items-center justify-center p-6 hover:border-dashboard-primary hover:bg-muted/20 transition-colors">
                            <div className="rounded-full bg-muted p-3 mb-4">
                                <Plus className="h-6 w-6 text-dashboard-primary" />
                            </div>
                            <h3 className="text-lg font-medium mb-1">
                                Create new dashboard
                            </h3>
                            <p className="text-sm text-center text-muted-foreground">
                                Start building a new visualization dashboard
                            </p>
                        </Card>
                    </Link>
                </div>
            )}

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Dashboard</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "
                            {dashboardToDelete?.title}"? This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleDeleteCancel}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default DashboardList;
