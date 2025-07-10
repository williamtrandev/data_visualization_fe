import { useState, useCallback, useEffect, useRef } from "react";
import {
    datasetService,
    QueryParameters,
    Filter,
} from "@/services/datasetService";

export const useDatasetDetail = (datasetId: number) => {
    const [dataset, setDataset] = useState<any>(null);
    const [columns, setColumns] = useState<any[]>([]);
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
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const currentFilters = useRef<Filter[]>([]);
    const currentSortBy = useRef<string | undefined>();
    const currentSortDirection = useRef<"asc" | "desc" | undefined>();

    const loadData = useCallback(
        async (currentPage: number = 1, append: boolean = false) => {
            if (isLoading && !append) return;
            if (isLoadingMore && append) return;

            if (append) {
                setIsLoadingMore(true);
            } else {
                setIsLoading(true);
            }
            setError(null);

            try {
                const queryParams: QueryParameters = {
                    page: currentPage,
                    pageSize: 20,
                };

                // Only add sort parameters if they are defined
                if (currentSortBy.current && currentSortDirection.current) {
                    queryParams.sortBy = currentSortBy.current;
                    queryParams.sortDirection = currentSortDirection.current;
                }

                // Only add filters if there are any
                if (currentFilters.current.length > 0) {
                    queryParams.filters = currentFilters.current;
                }

                const result = await datasetService.getDatasetDetail(
                    datasetId,
                    queryParams
                );

                if (currentPage === 1 || !append) {
                    setDataset({
                        datasetId: result.datasetId,
                        datasetName: result.datasetName,
                        sourceType: result.sourceType,
                        sourceName: result.sourceName,
                        createdAt: result.createdAt,
                        createdBy: result.createdBy,
                        totalRows: result.totalRows,
                        status: result.status,
                    });
                    setColumns(result.columns);
                    setData(result.data.items);
                } else {
                    setData((prev) => [...prev, ...result.data.items]);
                }

                setTotalCount(result.data.totalCount);
                setPage(result.data.page);
                setTotalPages(result.data.totalPages);
                setIsInitialized(true);
                return result;
            } catch (err) {
                const error =
                    err instanceof Error
                        ? err
                        : new Error("Failed to fetch dataset detail");
                setError(error);
                throw error;
            } finally {
                if (append) {
                    setIsLoadingMore(false);
                } else {
                    setIsLoading(false);
                }
            }
        },
        [datasetId, isLoading, isLoadingMore]
    );

    // Initialize data only once on mount
    useEffect(() => {
        if (!isInitialized && !isLoading) {
            loadData(1);
        }
    }, [isInitialized, isLoading, loadData]);

    const handlePageChange = useCallback(
        (newPage: number) => {
            if (newPage === page + 1) {
                // Loading more data (infinite scroll)
                loadData(newPage, true);
            } else {
                // Jumping to specific page
                setPage(newPage);
                loadData(newPage);
            }
        },
        [loadData, page]
    );

    const addFilter = useCallback(
        (filter: Filter) => {
            setFilters((prev) => {
                const newFilters = [...prev, filter];
                currentFilters.current = newFilters;
                // Reset to page 1 but don't clear data immediately
                setPage(1);
                loadData(1);
                return newFilters;
            });
        },
        [loadData]
    );

    const removeFilter = useCallback(
        (index: number) => {
            setFilters((prev) => {
                const newFilters = prev.filter((_, i) => i !== index);
                currentFilters.current = newFilters;
                // Reset to page 1 but don't clear data immediately
                setPage(1);
                loadData(1);
                return newFilters;
            });
        },
        [loadData]
    );

    const clearFilters = useCallback(() => {
        setFilters([]);
        currentFilters.current = [];
        // Reset to page 1 but don't clear data immediately
        setPage(1);
        loadData(1);
    }, [loadData]);

    const setSorting = useCallback(
        (column: string, direction: "asc" | "desc") => {
            setSortBy(column);
            setSortDirection(direction);
            currentSortBy.current = column;
            currentSortDirection.current = direction;
            // Reset to page 1 but don't clear data immediately
            setPage(1);
            loadData(1);
        },
        [loadData]
    );

    const clearSorting = useCallback(() => {
        setSortBy(undefined);
        setSortDirection(undefined);
        currentSortBy.current = undefined;
        currentSortDirection.current = undefined;
        // Reset to page 1 but don't clear data immediately
        setPage(1);
        loadData(1);
    }, [loadData]);

    return {
        dataset,
        columns,
        data,
        isLoading,
        isLoadingMore,
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
        clearFilters,
        setSorting,
        clearSorting,
        setPage: handlePageChange,
    };
};
