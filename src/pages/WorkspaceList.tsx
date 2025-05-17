import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Plus, Users, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WorkspaceList = () => {
    const navigate = useNavigate();
    const [workspaces] = useState([
        {
            id: 1,
            name: "Marketing Analytics",
            description: "Marketing team workspace",
            members: 5,
            dashboards: 3,
            reports: 2,
        },
        {
            id: 2,
            name: "Sales Performance",
            description: "Sales team workspace",
            members: 8,
            dashboards: 4,
            reports: 3,
        },
    ]);

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Workspaces</h1>
                <Button onClick={() => navigate("/workspace/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Workspace
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workspaces.map((workspace) => (
                    <Card
                        key={workspace.id}
                        className="hover:shadow-lg transition-shadow"
                    >
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{workspace.name}</CardTitle>
                                    <CardDescription>
                                        {workspace.description}
                                    </CardDescription>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <Users className="mr-2 h-4 w-4" />
                                    {workspace.members} members
                                </div>
                                <div>{workspace.dashboards} dashboards</div>
                                <div>{workspace.reports} reports</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default WorkspaceList;
