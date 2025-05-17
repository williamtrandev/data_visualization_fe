import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dataset } from "@/types/dashboard";
import { Calendar, Hash, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataFieldSelectorProps {
    dataset: Dataset;
    selectedFields: {
        category?: string;
        value?: string;
        series?: string;
    };
    onFieldSelect: (
        fieldType: "category" | "value" | "series",
        fieldName: string
    ) => void;
    chartType: string;
}

const DataFieldSelector: React.FC<DataFieldSelectorProps> = ({
    dataset,
    selectedFields,
    onFieldSelect,
    chartType,
}) => {
    const isFieldSelected = (fieldName: string) => {
        return (
            selectedFields.category === fieldName ||
            selectedFields.value === fieldName ||
            selectedFields.series === fieldName
        );
    };

    const getFieldType = (
        fieldName: string
    ): "category" | "value" | "series" | null => {
        if (selectedFields.category === fieldName) return "category";
        if (selectedFields.value === fieldName) return "value";
        if (selectedFields.series === fieldName) return "series";
        return null;
    };

    const handleFieldClick = (fieldName: string) => {
        const currentType = getFieldType(fieldName);

        // If field is already selected, deselect it
        if (currentType) {
            onFieldSelect(currentType, "");
            return;
        }

        // Determine the best field type based on the field name and current selections
        const fieldNameLower = fieldName.toLowerCase();
        let fieldType: "category" | "value" | "series";

        if (
            fieldNameLower.includes("date") ||
            fieldNameLower.includes("time") ||
            fieldNameLower.includes("month") ||
            fieldNameLower.includes("year") ||
            fieldNameLower.includes("region") ||
            fieldNameLower.includes("product") ||
            fieldNameLower.includes("category")
        ) {
            fieldType = "category";
        } else if (
            fieldNameLower.includes("sales") ||
            fieldNameLower.includes("profit") ||
            fieldNameLower.includes("revenue") ||
            fieldNameLower.includes("amount") ||
            fieldNameLower.includes("value") ||
            fieldNameLower.includes("count")
        ) {
            fieldType = "value";
        } else {
            fieldType = "series";
        }

        // If the field type is already selected, use series instead
        if (
            (fieldType === "category" && selectedFields.category) ||
            (fieldType === "value" && selectedFields.value)
        ) {
            fieldType = "series";
        }

        onFieldSelect(fieldType, fieldName);
    };

    const getFieldIcon = (fieldName: string) => {
        const lowerName = fieldName.toLowerCase();
        if (
            lowerName.includes("date") ||
            lowerName.includes("time") ||
            lowerName.includes("month") ||
            lowerName.includes("year")
        ) {
            return <Calendar className="h-4 w-4 text-blue-500" />;
        }
        if (
            lowerName.includes("value") ||
            lowerName.includes("amount") ||
            lowerName.includes("sales") ||
            lowerName.includes("revenue") ||
            lowerName.includes("profit") ||
            lowerName.includes("count")
        ) {
            return <Hash className="h-4 w-4 text-green-500" />;
        }
        return <Tag className="h-4 w-4 text-gray-500" />;
    };

    const renderFieldButton = (
        fieldType: "category" | "value" | "series",
        fieldName: string
    ) => {
        const isSelected = selectedFields[fieldType] === fieldName;
        return (
            <Button
                key={fieldName}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={cn(
                    "w-full justify-start gap-2 mb-2",
                    fieldType === "category" && "bg-blue-500 hover:bg-blue-600",
                    fieldType === "value" && "bg-green-500 hover:bg-green-600",
                    fieldType === "series" &&
                        "bg-purple-500 hover:bg-purple-600"
                )}
                onClick={() => handleFieldClick(fieldName)}
            >
                {getFieldIcon(fieldName)}
                <span className="truncate">{fieldName}</span>
            </Button>
        );
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <h4 className="text-sm font-medium">Select Fields</h4>
                <div className="grid grid-cols-2 gap-2">
                    {dataset.columnNames.map((fieldName) => {
                        const fieldType = getFieldType(fieldName);
                        return (
                            <Button
                                key={fieldName}
                                variant={fieldType ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                    "w-full justify-start",
                                    fieldType === "category" &&
                                        "bg-blue-500 hover:bg-blue-600",
                                    fieldType === "value" &&
                                        "bg-green-500 hover:bg-green-600",
                                    fieldType === "series" &&
                                        "bg-purple-500 hover:bg-purple-600"
                                )}
                                onClick={() => handleFieldClick(fieldName)}
                            >
                                <span className="truncate">{fieldName}</span>
                                {fieldType && (
                                    <span className="ml-2 text-xs opacity-75">
                                        ({fieldType})
                                    </span>
                                )}
                            </Button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-2">
                <h4 className="text-sm font-medium">Selected Fields</h4>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Category:
                        </span>
                        <span className="text-sm font-medium">
                            {selectedFields.category || "Not selected"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Value:
                        </span>
                        <span className="text-sm font-medium">
                            {selectedFields.value || "Not selected"}
                        </span>
                    </div>
                    {selectedFields.series && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                Series:
                            </span>
                            <span className="text-sm font-medium">
                                {selectedFields.series}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DataFieldSelector;
