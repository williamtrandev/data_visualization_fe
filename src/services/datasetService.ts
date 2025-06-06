import axiosInstance from "@/lib/axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

interface ImportDatasetParams {
    file: File;
    datasetName: string;
}

export interface DatasetColumn {
    columnName: string;
    dataType: string;
    displayName: string;
    isRequired: boolean;
    description: string;
    order: number;
}

export interface Dataset {
    datasetId: number;
    datasetName: string;
    sourceType: string;
    sourceName: string;
    createdAt: string;
    createdBy: string;
    totalRows: number;
    status: string;
    columns: DatasetColumn[];
}

export interface DatasetResponse {
    items: Dataset[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

interface GetDatasetsResponse {
    items: Dataset[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

interface ColumnStatistics {
    totalValues: number;
    nullCount: number;
    uniqueCount: number;
    min: number;
    max: number;
    average: number;
    mostCommonValue: string;
    mostCommonCount: number;
}

interface Column {
    name: string;
    displayName: string;
    dataType: string;
    isRequired: boolean;
    description: string;
    order: number;
    statistics: ColumnStatistics;
    valueDistribution: Record<string, number>;
}

interface DatasetData {
    items: Record<string, any>[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface DatasetDetail {
    datasetId: number;
    datasetName: string;
    sourceType: string;
    sourceName: string;
    createdAt: string;
    createdBy: string;
    totalRows: number;
    status: string;
    columns: Column[];
    data: {
        items: Record<string, any>[];
        totalCount: number;
        page: number;
        pageSize: number;
        totalPages: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
    };
}

interface DatasetDropdown {
    datasetId: number;
    datasetName: string;
}

export type FilterOperator =
    | "eq"
    | "neq"
    | "gt"
    | "lt"
    | "gte"
    | "lte"
    | "contains";

export interface Filter {
    field: string;
    operator: FilterOperator;
    value: any;
}

export interface QueryParameters {
    filters?: Filter[];
    sortBy?: string;
    sortDirection?: "asc" | "desc";
    page?: number;
    pageSize?: number;
}

export interface QueryResult {
    items: any[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface DatasetQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface DatasetAggregationParams {
    categoryField: string;
    valueField: string;
    seriesField?: string;
    aggregation: "sum" | "avg" | "count" | "min" | "max";
    timeInterval?: "day" | "week" | "month" | "quarter" | "year";
    filters?: {
        field: string;
        operator: "eq" | "gt" | "lt" | "gte" | "lte" | "contains";
        value: any;
    }[];
}

export interface DatasetAggregationResponse {
    categories: string[];
    values: number[];
    series?: {
        name: string;
        data: number[];
    }[];
}

export const datasetService = {
    importDataset: async (
        file: File,
        datasetName: string
    ): Promise<Dataset> => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("datasetName", datasetName);
            const response = await axiosInstance.post(
                "/datasets/import/file",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getDatasets: async (
        params?: DatasetQueryParams
    ): Promise<DatasetResponse> => {
        try {
            const queryParams = {
                page: params?.page || 1,
                pageSize: params?.pageSize || 20,
                search: params?.search || "",
                sortBy: params?.sortBy || "",
                sortOrder: params?.sortOrder || "asc",
            };
            const response = await axiosInstance.get("/datasets", {
                params: queryParams,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getDatasetDetail: async (
        datasetId: number,
        queryParams?: QueryParameters
    ): Promise<DatasetDetail> => {
        try {
            const response = await axiosInstance.post(
                `/datasets/${datasetId}/detail`,
                queryParams
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getDatasetsDropdown: async (): Promise<
        { datasetId: number; datasetName: string }[]
    > => {
        try {
            const response = await axiosInstance.get("/datasets/dropdown");
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async aggregateDataset(
        datasetId: number,
        params: DatasetAggregationParams
    ): Promise<DatasetAggregationResponse> {
        try {
            const response = await axiosInstance.post(
                `/datasets/${datasetId}/aggregate`,
                params
            );
            return response.data;
        } catch (error) {
            console.error("Error aggregating dataset:", error);
            throw error;
        }
    },
};
