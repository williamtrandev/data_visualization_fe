import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Plus, FileText, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ReportList = () => {
    const navigate = useNavigate();
    const [reports] = useState([
        {
            id: 1,
            name: "Monthly Sales Report",
            description: "Detailed analysis of monthly sales performance",
            author: "John Doe",
            lastModified: "2024-03-15",
            views: 156,
        },
        {
            id: 2,
            name: "Customer Analytics",
            description: "Customer behavior and demographics analysis",
            author: "Jane Smith",
            lastModified: "2024-03-14",
            views: 89,
        },
    ]);

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Reports</h1>
                <Button onClick={() => navigate("/report/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Report
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                    <Card
                        key={report.id}
                        className="hover:shadow-lg transition-shadow"
                    >
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{report.name}</CardTitle>
                                    <CardDescription>
                                        {report.description}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <User className="mr-2 h-4 w-4" />
                                    {report.author}
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Last modified: {report.lastModified}
                                </div>
                                <div className="flex items-center">
                                    <FileText className="mr-2 h-4 w-4" />
                                    {report.views} views
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ReportList;
