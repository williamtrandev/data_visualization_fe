import React, { useEffect, useRef, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useDatasetDetail } from "@/hooks/useDatasetDetail";
import { useDatasetQuery } from "@/hooks/useDatasetQuery";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    FileText,
    Table as TableIcon,
    Database,
    Filter,
    ArrowUpDown,
    X,
} from "lucide-react";
import { FilterOperator } from "@/services/datasetService";

const DatasetDetail = () => {
    const { datasetId } = useParams<{ datasetId: string }>();
    const {
        dataset,
        columns,
        isLoading: isDetailLoading,
        error: detailError,
    } = useDatasetDetail(Number(datasetId));

    const {
        data,
        isLoading: isQueryLoading,
        error: queryError,
        page,
        totalCount,
        totalPages,
        filters,
        sortBy,
        sortDirection,
        query,
        addFilter,
        removeFilter,
        updateFilter,
        clearFilters,
        setSorting,
        clearSorting,
        setPage,
    } = useDatasetQuery(Number(datasetId));

    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const [newFilter, setNewFilter] = useState({
        column: "",
        operator: "eq" as FilterOperator,
        value: "",
    });

    const observer = useRef<IntersectionObserver>();
    const lastElementRef = useCallback(
        (node: HTMLTableRowElement) => {
            if (isQueryLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (
                    entries[0].isIntersecting &&
                    page < totalPages &&
                    !isQueryLoading
                ) {
                    setPage(page + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isQueryLoading, page, totalPages, setPage]
    );

    const handleAddFilter = () => {
        if (newFilter.column && newFilter.value) {
            addFilter(newFilter);
            setNewFilter({ column: "", operator: "eq", value: "" });
            setIsFilterDialogOpen(false);
        }
    };

    const handleSort = (column: string) => {
        if (sortBy !== column) {
            setSorting(column, "asc");
            return;
        }

        if (sortDirection === "asc") {
            setSorting(column, "desc");
        } else {
            clearSorting();
        }
    };

    const getSortIcon = (column: string) => {
        if (sortBy !== column) {
            return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
        }
        if (sortDirection === "asc") {
            return <ArrowUpDown className="h-4 w-4 text-primary" />;
        }
        if (sortDirection === "desc") {
            return <ArrowUpDown className="h-4 w-4 text-primary rotate-180" />;
        }
        return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    };

    if (detailError) {
        return (
            <div className="p-4 text-center text-red-500">
                Error loading dataset: {detailError.message}
            </div>
        );
    }

    if (isDetailLoading || !dataset) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dashboard-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Dataset Info */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        {dataset.sourceType === "csv" && (
                            <FileText className="h-5 w-5 text-dashboard-primary" />
                        )}
                        {dataset.sourceType === "excel" && (
                            <TableIcon className="h-5 w-5 text-dashboard-accent" />
                        )}
                        {dataset.sourceType === "database" && (
                            <Database className="h-5 w-5 text-dashboard-secondary" />
                        )}
                        <CardTitle>{dataset.datasetName}</CardTitle>
                    </div>
                    <CardDescription>
                        {dataset.sourceType.toUpperCase()} • {dataset.totalRows}{" "}
                        rows • Created by {dataset.createdBy}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Source Type
                            </p>
                            <p>{dataset.sourceType}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Total Rows
                            </p>
                            <p>{dataset.totalRows}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Created At
                            </p>
                            <p>
                                {new Date(
                                    dataset.createdAt
                                ).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Status
                            </p>
                            <p>{dataset.status}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Query Controls */}
            <div className="flex items-center gap-4">
                <Dialog
                    open={isFilterDialogOpen}
                    onOpenChange={setIsFilterDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Add Filter
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Filter</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Column
                                </label>
                                <Select
                                    value={newFilter.column}
                                    onValueChange={(value) =>
                                        setNewFilter((prev) => ({
                                            ...prev,
                                            column: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select column" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {columns.map((column) => (
                                            <SelectItem
                                                key={column.name}
                                                value={column.name}
                                            >
                                                {column.displayName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Operator
                                </label>
                                <Select
                                    value={newFilter.operator}
                                    onValueChange={(value) =>
                                        setNewFilter((prev) => ({
                                            ...prev,
                                            operator: value as FilterOperator,
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select operator" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="eq">
                                            Equals
                                        </SelectItem>
                                        <SelectItem value="neq">
                                            Not Equals
                                        </SelectItem>
                                        <SelectItem value="gt">
                                            Greater Than
                                        </SelectItem>
                                        <SelectItem value="lt">
                                            Less Than
                                        </SelectItem>
                                        <SelectItem value="gte">
                                            Greater Than or Equal
                                        </SelectItem>
                                        <SelectItem value="lte">
                                            Less Than or Equal
                                        </SelectItem>
                                        <SelectItem value="contains">
                                            Contains
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Value
                                </label>
                                <Input
                                    value={newFilter.value}
                                    onChange={(e) =>
                                        setNewFilter((prev) => ({
                                            ...prev,
                                            value: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter value"
                                />
                            </div>
                            <Button
                                onClick={handleAddFilter}
                                className="w-full"
                            >
                                Add Filter
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {filters.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                        <X className="h-4 w-4 mr-2" />
                        Clear Filters
                    </Button>
                )}

                <div className="flex-1" />
            </div>

            {/* Active Filters */}
            {filters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {filters.map((filter, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm"
                        >
                            <span>{filter.column}</span>
                            <span>{filter.operator}</span>
                            <span>{filter.value}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0"
                                onClick={() => {
                                    removeFilter(index);
                                    query();
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Data Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">#</TableHead>
                            {columns.map((column) => (
                                <TableHead key={column.name}>
                                    <div className="flex items-center gap-2">
                                        <span>{column.displayName}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 p-0"
                                            onClick={() =>
                                                handleSort(column.name)
                                            }
                                        >
                                            {getSortIcon(column.name)}
                                        </Button>
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, rowIndex) => (
                            <TableRow
                                key={rowIndex}
                                ref={
                                    rowIndex === data.length - 1
                                        ? lastElementRef
                                        : undefined
                                }
                            >
                                <TableCell className="text-muted-foreground">
                                    {rowIndex + 1}
                                </TableCell>
                                {columns.map((column) => (
                                    <TableCell key={column.name}>
                                        {row[column.name]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {isQueryLoading && (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + 1}
                                    className="text-center"
                                >
                                    <div className="flex justify-center items-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-dashboard-primary"></div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Loading indicator at bottom */}
            {!isQueryLoading && page < totalPages && (
                <div className="text-center text-muted-foreground">
                    Scroll to load more...
                </div>
            )}
            {!isQueryLoading && page >= totalPages && data.length > 0 && (
                <div className="text-center text-muted-foreground">
                    No more data to load
                </div>
            )}
        </div>
    );
};

export default DatasetDetail;
