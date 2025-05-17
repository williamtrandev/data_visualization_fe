import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Database,
    Table,
    FileText,
    Link as LinkIcon,
    Plus,
} from "lucide-react";
import { customToast } from "@/lib/toast";

// Mock data sources
const dataSources = [
    {
        id: "1",
        name: "Sales Data 2025",
        type: "csv",
        rows: 234,
        columns: 8,
        lastUpdated: "2025-04-28",
        createdBy: "John Doe",
    },
    {
        id: "2",
        name: "Marketing Budget",
        type: "excel",
        rows: 56,
        columns: 12,
        lastUpdated: "2025-05-01",
        createdBy: "Jane Smith",
    },
    {
        id: "3",
        name: "Customer Feedback",
        type: "api",
        rows: 453,
        columns: 15,
        lastUpdated: "2025-04-25",
        createdBy: "Alex Wong",
    },
];

const DataSourceManager = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredDataSources = dataSources.filter((source) =>
        source.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddDataSource = (type: string) => {
        customToast.success(`Creating new ${type} data source...`);
        // In a real app, this would open a form or modal
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Data Sources
                    </h1>
                    <p className="text-muted-foreground">
                        Connect and manage your data
                    </p>
                </div>
                <Button className="bg-dashboard-primary hover:bg-dashboard-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Add Data Source
                </Button>
            </div>

            <div className="relative">
                <Input
                    placeholder="Search data sources..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Database className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDataSources.map((source) => (
                    <Card key={source.id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {source.type === "csv" && (
                                        <FileText className="h-4 w-4 text-dashboard-primary" />
                                    )}
                                    {source.type === "excel" && (
                                        <Table className="h-4 w-4 text-dashboard-accent" />
                                    )}
                                    {source.type === "api" && (
                                        <LinkIcon className="h-4 w-4 text-dashboard-secondary" />
                                    )}
                                    <CardTitle className="text-lg">
                                        {source.name}
                                    </CardTitle>
                                </div>
                            </div>
                            <CardDescription>
                                {source.type.toUpperCase()} • {source.rows} rows
                                • {source.columns} columns
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            <div className="h-24 bg-muted/50 rounded flex items-center justify-center">
                                <Table className="h-8 w-8 text-muted-foreground opacity-30" />
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-2 text-xs text-muted-foreground justify-between">
                            <div>Last updated: {source.lastUpdated}</div>
                            <div>Created by: {source.createdBy}</div>
                        </CardFooter>
                    </Card>
                ))}

                {/* Add new data source cards */}
                <Card className="overflow-hidden">
                    <CardHeader className="p-4">
                        <CardTitle className="text-lg">
                            Add New Data Source
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <Tabs defaultValue="file">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="file">
                                    File Upload
                                </TabsTrigger>
                                <TabsTrigger value="api">API</TabsTrigger>
                                <TabsTrigger value="database">
                                    Database
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="file" className="p-2">
                                <div className="flex flex-col gap-2">
                                    <Button
                                        variant="outline"
                                        className="justify-start"
                                        onClick={() =>
                                            handleAddDataSource("CSV")
                                        }
                                    >
                                        <FileText className="mr-2 h-4 w-4" />
                                        CSV File
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="justify-start"
                                        onClick={() =>
                                            handleAddDataSource("Excel")
                                        }
                                    >
                                        <Table className="mr-2 h-4 w-4" />
                                        Excel Spreadsheet
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="api" className="p-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() =>
                                        handleAddDataSource("REST API")
                                    }
                                >
                                    <LinkIcon className="mr-2 h-4 w-4" />
                                    REST API Endpoint
                                </Button>
                            </TabsContent>

                            <TabsContent value="database" className="p-2">
                                <div className="flex flex-col gap-2">
                                    <Button
                                        variant="outline"
                                        className="justify-start"
                                        onClick={() =>
                                            handleAddDataSource("MySQL")
                                        }
                                    >
                                        <Database className="mr-2 h-4 w-4" />
                                        MySQL
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="justify-start"
                                        onClick={() =>
                                            handleAddDataSource("MongoDB")
                                        }
                                    >
                                        <Database className="mr-2 h-4 w-4" />
                                        MongoDB
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DataSourceManager;
