import { useState, useEffect, useCallback } from "react";
import { datasetService } from "../services/datasetService";

export const useDatasetDetail = (datasetId: number) => {
    const [dataset, setDataset] = useState<any>(null);
    const [columns, setColumns] = useState<any[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const fetchDatasetDetail = useCallback(
        async (pageToFetch: number) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await datasetService.getDatasetDetail(
                    datasetId,
                    pageToFetch
                );

                if (pageToFetch === 1) {
                    // First load - set initial data
                    setDataset(response);
                    setColumns(response.columns);
                    setData(response.data.items);
                    setTotalCount(response.data.totalCount);
                } else {
                    // Append new data
                    setData((prev) => [...prev, ...response.data.items]);
                }

                setHasMore(response.data.hasNextPage);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error("Failed to fetch dataset detail")
                );
            } finally {
                setIsLoading(false);
            }
        },
        [datasetId]
    );

    useEffect(() => {
        fetchDatasetDetail(1);
    }, [fetchDatasetDetail]);

    const loadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            setPage((prev) => prev + 1);
            fetchDatasetDetail(page + 1);
        }
    }, [isLoading, hasMore, page, fetchDatasetDetail]);

    return {
        dataset,
        columns,
        data,
        isLoading,
        error,
        hasMore,
        totalCount,
        loadMore,
    };
};
