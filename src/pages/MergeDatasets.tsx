import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database, Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/lib/axios";

interface Column {
    columnName: string;
    displayName: string;
    dataType: string;
}

interface Dataset {
    datasetId: number;
    datasetName: string;
    columns: Column[];
}

interface JoinCondition {
    leftColumn: string;
    rightColumn: string;
    operator: "eq";
}

interface MergeConfig {
    newDatasetName: string;
    leftDatasetId: number | null;
    rightDatasetId: number | null;
    mergeType: "Inner" | "Left" | "Right" | "Full" | "Cross";
    joinConditions: JoinCondition[];
}

const MergeDatasets = () => {
    const { toast } = useToast();
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [loading, setLoading] = useState(false);
    const [mergeConfig, setMergeConfig] = useState<MergeConfig>({
        newDatasetName: "",
        leftDatasetId: null,
        rightDatasetId: null,
        mergeType: "Inner",
        joinConditions: [],
    });

    useEffect(() => {
        fetchDatasets();
    }, []);

    const fetchDatasets = async () => {
        try {
            const response = await axiosInstance.get("/datasets/dropdown");
            setDatasets(response.data || []);
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to fetch datasets",
                variant: "destructive",
            });
            setDatasets([]);
        }
    };

    const getSelectedDataset = (datasetId: number | null) => {
        return datasets.find((d) => d.datasetId === datasetId);
    };

    const handleAddJoinCondition = () => {
        setMergeConfig((prev) => ({
            ...prev,
            joinConditions: [
                ...prev.joinConditions,
                { leftColumn: "", rightColumn: "", operator: "eq" },
            ],
        }));
    };

    const handleRemoveJoinCondition = (index: number) => {
        setMergeConfig((prev) => ({
            ...prev,
            joinConditions: prev.joinConditions.filter((_, i) => i !== index),
        }));
    };

    const handleJoinConditionChange = (
        index: number,
        field: "leftColumn" | "rightColumn",
        value: string
    ) => {
        setMergeConfig((prev) => ({
            ...prev,
            joinConditions: prev.joinConditions.map((condition, i) =>
                i === index ? { ...condition, [field]: value } : condition
            ),
        }));
    };

    const handleMerge = async () => {
        if (!mergeConfig.leftDatasetId || !mergeConfig.rightDatasetId) {
            toast({
                title: "Error",
                description: "Please select both datasets",
                variant: "destructive",
            });
            return;
        }

        if (mergeConfig.joinConditions.length === 0) {
            toast({
                title: "Error",
                description: "Please add at least one join condition",
                variant: "destructive",
            });
            return;
        }

        try {
            setLoading(true);
            await axiosInstance.post("/datasets/merge", mergeConfig);
            toast({
                title: "Success",
                description: "Datasets merged successfully",
            });
            // Reset form
            setMergeConfig({
                newDatasetName: "",
                leftDatasetId: null,
                rightDatasetId: null,
                mergeType: "Inner",
                joinConditions: [],
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to merge datasets",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-dashboard-primary" />
                        <CardTitle>Merge Datasets</CardTitle>
                    </div>
                    <CardDescription>
                        Combine two datasets based on matching columns
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Dataset Selection */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* Left Dataset */}
                            <div className="space-y-4">
                                <Label>Left Dataset</Label>
                                <Select
                                    value={mergeConfig.leftDatasetId?.toString()}
                                    onValueChange={(value) =>
                                        setMergeConfig((prev) => ({
                                            ...prev,
                                            leftDatasetId: Number(value),
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select dataset" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.isArray(datasets) &&
                                            datasets.map((dataset) => (
                                                <SelectItem
                                                    key={dataset.datasetId}
                                                    value={dataset.datasetId.toString()}
                                                >
                                                    {dataset.datasetName}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Right Dataset */}
                            <div className="space-y-4">
                                <Label>Right Dataset</Label>
                                <Select
                                    value={mergeConfig.rightDatasetId?.toString()}
                                    onValueChange={(value) =>
                                        setMergeConfig((prev) => ({
                                            ...prev,
                                            rightDatasetId: Number(value),
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select dataset" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.isArray(datasets) &&
                                            datasets.map((dataset) => (
                                                <SelectItem
                                                    key={dataset.datasetId}
                                                    value={dataset.datasetId.toString()}
                                                >
                                                    {dataset.datasetName}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Join Conditions */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Join Conditions</Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddJoinCondition}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Condition
                                </Button>
                            </div>
                            {mergeConfig.joinConditions.map(
                                (condition, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4"
                                    >
                                        <Select
                                            value={condition.leftColumn}
                                            onValueChange={(value) =>
                                                handleJoinConditionChange(
                                                    index,
                                                    "leftColumn",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Left column" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.isArray(
                                                    getSelectedDataset(
                                                        mergeConfig.leftDatasetId
                                                    )?.columns
                                                ) &&
                                                    getSelectedDataset(
                                                        mergeConfig.leftDatasetId
                                                    )?.columns.map((column) => (
                                                        <SelectItem
                                                            key={
                                                                column.columnName
                                                            }
                                                            value={
                                                                column.columnName
                                                            }
                                                        >
                                                            {column.displayName}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>

                                        <Select
                                            value={condition.rightColumn}
                                            onValueChange={(value) =>
                                                handleJoinConditionChange(
                                                    index,
                                                    "rightColumn",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Right column" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.isArray(
                                                    getSelectedDataset(
                                                        mergeConfig.rightDatasetId
                                                    )?.columns
                                                ) &&
                                                    getSelectedDataset(
                                                        mergeConfig.rightDatasetId
                                                    )?.columns.map((column) => (
                                                        <SelectItem
                                                            key={
                                                                column.columnName
                                                            }
                                                            value={
                                                                column.columnName
                                                            }
                                                        >
                                                            {column.displayName}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleRemoveJoinCondition(index)
                                            }
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Join Type Selection */}
                        <div className="space-y-2">
                            <Label>Join Type</Label>
                            <Select
                                value={mergeConfig.mergeType}
                                onValueChange={(
                                    value: MergeConfig["mergeType"]
                                ) =>
                                    setMergeConfig((prev) => ({
                                        ...prev,
                                        mergeType: value,
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Inner">
                                        Inner Join
                                    </SelectItem>
                                    <SelectItem value="Left">
                                        Left Join
                                    </SelectItem>
                                    <SelectItem value="Right">
                                        Right Join
                                    </SelectItem>
                                    <SelectItem value="Full">
                                        Full Join
                                    </SelectItem>
                                    <SelectItem value="Cross">
                                        Cross Join
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Output Name */}
                        <div className="space-y-2">
                            <Label>Output Dataset Name</Label>
                            <Input
                                value={mergeConfig.newDatasetName}
                                onChange={(e) =>
                                    setMergeConfig((prev) => ({
                                        ...prev,
                                        newDatasetName: e.target.value,
                                    }))
                                }
                                placeholder="Enter output dataset name"
                            />
                        </div>

                        {/* Merge Button */}
                        <Button
                            onClick={handleMerge}
                            disabled={
                                !mergeConfig.leftDatasetId ||
                                !mergeConfig.rightDatasetId ||
                                mergeConfig.joinConditions.length === 0 ||
                                !mergeConfig.newDatasetName ||
                                loading
                            }
                            className="w-full"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {loading ? "Merging..." : "Merge Datasets"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MergeDatasets;
