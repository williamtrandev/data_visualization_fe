import { useState, useEffect } from "react";
import { datasetService } from "../services/datasetService";

export const useDatasets = (
    initialPage: number = 1,
    initialPageSize: number = 20
) => {
    const [datasets, setDatasets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);

    const fetchDatasets = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await datasetService.getDatasets(page, pageSize);
            setDatasets(response.items);
            setTotalCount(response.totalCount);
            setTotalPages(response.totalPages);
            setHasNextPage(response.hasNextPage);
            setHasPreviousPage(response.hasPreviousPage);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err
                    : new Error("Failed to fetch datasets")
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDatasets();
    }, [page, pageSize]);

    const nextPage = () => {
        if (hasNextPage) {
            setPage((prev) => prev + 1);
        }
    };

    const previousPage = () => {
        if (hasPreviousPage) {
            setPage((prev) => prev - 1);
        }
    };

    const refreshDatasets = () => {
        fetchDatasets();
    };

    return {
        datasets,
        isLoading,
        error,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        nextPage,
        previousPage,
        refreshDatasets,
        setPageSize,
    };
};
