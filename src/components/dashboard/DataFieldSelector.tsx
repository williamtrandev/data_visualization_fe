import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dataset, DatasetColumn } from "@/services/datasetService";
import {
    Calendar,
    Hash,
    Tag,
    BarChart,
    LineChart,
    PieChart,
    Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { customToast } from "@/lib/toast";
import { DashboardItem } from "@/types/dashboard";

interface DataFieldSelectorProps {
    dataset: Dataset;
    selectedElement: DashboardItem;
    onFieldSelect: (
        fieldType: "category" | "value" | "series",
        fieldName: string,
        options?: {
            aggregation?: "sum" | "avg" | "count" | "min" | "max";
            timeInterval?: "day" | "week" | "month" | "quarter" | "year";
        }
    ) => void;
    onAggregationChange: (newAggregation: string) => void;
    onApply: () => void;
}

const DataFieldSelector: React.FC<DataFieldSelectorProps> = ({
    dataset,
    selectedElement,
    onFieldSelect,
    onAggregationChange,
    onApply,
}) => {
    const chartType = selectedElement.type;
    const chartOptions = selectedElement.chartOptions;

    const handleFieldSelect = (
        fieldType: "category" | "value" | "series",
        value: string
    ) => {
        console.log("handleFieldSelect called with:", { fieldType, value });

        // Then call parent's onFieldSelect with current options
        onFieldSelect(fieldType, value, {
            aggregation: fieldType === "value" ? chartOptions.aggregation : undefined,
            timeInterval:
                fieldType === "category" && chartType === "line"
                    ? chartOptions.timeInterval
                    : undefined,
        });
    };

    const getFieldIcon = (dataType: string) => {
        switch (dataType.toLowerCase()) {
            case "number":
            case "integer":
            case "float":
                return "123";
            case "date":
            case "datetime":
                return "📅";
            case "boolean":
                return "✓";
            default:
                return "📝";
        }
    };

    const isNumericField = (column: DatasetColumn) => {
        const numericTypes = [
            "int",
            "integer",
            "decimal",
            "double",
            "long",
            "float",
        ];
        return numericTypes.includes(column.dataType.toLowerCase());
    };

    const renderChartFields = () => {
        switch (chartType) {
            case "bar":
                return (
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium mb-2">
                                X-Axis (Category)
                            </h4>
                            <Select
                                value={chartOptions.categoryField}
                                onValueChange={(value) => handleFieldSelect("category", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select category field" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dataset.columns.map((column) => (
                                        <SelectItem
                                            key={column.columnName}
                                            value={column.columnName}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs">
                                                    {getFieldIcon(column.dataType)}
                                                </span>
                                                <span>{column.displayName}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium mb-2">
                                Y-Axis (Value)
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs">Aggregation:</Label>
                                    <Select
                                        value={chartOptions.aggregation || "sum"}
                                        onValueChange={(value: any) => onAggregationChange(value)}
                                    >
                                        <SelectTrigger className="h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sum">Sum</SelectItem>
                                            <SelectItem value="avg">Average</SelectItem>
                                            <SelectItem value="count">Count</SelectItem>
                                            <SelectItem value="min">Minimum</SelectItem>
                                            <SelectItem value="max">Maximum</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Select
                                    value={chartOptions.valueField}
                                    onValueChange={(value) => handleFieldSelect("value", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select value field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dataset.columns.map((column) => (
                                            <SelectItem
                                                key={column.columnName}
                                                value={column.columnName}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs">
                                                        {getFieldIcon(column.dataType)}
                                                    </span>
                                                    <span>{column.displayName}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium mb-2">
                                Group (Optional)
                            </h4>
                            <Select
                                value={chartOptions.seriesField}
                                onValueChange={(value) => handleFieldSelect("series", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select group field" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dataset.columns.map((column) => (
                                        <SelectItem
                                            key={column.columnName}
                                            value={column.columnName}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs">
                                                    {getFieldIcon(column.dataType)}
                                                </span>
                                                <span>{column.displayName}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            className="w-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleApply(e);
                            }}
                            disabled={!chartOptions.categoryField || !chartOptions.valueField}
                        >
                            Apply
                        </Button>
                    </div>
                );
            case "line":
                return (
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium mb-2">
                                X-Axis (Time)
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs">
                                        Time Interval:
                                    </Label>
                                    <Select
                                        value={chartOptions.timeInterval || "month"}
                                        onValueChange={(value: any) => onAggregationChange(value)}
                                    >
                                        <SelectTrigger className="h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="day">
                                                Daily
                                            </SelectItem>
                                            <SelectItem value="week">
                                                Weekly
                                            </SelectItem>
                                            <SelectItem value="month">
                                                Monthly
                                            </SelectItem>
                                            <SelectItem value="quarter">
                                                Quarterly
                                            </SelectItem>
                                            <SelectItem value="year">
                                                Yearly
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Select
                                    value={chartOptions.categoryField}
                                    onValueChange={(value) => handleFieldSelect("category", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select time field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dataset.columns.map((column) => (
                                            <SelectItem
                                                key={column.columnName}
                                                value={column.columnName}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs">
                                                        {getFieldIcon(column.dataType)}
                                                    </span>
                                                    <span>{column.displayName}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium mb-2">
                                Y-Axis (Value)
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs">
                                        Aggregation:
                                    </Label>
                                    <Select
                                        value={chartOptions.aggregation || "sum"}
                                        onValueChange={(value: any) => onAggregationChange(value)}
                                    >
                                        <SelectTrigger className="h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sum">
                                                Sum
                                            </SelectItem>
                                            <SelectItem value="avg">
                                                Average
                                            </SelectItem>
                                            <SelectItem value="count">
                                                Count
                                            </SelectItem>
                                            <SelectItem value="min">
                                                Minimum
                                            </SelectItem>
                                            <SelectItem value="max">
                                                Maximum
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Select
                                    value={chartOptions.valueField}
                                    onValueChange={(value) => handleFieldSelect("value", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select value field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dataset.columns
                                            // .filter(isNumericField)
                                            .map((column) => (
                                                <SelectItem
                                                    key={column.columnName}
                                                    value={column.columnName}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs">
                                                            {getFieldIcon(column.dataType)}
                                                        </span>
                                                        <span>{column.displayName}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium mb-2">
                                Group (Optional)
                            </h4>
                            <Select
                                value={chartOptions.seriesField}
                                onValueChange={(value) => handleFieldSelect("series", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select group field" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dataset.columns.map((column) => (
                                        <SelectItem
                                            key={column.columnName}
                                            value={column.columnName}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs">
                                                    {getFieldIcon(column.dataType)}
                                                </span>
                                                <span>{column.displayName}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            className="w-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleApply(e);
                            }}
                            disabled={!chartOptions.categoryField || !chartOptions.valueField}
                        >
                            Apply
                        </Button>
                    </div>
                );
            case "pie":
                return (
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium mb-2">Label</h4>
                            <Select
                                value={chartOptions.categoryField}
                                onValueChange={(value) => handleFieldSelect("category", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select label field" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dataset.columns.map((column) => (
                                        <SelectItem
                                            key={column.columnName}
                                            value={column.columnName}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs">
                                                    {getFieldIcon(column.dataType)}
                                                </span>
                                                <span>{column.displayName}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium mb-2">Value</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs">
                                        Aggregation:
                                    </Label>
                                    <Select
                                        value={chartOptions.aggregation || "sum"}
                                        onValueChange={(value: any) => onAggregationChange(value)}
                                    >
                                        <SelectTrigger className="h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sum">
                                                Sum
                                            </SelectItem>
                                            <SelectItem value="avg">
                                                Average
                                            </SelectItem>
                                            <SelectItem value="count">
                                                Count
                                            </SelectItem>
                                            <SelectItem value="min">
                                                Minimum
                                            </SelectItem>
                                            <SelectItem value="max">
                                                Maximum
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Select
                                    value={chartOptions.valueField}
                                    onValueChange={(value) => handleFieldSelect("value", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select value field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dataset.columns
                                            // .filter(isNumericField)
                                            .map((column) => (
                                                <SelectItem
                                                    key={column.columnName}
                                                    value={column.columnName}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs">
                                                            {getFieldIcon(column.dataType)}
                                                        </span>
                                                        <span>{column.displayName}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button
                            className="w-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleApply(e);
                            }}
                            disabled={!chartOptions.categoryField || !chartOptions.valueField}
                        >
                            Apply
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    };

    const handleApply = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!chartOptions.categoryField || !chartOptions.valueField) {
            customToast.error("Please select required fields");
            return;
        }
        onApply();
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {chartType === "bar" && <BarChart className="h-4 w-4" />}
                {chartType === "line" && <LineChart className="h-4 w-4" />}
                {chartType === "pie" && <PieChart className="h-4 w-4" />}
                <span>Select Data Fields</span>
            </div>
            {renderChartFields()}
        </div>
    );
};

export default DataFieldSelector;
