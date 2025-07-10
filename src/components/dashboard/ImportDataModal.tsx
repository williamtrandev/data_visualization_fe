import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    FileText,
    Upload,
    Database,
    Table,
    Globe,
    Settings,
} from "lucide-react";
import { toast } from "sonner";
import { datasetService, ImportApiParams } from "@/services/datasetService";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface ImportDataModalProps {
    open: boolean;
    onOpenChange: () => void;
    onDataImported: (data: any) => void;
}

const ImportDataModal = ({
    open,
    onOpenChange,
    onDataImported,
}: ImportDataModalProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [datasetName, setDatasetName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"file" | "api">("file");

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            // Auto-generate dataset name from file name
            const fileName = e.target.files[0].name;
            const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
            setDatasetName(nameWithoutExt);
        }
    };

    const handleFileUpload = async () => {
        if (!file || !datasetName.trim()) {
            toast.error("Vui lòng chọn file và nhập tên dataset");
            return;
        }

        setIsLoading(true);

        try {
            const result = await datasetService.importDataset(
                file,
                datasetName
            );

            onDataImported({
                id: result.datasetId,
                name: result.datasetName,
                type: result.sourceType,
                data: result,
                rows: result.totalRows,
                columns: result.columns.length,
                lastUpdated: result.createdAt,
                createdBy: result.createdBy,
                previewData: [],
            });

            toast.success("Dataset đã được import thành công!");
            onOpenChange();
            resetForm();
        } catch (error) {
            console.error("Lỗi khi import file:", error);
            toast.error("Có lỗi xảy ra khi import file");
        } finally {
            setIsLoading(false);
        }
    };

    const handleApiImport = async () => {
        if (!apiUrl.trim() || !datasetName.trim()) {
            toast.error("Vui lòng nhập URL API và tên dataset");
            return;
        }

        setIsLoading(true);

        try {
            // Parse custom headers
            let headers: Record<string, string> = {};
            if (customHeaders.trim()) {
                try {
                    headers = JSON.parse(customHeaders);
                } catch (e) {
                    toast.error("Headers không đúng định dạng JSON");
                    setIsLoading(false);
                    return;
                }
            }

            // Parse request body
            let body: any = undefined;
            if (requestBody.trim() && httpMethod !== "GET") {
                try {
                    body = JSON.parse(requestBody);
                } catch (e) {
                    toast.error("Request body không đúng định dạng JSON");
                    setIsLoading(false);
                    return;
                }
            }

            const apiParams: ImportApiParams = {
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

            const result = await datasetService.importFromApi(apiParams);

            onDataImported({
                id: result.datasetId,
                name: result.datasetName,
                type: result.sourceType,
                data: result,
                rows: result.totalRows,
                columns: result.columns.length,
                lastUpdated: result.createdAt,
                createdBy: result.createdBy,
                previewData: [],
            });

            toast.success("Dataset từ API đã được import thành công!");
            onOpenChange();
            resetForm();
        } catch (error) {
            console.error("Lỗi khi import từ API:", error);
            toast.error("Có lỗi xảy ra khi import từ API");
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setDatasetName("");
        setApiUrl("");
        setHttpMethod("GET");
        setMaxRecords(100);
        setTimeoutSeconds(30);
        setFlattenNestedObjects(true);
        setCustomHeaders("");
        setRequestBody("");
        setActiveTab("file");
    };

    const handleImport = () => {
        if (activeTab === "file") {
            handleFileUpload();
        } else {
            handleApiImport();
        }
    };

    const isImportDisabled = () => {
        if (activeTab === "file") {
            return !file || !datasetName.trim();
        } else {
            return !apiUrl.trim() || !datasetName.trim();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Import Dataset</DialogTitle>
                </DialogHeader>

                <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                        setActiveTab(value as "file" | "api")
                    }
                >
                    <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="file">
                            <FileText className="h-4 w-4 mr-2" />
                            File Upload
                        </TabsTrigger>
                        <TabsTrigger value="api">
                            <Globe className="h-4 w-4 mr-2" />
                            REST API
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="file" className="space-y-4 py-4">
                        <div className="grid gap-4">
                            <div>
                                <Label htmlFor="dataset-name">
                                    Dataset Name
                                </Label>
                                <Input
                                    id="dataset-name"
                                    placeholder="Enter dataset name"
                                    value={datasetName}
                                    onChange={(e) =>
                                        setDatasetName(e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <Label htmlFor="file">
                                    Select File (JSON, CSV)
                                </Label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept=".json,.csv"
                                    onChange={handleFileChange}
                                />
                                {file && (
                                    <div className="text-sm text-muted-foreground mt-2">
                                        Selected: {file.name} (
                                        {Math.round(file.size / 1024)} KB)
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="api" className="space-y-4 py-4">
                        <div className="grid gap-4">
                            <div>
                                <Label htmlFor="api-dataset-name">
                                    Dataset Name
                                </Label>
                                <Input
                                    id="api-dataset-name"
                                    placeholder="e.g., JSONPlaceholder Posts"
                                    value={datasetName}
                                    onChange={(e) =>
                                        setDatasetName(e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <Label htmlFor="api-url">API URL</Label>
                                <Input
                                    id="api-url"
                                    type="url"
                                    placeholder="https://jsonplaceholder.typicode.com/posts"
                                    value={apiUrl}
                                    onChange={(e) => setApiUrl(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="http-method">
                                        HTTP Method
                                    </Label>
                                    <Select
                                        value={httpMethod}
                                        onValueChange={(value: any) =>
                                            setHttpMethod(value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="GET">
                                                GET
                                            </SelectItem>
                                            <SelectItem value="POST">
                                                POST
                                            </SelectItem>
                                            <SelectItem value="PUT">
                                                PUT
                                            </SelectItem>
                                            <SelectItem value="DELETE">
                                                DELETE
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="max-records">
                                        Max Records
                                    </Label>
                                    <Input
                                        id="max-records"
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
                                <div>
                                    <Label htmlFor="timeout">
                                        Timeout (seconds)
                                    </Label>
                                    <Input
                                        id="timeout"
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
                                    <Switch
                                        id="flatten"
                                        checked={flattenNestedObjects}
                                        onCheckedChange={
                                            setFlattenNestedObjects
                                        }
                                    />
                                    <Label htmlFor="flatten">
                                        Flatten nested objects
                                    </Label>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="headers">
                                    Custom Headers (JSON)
                                </Label>
                                <Textarea
                                    id="headers"
                                    placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                                    value={customHeaders}
                                    onChange={(e) =>
                                        setCustomHeaders(e.target.value)
                                    }
                                    rows={3}
                                />
                            </div>

                            {httpMethod !== "GET" && (
                                <div>
                                    <Label htmlFor="body">
                                        Request Body (JSON)
                                    </Label>
                                    <Textarea
                                        id="body"
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
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={resetForm}>
                            Cancel
                        </Button>
                    </DialogClose>

                    <Button
                        onClick={handleImport}
                        disabled={isLoading || isImportDisabled()}
                    >
                        {isLoading ? "Importing..." : "Import Dataset"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ImportDataModal;
