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

interface DataFieldSelectorProps {
    dataset: Dataset;
    selectedFields: {
        category?: string;
        value?: string;
        series?: string;
    };
    onFieldSelect: (
        fieldType: "category" | "value" | "series",
        fieldName: string,
        options?: {
            aggregation?: "sum" | "avg" | "count" | "min" | "max";
            timeInterval?: "day" | "week" | "month" | "quarter" | "year";
        }
    ) => void;
    onApply: () => void;
    chartType: string;
}

const DataFieldSelector: React.FC<DataFieldSelectorProps> = ({
    dataset,
    selectedFields,
    onFieldSelect,
    onApply,
    chartType,
}) => {
    const [aggregation, setAggregation] = React.useState<
        "sum" | "avg" | "count" | "min" | "max"
    >("sum");
    const [timeInterval, setTimeInterval] = React.useState<
        "day" | "week" | "month" | "quarter" | "year"
    >("month");

    // Local state for selected fields
    const [localSelectedFields, setLocalSelectedFields] = React.useState({
        category: selectedFields.category || "",
        value: selectedFields.value || "",
        series: selectedFields.series || "",
    });

    // Update local state when props change
    React.useEffect(() => {
        console.log("Props changed - selectedFields:", selectedFields);
        setLocalSelectedFields({
            category: selectedFields.category || "",
            value: selectedFields.value || "",
            series: selectedFields.series || "",
        });
    }, [selectedFields]);

    const handleFieldSelect = (
        fieldType: "category" | "value" | "series",
        value: string
    ) => {
        console.log("handleFieldSelect called with:", { fieldType, value });
        console.log("Current localSelectedFields:", localSelectedFields);

        // Update local state first
        setLocalSelectedFields((prev) => ({
            ...prev,
            [fieldType]: value,
        }));

        // Then call parent's onFieldSelect with current options
        onFieldSelect(fieldType, value, {
            aggregation: fieldType === "value" ? aggregation : undefined,
            timeInterval:
                fieldType === "category" && chartType === "line"
                    ? timeInterval
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
                                defaultValue={localSelectedFields.category}
                                value={localSelectedFields.category}
                                onValueChange={(value) => {
                                    console.log(
                                        "Category Select onValueChange:",
                                        value
                                    );
                                    handleFieldSelect("category", value);
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue>
                                        {localSelectedFields.category
                                            ? dataset.columns.find(
                                                  (col) =>
                                                      col.columnName ===
                                                      localSelectedFields.category
                                              )?.displayName
                                            : "Select category field"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {dataset.columns.map((column) => (
                                        <SelectItem
                                            key={column.columnName}
                                            value={column.columnName}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs">
                                                    {getFieldIcon(
                                                        column.dataType
                                                    )}
                                                </span>
                                                <span>
                                                    {column.displayName}
                                                </span>
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
                                    <Label className="text-xs">
                                        Aggregation:
                                    </Label>
                                    <Select
                                        value={aggregation}
                                        onValueChange={(value: any) => {
                                            console.log(
                                                "Aggregation changed:",
                                                value
                                            );
                                            setAggregation(value);
                                        }}
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
                                    defaultValue={localSelectedFields.value}
                                    value={localSelectedFields.value}
                                    onValueChange={(value) => {
                                        console.log(
                                            "Value Select onValueChange:",
                                            value
                                        );
                                        handleFieldSelect("value", value);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue>
                                            {localSelectedFields.value
                                                ? dataset.columns.find(
                                                      (col) =>
                                                          col.columnName ===
                                                          localSelectedFields.value
                                                  )?.displayName
                                                : "Select value field"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dataset.columns
                                            .filter(isNumericField)
                                            .map((column) => (
                                                <SelectItem
                                                    key={column.columnName}
                                                    value={column.columnName}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs">
                                                            {getFieldIcon(
                                                                column.dataType
                                                            )}
                                                        </span>
                                                        <span>
                                                            {column.displayName}
                                                        </span>
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
                                defaultValue={localSelectedFields.series}
                                value={localSelectedFields.series}
                                onValueChange={(value) => {
                                    console.log(
                                        "Series Select onValueChange:",
                                        value
                                    );
                                    handleFieldSelect("series", value);
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue>
                                        {localSelectedFields.series
                                            ? dataset.columns.find(
                                                  (col) =>
                                                      col.columnName ===
                                                      localSelectedFields.series
                                              )?.displayName
                                            : "Select group field"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {dataset.columns.map((column) => (
                                        <SelectItem
                                            key={column.columnName}
                                            value={column.columnName}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs">
                                                    {getFieldIcon(
                                                        column.dataType
                                                    )}
                                                </span>
                                                <span>
                                                    {column.displayName}
                                                </span>
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
                                console.log(
                                    "Apply button clicked with fields:",
                                    localSelectedFields
                                );
                                handleApply(e);
                            }}
                            disabled={
                                !localSelectedFields.category ||
                                !localSelectedFields.value
                            }
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
                                        value={timeInterval}
                                        onValueChange={(value: any) =>
                                            setTimeInterval(value)
                                        }
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
                                    value={localSelectedFields.category}
                                    onValueChange={(value) =>
                                        handleFieldSelect("category", value)
                                    }
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
                                                        {getFieldIcon(
                                                            column.dataType
                                                        )}
                                                    </span>
                                                    <span>
                                                        {column.displayName}
                                                    </span>
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
                                        value={aggregation}
                                        onValueChange={(value: any) =>
                                            setAggregation(value)
                                        }
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
                                    value={localSelectedFields.value}
                                    onValueChange={(value) =>
                                        handleFieldSelect("value", value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select value field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dataset.columns
                                            .filter(isNumericField)
                                            .map((column) => (
                                                <SelectItem
                                                    key={column.columnName}
                                                    value={column.columnName}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs">
                                                            {getFieldIcon(
                                                                column.dataType
                                                            )}
                                                        </span>
                                                        <span>
                                                            {column.displayName}
                                                        </span>
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
                                value={localSelectedFields.series}
                                onValueChange={(value) =>
                                    handleFieldSelect("series", value)
                                }
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
                                                    {getFieldIcon(
                                                        column.dataType
                                                    )}
                                                </span>
                                                <span>
                                                    {column.displayName}
                                                </span>
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
                                console.log(
                                    "Apply button clicked with fields:",
                                    localSelectedFields
                                );
                                handleApply(e);
                            }}
                            disabled={
                                !localSelectedFields.category ||
                                !localSelectedFields.value
                            }
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
                                value={localSelectedFields.category}
                                onValueChange={(value) =>
                                    handleFieldSelect("category", value)
                                }
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
                                                    {getFieldIcon(
                                                        column.dataType
                                                    )}
                                                </span>
                                                <span>
                                                    {column.displayName}
                                                </span>
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
                                        value={aggregation}
                                        onValueChange={(value: any) =>
                                            setAggregation(value)
                                        }
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
                                    value={localSelectedFields.value}
                                    onValueChange={(value) =>
                                        handleFieldSelect("value", value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select value field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dataset.columns
                                            .filter(isNumericField)
                                            .map((column) => (
                                                <SelectItem
                                                    key={column.columnName}
                                                    value={column.columnName}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs">
                                                            {getFieldIcon(
                                                                column.dataType
                                                            )}
                                                        </span>
                                                        <span>
                                                            {column.displayName}
                                                        </span>
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
                                console.log(
                                    "Apply button clicked with fields:",
                                    localSelectedFields
                                );
                                handleApply(e);
                            }}
                            disabled={
                                !localSelectedFields.category ||
                                !localSelectedFields.value
                            }
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
        if (!selectedFields.category || !selectedFields.value) {
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
