import { Dataset } from "@/types/dashboard";

interface ProcessedData {
    categories: string[];
    values: number[];
    series?: { name: string; data: number[] }[];
}

export const processDataForChart = (
    dataset: Dataset,
    chartType: string,
    options: {
        categoryField?: string;
        valueField?: string;
        seriesField?: string;
        aggregation?: "sum" | "average" | "count" | "min" | "max";
    } = {}
): ProcessedData => {
    if (!dataset.previewData || dataset.previewData.length === 0) {
        return { categories: [], values: [] };
    }

    const {
        categoryField,
        valueField,
        seriesField,
        aggregation = "sum",
    } = options;

    // If no fields specified, try to intelligently select fields
    const autoSelectedFields = autoSelectFields(dataset, chartType);
    const selectedCategoryField = categoryField || autoSelectedFields.category;
    const selectedValueField = valueField || autoSelectedFields.value;
    const selectedSeriesField = seriesField || autoSelectedFields.series;

    // For pie chart, we only need category and value
    if (chartType === "pie") {
        const groupedData = new Map<string, number[]>();

        dataset.previewData.forEach((row: any) => {
            const category =
                row[selectedCategoryField]?.toString() || "Unknown";
            const value = parseFloat(row[selectedValueField]) || 0;

            if (!groupedData.has(category)) {
                groupedData.set(category, []);
            }
            groupedData.get(category)?.push(value);
        });

        const categories: string[] = [];
        const values: number[] = [];

        groupedData.forEach((valuesArray, category) => {
            categories.push(category);
            values.push(aggregateValues(valuesArray, aggregation));
        });

        return { categories, values };
    }

    // For bar and line charts
    if (selectedSeriesField) {
        // Handle multiple series
        const seriesMap = new Map<string, Map<string, number[]>>();
        const allCategories = new Set<string>();

        // First pass: collect all categories and series
        dataset.previewData.forEach((row: any) => {
            const category =
                row[selectedCategoryField]?.toString() || "Unknown";
            const series = row[selectedSeriesField]?.toString() || "Unknown";
            allCategories.add(category);

            if (!seriesMap.has(series)) {
                seriesMap.set(series, new Map());
            }
            if (!seriesMap.get(series)?.has(category)) {
                seriesMap.get(series)?.set(category, []);
            }
        });

        // Second pass: collect values
        dataset.previewData.forEach((row: any) => {
            const category =
                row[selectedCategoryField]?.toString() || "Unknown";
            const series = row[selectedSeriesField]?.toString() || "Unknown";
            const value = parseFloat(row[selectedValueField]) || 0;

            seriesMap.get(series)?.get(category)?.push(value);
        });

        // Convert to final format
        const categories = Array.from(allCategories);
        const seriesData: { name: string; data: number[] }[] = [];

        seriesMap.forEach((categoryMap, seriesName) => {
            const data: number[] = [];
            categories.forEach((category) => {
                const values = categoryMap.get(category) || [];
                data.push(aggregateValues(values, aggregation));
            });
            seriesData.push({ name: seriesName, data });
        });

        // Sort categories if they are dates
        if (
            selectedCategoryField?.toLowerCase().includes("date") ||
            selectedCategoryField?.toLowerCase().includes("month") ||
            selectedCategoryField?.toLowerCase().includes("year")
        ) {
            categories.sort(
                (a, b) => new Date(a).getTime() - new Date(b).getTime()
            );
        }

        return {
            categories,
            values: [],
            series: seriesData,
        };
    } else {
        // Handle single series
        const categoryMap = new Map<string, number[]>();

        dataset.previewData.forEach((row: any) => {
            const category =
                row[selectedCategoryField]?.toString() || "Unknown";
            const value = parseFloat(row[selectedValueField]) || 0;

            if (!categoryMap.has(category)) {
                categoryMap.set(category, []);
            }
            categoryMap.get(category)?.push(value);
        });

        const categories: string[] = [];
        const values: number[] = [];

        categoryMap.forEach((valuesArray, category) => {
            categories.push(category);
            values.push(aggregateValues(valuesArray, aggregation));
        });

        // Sort categories if they are dates
        if (
            selectedCategoryField?.toLowerCase().includes("date") ||
            selectedCategoryField?.toLowerCase().includes("month") ||
            selectedCategoryField?.toLowerCase().includes("year")
        ) {
            categories.sort(
                (a, b) => new Date(a).getTime() - new Date(b).getTime()
            );
        }

        return { categories, values };
    }
};

const autoSelectFields = (dataset: Dataset, chartType: string) => {
    const fields = dataset.columnNames || [];
    const result: { category: string; value: string; series?: string } = {
        category: "",
        value: "",
    };

    // Try to find date/time fields for category
    const dateFields = fields.filter(
        (f) =>
            f.toLowerCase().includes("date") ||
            f.toLowerCase().includes("time") ||
            f.toLowerCase().includes("month") ||
            f.toLowerCase().includes("year")
    );
    if (dateFields.length > 0) {
        result.category = dateFields[0];
    }

    // Try to find numeric fields for values
    const numericFields = fields.filter(
        (f) =>
            f.toLowerCase().includes("value") ||
            f.toLowerCase().includes("amount") ||
            f.toLowerCase().includes("sales") ||
            f.toLowerCase().includes("revenue") ||
            f.toLowerCase().includes("profit") ||
            f.toLowerCase().includes("count")
    );
    if (numericFields.length > 0) {
        result.value = numericFields[0];
    }

    // Try to find categorical fields for series
    const categoricalFields = fields.filter(
        (f) =>
            f.toLowerCase().includes("category") ||
            f.toLowerCase().includes("type") ||
            f.toLowerCase().includes("region") ||
            f.toLowerCase().includes("product") ||
            f.toLowerCase().includes("group")
    );
    if (categoricalFields.length > 0) {
        result.series = categoricalFields[0];
    }

    // If no fields were found, use the first available fields
    if (!result.category && fields.length > 0) {
        result.category = fields[0];
    }
    if (!result.value && fields.length > 1) {
        result.value = fields[1];
    }
    if (!result.series && fields.length > 2) {
        result.series = fields[2];
    }

    return result;
};

const aggregateValues = (
    values: number[],
    aggregation: "sum" | "average" | "count" | "min" | "max"
): number => {
    if (values.length === 0) return 0;

    switch (aggregation) {
        case "sum":
            return values.reduce((a, b) => a + b, 0);
        case "average":
            return values.reduce((a, b) => a + b, 0) / values.length;
        case "count":
            return values.length;
        case "min":
            return Math.min(...values);
        case "max":
            return Math.max(...values);
        default:
            return values.reduce((a, b) => a + b, 0);
    }
};
