import { useState, useCallback } from "react";
import {
    datasetService,
    QueryParameters,
    Filter,
} from "@/services/datasetService";

export const useDatasetQuery = (datasetId: number) => {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState<Filter[]>([]);
    const [sortBy, setSortBy] = useState<string | undefined>();
    const [sortDirection, setSortDirection] = useState<
        "asc" | "desc" | undefined
    >();
    const [isInitialized, setIsInitialized] = useState(false);

    const loadData = useCallback(
        async (currentPage: number = 1) => {
            if (isLoading) return;

            setIsLoading(true);
            setError(null);

            try {
                const result = await datasetService.getDatasetDetail(
                    datasetId,
                    currentPage,
                    20, // pageSize
                    sortBy,
                    sortDirection,
                    filters
                );

                if (currentPage === 1) {
                    setData(result.data.items);
                } else {
                    setData((prev) => [...prev, ...result.data.items]);
                }

                setTotalCount(result.data.totalCount);
                setPage(result.data.page);
                setTotalPages(result.data.totalPages);
                return result.data;
            } catch (err) {
                const error =
                    err instanceof Error
                        ? err
                        : new Error("Failed to query dataset");
                setError(error);
                throw error;
            } finally {
                setIsLoading(false);
                setIsInitialized(true);
            }
        },
        [datasetId, filters, sortBy, sortDirection, isLoading]
    );

    // Initialize data on mount
    if (!isInitialized) {
        loadData(1);
    }

    const handlePageChange = useCallback(
        (newPage: number) => {
            setPage(newPage);
            loadData(newPage);
        },
        [loadData]
    );

    const addFilter = useCallback(
        (filter: Filter) => {
            // Update state
            setFilters((prev) => [...prev, filter]);
            setData([]); // Reset data

            // Call API immediately with new filter
            datasetService
                .getDatasetDetail(
                    datasetId,
                    1, // Reset to first page
                    20, // pageSize
                    sortBy,
                    sortDirection,
                    [...filters, filter] // Include new filter
                )
                .then((result) => {
                    setData(result.data.items);
                    setTotalCount(result.data.totalCount);
                    setPage(result.data.page);
                    setTotalPages(result.data.totalPages);
                })
                .catch((err) => {
                    const error =
                        err instanceof Error
                            ? err
                            : new Error("Failed to query dataset");
                    setError(error);
                })
                .finally(() => {
                    setIsLoading(false);
                    setIsInitialized(true);
                });
        },
        [datasetId, filters, sortBy, sortDirection]
    );

    const removeFilter = useCallback(
        (index: number) => {
            // Update state
            setFilters((prev) => {
                const newFilters = prev.filter((_, i) => i !== index);
                setData([]); // Reset data

                // Call API immediately with updated filters
                datasetService
                    .getDatasetDetail(
                        datasetId,
                        1, // Reset to first page
                        20, // pageSize
                        sortBy,
                        sortDirection,
                        newFilters
                    )
                    .then((result) => {
                        setData(result.data.items);
                        setTotalCount(result.data.totalCount);
                        setPage(result.data.page);
                        setTotalPages(result.data.totalPages);
                    })
                    .catch((err) => {
                        const error =
                            err instanceof Error
                                ? err
                                : new Error("Failed to query dataset");
                        setError(error);
                    })
                    .finally(() => {
                        setIsLoading(false);
                        setIsInitialized(true);
                    });

                return newFilters;
            });
        },
        [datasetId, sortBy, sortDirection]
    );

    const updateFilter = useCallback(
        (index: number, filter: Filter) => {
            // Update state
            setFilters((prev) => {
                const newFilters = prev.map((f, i) =>
                    i === index ? filter : f
                );
                setData([]); // Reset data

                // Call API immediately with updated filters
                datasetService
                    .getDatasetDetail(
                        datasetId,
                        1, // Reset to first page
                        20, // pageSize
                        sortBy,
                        sortDirection,
                        newFilters
                    )
                    .then((result) => {
                        setData(result.data.items);
                        setTotalCount(result.data.totalCount);
                        setPage(result.data.page);
                        setTotalPages(result.data.totalPages);
                    })
                    .catch((err) => {
                        const error =
                            err instanceof Error
                                ? err
                                : new Error("Failed to query dataset");
                        setError(error);
                    })
                    .finally(() => {
                        setIsLoading(false);
                        setIsInitialized(true);
                    });

                return newFilters;
            });
        },
        [datasetId, sortBy, sortDirection]
    );

    const clearFilters = useCallback(() => {
        // Update state
        setFilters([]);
        setData([]); // Reset data

        // Call API immediately without filters
        datasetService
            .getDatasetDetail(
                datasetId,
                1, // Reset to first page
                20, // pageSize
                sortBy,
                sortDirection,
                [] // Empty filters array
            )
            .then((result) => {
                setData(result.data.items);
                setTotalCount(result.data.totalCount);
                setPage(result.data.page);
                setTotalPages(result.data.totalPages);
            })
            .catch((err) => {
                const error =
                    err instanceof Error
                        ? err
                        : new Error("Failed to query dataset");
                setError(error);
            })
            .finally(() => {
                setIsLoading(false);
                setIsInitialized(true);
            });
    }, [datasetId, sortBy, sortDirection]);

    const setSorting = useCallback(
        (column: string, direction: "asc" | "desc") => {
            // Update state
            setSortBy(column);
            setSortDirection(direction);

            // Call API with new parameters immediately
            setData([]); // Reset data
            datasetService
                .getDatasetDetail(
                    datasetId,
                    1, // Reset to first page
                    20, // pageSize
                    column, // Use new sort column
                    direction, // Use new sort direction
                    filters
                )
                .then((result) => {
                    setData(result.data.items);
                    setTotalCount(result.data.totalCount);
                    setPage(result.data.page);
                    setTotalPages(result.data.totalPages);
                })
                .catch((err) => {
                    const error =
                        err instanceof Error
                            ? err
                            : new Error("Failed to query dataset");
                    setError(error);
                })
                .finally(() => {
                    setIsLoading(false);
                    setIsInitialized(true);
                });
        },
        [datasetId, filters]
    );

    const clearSorting = useCallback(() => {
        // Update state
        setSortBy(undefined);
        setSortDirection(undefined);

        // Call API without sort parameters immediately
        setData([]); // Reset data
        datasetService
            .getDatasetDetail(
                datasetId,
                1, // Reset to first page
                20, // pageSize
                undefined, // No sort column
                undefined, // No sort direction
                filters
            )
            .then((result) => {
                setData(result.data.items);
                setTotalCount(result.data.totalCount);
                setPage(result.data.page);
                setTotalPages(result.data.totalPages);
            })
            .catch((err) => {
                const error =
                    err instanceof Error
                        ? err
                        : new Error("Failed to query dataset");
                setError(error);
            })
            .finally(() => {
                setIsLoading(false);
                setIsInitialized(true);
            });
    }, [datasetId, filters]);

    return {
        data,
        isLoading,
        error,
        page,
        totalCount,
        totalPages,
        filters,
        sortBy,
        sortDirection,
        loadData,
        addFilter,
        removeFilter,
        updateFilter,
        clearFilters,
        setSorting,
        clearSorting,
        setPage: handlePageChange,
    };
};
