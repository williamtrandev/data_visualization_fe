import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { customToast } from "@/lib/toast";
import { useDatasetImport } from "@/hooks/useDatasetImport";
import { useDatasets } from "@/hooks/useDatasets";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const DataSourceManager = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isAddSourceModalOpen, setIsAddSourceModalOpen] = useState(false);
    const [selectedFileType, setSelectedFileType] = useState<"csv" | "excel">(
        "csv"
    );
    const [datasetName, setDatasetName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const {
        importDataset,
        isLoading: isImporting,
        error: importError,
    } = useDatasetImport();
    const {
        datasets,
        isLoading,
        error,
        page,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        nextPage,
        previousPage,
        refreshDatasets,
    } = useDatasets();

    const filteredDataSources = datasets.filter((source) =>
        source.datasetName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddDataSource = (type: string) => {
        if (type === "CSV" || type === "Excel") {
            setSelectedFileType(type.toLowerCase() as "csv" | "excel");
            setIsImportModalOpen(true);
            setIsAddSourceModalOpen(false);
        } else {
            customToast.success(`Creating new ${type} data source...`);
            setIsAddSourceModalOpen(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleImport = async () => {
        if (!selectedFile || !datasetName) return;

        try {
            await importDataset(selectedFile, datasetName);
            customToast.success("Dataset imported successfully!");
            setIsImportModalOpen(false);
            // Reset form
            setSelectedFile(null);
            setDatasetName("");
            // Reset file input
            const fileInput = document.querySelector(
                'input[type="file"]'
            ) as HTMLInputElement;
            if (fileInput) fileInput.value = "";
            // Refresh datasets list
            refreshDatasets();
        } catch (err) {
            console.error("Import failed:", err);
            customToast.error("Failed to import dataset");
        }
    };

    const getSourceTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case "csv":
                return <FileText className="h-4 w-4 text-dashboard-primary" />;
            case "excel":
                return <Table className="h-4 w-4 text-dashboard-accent" />;
            case "api":
                return (
                    <LinkIcon className="h-4 w-4 text-dashboard-secondary" />
                );
            default:
                return <Database className="h-4 w-4 text-dashboard-primary" />;
        }
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
                <Button
                    className="bg-dashboard-primary hover:bg-dashboard-primary/90"
                    onClick={() => setIsAddSourceModalOpen(true)}
                >
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

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dashboard-primary"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-500 p-4">
                    Error loading datasets: {error.message}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDataSources.map((source) => (
                            <Card
                                key={source.datasetId}
                                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() =>
                                    navigate(`/datasets/${source.datasetId}`)
                                }
                            >
                                <CardHeader className="p-4 pb-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {getSourceTypeIcon(
                                                source.sourceType
                                            )}
                                            <CardTitle className="text-lg">
                                                {source.datasetName}
                                            </CardTitle>
                                        </div>
                                    </div>
                                    <CardDescription>
                                        {source.sourceType.toUpperCase()} •{" "}
                                        {source.totalRows} rows
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-2">
                                    <div className="h-24 bg-muted/50 rounded flex items-center justify-center">
                                        <Table className="h-8 w-8 text-muted-foreground opacity-30" />
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-2 text-xs text-muted-foreground justify-between">
                                    <div>
                                        Last updated:{" "}
                                        {new Date(
                                            source.createdAt
                                        ).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })}
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={previousPage}
                            disabled={!hasPreviousPage}
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {page} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={nextPage}
                            disabled={!hasNextPage}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </>
            )}

            {/* Add New Data Source Modal */}
            <Dialog
                open={isAddSourceModalOpen}
                onOpenChange={setIsAddSourceModalOpen}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Data Source</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="file" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="file">File Upload</TabsTrigger>
                            <TabsTrigger value="api">API</TabsTrigger>
                            <TabsTrigger value="database">Database</TabsTrigger>
                        </TabsList>

                        <TabsContent value="file" className="space-y-4 pt-4">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => handleAddDataSource("CSV")}
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                CSV File
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => handleAddDataSource("Excel")}
                            >
                                <Table className="mr-2 h-4 w-4" />
                                Excel Spreadsheet
                            </Button>
                        </TabsContent>

                        <TabsContent value="api" className="pt-4">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => handleAddDataSource("REST API")}
                            >
                                <LinkIcon className="mr-2 h-4 w-4" />
                                REST API Endpoint
                            </Button>
                        </TabsContent>

                        <TabsContent
                            value="database"
                            className="space-y-4 pt-4"
                        >
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => handleAddDataSource("MySQL")}
                            >
                                <Database className="mr-2 h-4 w-4" />
                                MySQL
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => handleAddDataSource("MongoDB")}
                            >
                                <Database className="mr-2 h-4 w-4" />
                                MongoDB
                            </Button>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>

            {/* Import Modal */}
            <Dialog
                open={isImportModalOpen}
                onOpenChange={setIsImportModalOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Import {selectedFileType.toUpperCase()} File
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Dataset Name
                            </label>
                            <Input
                                value={datasetName}
                                onChange={(e) => setDatasetName(e.target.value)}
                                placeholder="Enter dataset name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Select File
                            </label>
                            <Input
                                type="file"
                                accept={
                                    selectedFileType === "csv"
                                        ? ".csv"
                                        : ".xlsx,.xls"
                                }
                                onChange={handleFileChange}
                            />
                        </div>
                        {importError && (
                            <div className="text-sm text-red-500">
                                Error: {importError.message}
                            </div>
                        )}
                        <Button
                            className="w-full"
                            onClick={handleImport}
                            disabled={
                                isImporting || !selectedFile || !datasetName
                            }
                        >
                            {isImporting ? "Importing..." : "Import Dataset"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DataSourceManager;
