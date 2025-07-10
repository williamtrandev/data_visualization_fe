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
import { datasetService } from "@/services/datasetService";

const DataSourceManager = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isAddSourceModalOpen, setIsAddSourceModalOpen] = useState(false);
    const [selectedFileType, setSelectedFileType] = useState<
        "csv" | "excel" | "api"
    >("csv");
    const [datasetName, setDatasetName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isApiImportModalOpen, setIsApiImportModalOpen] = useState(false);

    // API Import states
    const [apiUrl, setApiUrl] = useState("");
    const [httpMethod, setHttpMethod] = useState<
        "GET" | "POST" | "PUT" | "DELETE"
    >("GET");
    const [maxRecords, setMaxRecords] = useState<number>(100);
    const [timeoutSeconds, setTimeoutSeconds] = useState<number>(30);
    const [flattenNestedObjects, setFlattenNestedObjects] =
        useState<boolean>(true);
    const [customHeaders, setCustomHeaders] = useState<string>("");
    const [requestBody, setRequestBody] = useState<string>("");

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
        } else if (type === "REST API") {
            setSelectedFileType("api");
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
        if (selectedFileType === "api") {
            await handleApiImport();
        } else {
            await handleFileImport();
        }
    };

    const handleFileImport = async () => {
        if (!selectedFile || !datasetName) return;

        try {
            await importDataset(selectedFile, datasetName);
            customToast.success("Dataset imported successfully!");
            setIsImportModalOpen(false);
            resetForm();
            refreshDatasets();
        } catch (err) {
            console.error("Import failed:", err);
            customToast.error("Failed to import dataset");
        }
    };

    const handleApiImport = async () => {
        if (!apiUrl.trim() || !datasetName.trim()) {
            customToast.error("Vui lòng nhập URL API và tên dataset");
            return;
        }

        try {
            // Parse custom headers
            let headers: Record<string, string> = {};
            if (customHeaders.trim()) {
                try {
                    headers = JSON.parse(customHeaders);
                } catch (e) {
                    customToast.error("Headers không đúng định dạng JSON");
                    return;
                }
            }

            // Parse request body
            let body: any = undefined;
            if (requestBody.trim() && httpMethod !== "GET") {
                try {
                    body = JSON.parse(requestBody);
                } catch (e) {
                    customToast.error("Request body không đúng định dạng JSON");
                    return;
                }
            }

            const apiParams = {
                datasetName: datasetName,
                apiUrl: apiUrl,
                options: {
                    httpMethod: httpMethod,
                    maxRecords: maxRecords,
                    timeoutSeconds: timeoutSeconds,
                    flattenNestedObjects: flattenNestedObjects,
                    headers:
                        Object.keys(headers).length > 0 ? headers : undefined,
                    body: body,
                },
            };

            // Import using datasetService
            await datasetService.importFromApi(apiParams);

            customToast.success("Dataset từ API đã được import thành công!");
            setIsImportModalOpen(false);
            resetForm();
            refreshDatasets();
        } catch (error) {
            console.error("Lỗi khi import từ API:", error);
            customToast.error("Có lỗi xảy ra khi import từ API");
        }
    };

    const resetForm = () => {
        setSelectedFile(null);
        setDatasetName("");
        setApiUrl("");
        setHttpMethod("GET");
        setMaxRecords(100);
        setTimeoutSeconds(30);
        setFlattenNestedObjects(true);
        setCustomHeaders("");
        setRequestBody("");
        // Reset file input
        const fileInput = document.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    };

    const isImportDisabled = () => {
        if (selectedFileType === "api") {
            return !apiUrl.trim() || !datasetName.trim();
        } else {
            return !selectedFile || !datasetName.trim();
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
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="file">File Upload</TabsTrigger>
                            <TabsTrigger value="api">API</TabsTrigger>
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
                    </Tabs>
                </DialogContent>
            </Dialog>

            {/* Import Modal */}
            <Dialog
                open={isImportModalOpen}
                onOpenChange={setIsImportModalOpen}
            >
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedFileType === "api"
                                ? "Import from REST API"
                                : `Import ${selectedFileType.toUpperCase()} File`}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedFileType === "api" ? (
                        // API Import Form
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Dataset Name
                                </label>
                                <Input
                                    value={datasetName}
                                    onChange={(e) =>
                                        setDatasetName(e.target.value)
                                    }
                                    placeholder="e.g., JSONPlaceholder Posts"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    API URL
                                </label>
                                <Input
                                    type="url"
                                    placeholder="https://jsonplaceholder.typicode.com/posts"
                                    value={apiUrl}
                                    onChange={(e) => setApiUrl(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        HTTP Method
                                    </label>
                                    <select
                                        className="w-full p-2 border rounded-md"
                                        value={httpMethod}
                                        onChange={(e) =>
                                            setHttpMethod(e.target.value as any)
                                        }
                                    >
                                        <option value="GET">GET</option>
                                        <option value="POST">POST</option>
                                        <option value="PUT">PUT</option>
                                        <option value="DELETE">DELETE</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Max Records
                                    </label>
                                    <Input
                                        type="number"
                                        min="1"
                                        max="10000"
                                        value={maxRecords}
                                        onChange={(e) =>
                                            setMaxRecords(
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Timeout (seconds)
                                    </label>
                                    <Input
                                        type="number"
                                        min="5"
                                        max="300"
                                        value={timeoutSeconds}
                                        onChange={(e) =>
                                            setTimeoutSeconds(
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                </div>

                                <div className="flex items-center space-x-2 pt-6">
                                    <input
                                        type="checkbox"
                                        id="flatten"
                                        checked={flattenNestedObjects}
                                        onChange={(e) =>
                                            setFlattenNestedObjects(
                                                e.target.checked
                                            )
                                        }
                                        className="rounded"
                                    />
                                    <label
                                        htmlFor="flatten"
                                        className="text-sm font-medium"
                                    >
                                        Flatten nested objects
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Custom Headers (JSON)
                                </label>
                                <textarea
                                    className="w-full p-2 border rounded-md"
                                    placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                                    value={customHeaders}
                                    onChange={(e) =>
                                        setCustomHeaders(e.target.value)
                                    }
                                    rows={3}
                                />
                            </div>

                            {httpMethod !== "GET" && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Request Body (JSON)
                                    </label>
                                    <textarea
                                        className="w-full p-2 border rounded-md"
                                        placeholder='{"key": "value"}'
                                        value={requestBody}
                                        onChange={(e) =>
                                            setRequestBody(e.target.value)
                                        }
                                        rows={4}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        // File Import Form
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Dataset Name
                                </label>
                                <Input
                                    value={datasetName}
                                    onChange={(e) =>
                                        setDatasetName(e.target.value)
                                    }
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
                        </div>
                    )}

                    {importError && (
                        <div className="text-sm text-red-500">
                            Error: {importError.message}
                        </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsImportModalOpen(false);
                                resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleImport}
                            disabled={isImporting || isImportDisabled()}
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
