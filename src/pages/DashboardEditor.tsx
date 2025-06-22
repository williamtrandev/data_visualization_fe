import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import ColorPicker from "@/components/ui/color-picker";
import ThemePreview from "@/components/ui/theme-preview";
import { useForm } from "react-hook-form";
import {
    Save,
    Share,
    Eye,
    Plus,
    Database,
    BarChart,
    PieChart,
    LineChart,
    Table,
    Settings,
    Filter,
    X,
    ChartPie,
    Download,
    FileText,
    FileSpreadsheet,
    FileChartLine,
    FileChartPie,
    Import,
    Move,
    Palette,
    ArrowRight,
} from "lucide-react";
import { customToast } from "@/lib/toast";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    ResponsiveContainer,
    BarChart as RechartsBarChart,
    Bar,
    LineChart as RechartsLineChart,
    Line,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "@/components/ui/resizable";
import DraggableChartItem from "@/components/dashboard/DraggableChartItem";
import ImportDataModal from "@/components/dashboard/ImportDataModal";
import { DashboardItem, Dataset, ChartColors, ChartOptions } from "@/types/dashboard";
import { processDataForChart } from "@/lib/chartDataProcessor";
import DataFieldSelector from "@/components/dashboard/DataFieldSelector";
import { datasetService } from "@/services/datasetService";
import { dashboardService } from "@/services/dashboardService";

// Mock chart types with more detailed information
const chartTypes = [
    {
        id: "bar",
        name: "Bar Chart",
        icon: BarChart,
        description: "Compare values across categories",
    },
    {
        id: "line",
        name: "Line Chart",
        icon: LineChart,
        description: "Show trends over time or categories",
    },
    {
        id: "pie",
        name: "Pie Chart",
        icon: PieChart,
        description: "Display proportion of parts to a whole",
    },
    {
        id: "table",
        name: "Table",
        icon: Table,
        description: "Present data in rows and columns",
    },
    {
        id: "stacked-bar",
        name: "Stacked Bar",
        icon: BarChart,
        description: "Show parts of a whole across categories",
    },
    {
        id: "area",
        name: "Area Chart",
        icon: LineChart,
        description: "Visualize volume across time",
    },
];

// Expanded list of visualization types with detailed properties
const visualizationTypes = [
    {
        id: "bar",
        name: "Bar Chart",
        icon: BarChart,
        properties: [
            "xAxis",
            "yAxis",
            "legend",
            "colors",
            "labels",
            "gridLines",
        ],
    },
    {
        id: "line",
        name: "Line Chart",
        icon: LineChart,
        properties: [
            "xAxis",
            "yAxis",
            "legend",
            "colors",
            "markers",
            "smoothing",
        ],
    },
    {
        id: "pie",
        name: "Pie Chart",
        icon: PieChart,
        properties: [
            "values",
            "labels",
            "legend",
            "colors",
            "innerRadius",
            "outerRadius",
        ],
    },
    {
        id: "table",
        name: "Table",
        icon: Table,
        properties: [
            "columns",
            "rows",
            "sorting",
            "pagination",
            "styling",
            "columnWidths",
        ],
    },
];

// Power BI inspired color palettes
const colorPalettes = {
    default: {
        name: "Default",
        barColors: ["#0078D4", "#83C7F7", "#0078D4", "#3996D3", "#63ADEF"],
        lineColors: ["#107C10", "#94CF94", "#73AA24", "#46A046", "#86BC25"],
        pieColors: [
            "#FFB900",
            "#FF8C00",
            "#E81123",
            "#EC008C",
            "#68217A",
            "#00BCF2",
            "#00B294",
        ],
        backgroundColor: "#ffffff",
        textColor: "#252423",
        gridColor: "#E1DFDD",
        description: "Default theme"
    },
    modern: {
        name: "Modern",
        barColors: ["#4F6BED", "#8A9AF1", "#A2B0F5", "#BAC2F9", "#D2D4FC"],
        lineColors: ["#FF8961", "#FF9F80", "#FFBDA1", "#FFD4B8", "#FFE8D1"],
        pieColors: [
            "#00CC6A",
            "#0096C7",
            "#0074D9",
            "#7FDBFF",
            "#39CCCC",
            "#3D9970",
            "#2ECC40",
        ],
        backgroundColor: "#F8F8F8",
        textColor: "#252423",
        gridColor: "#E1DFDD",
        description: "Modern gradient theme"
    },
    dark: {
        name: "Dark",
        barColors: ["#4894FE", "#FF8B8B", "#FFE556", "#7CD474", "#C984F9"],
        lineColors: ["#00BCF2", "#FF8C00", "#FFB900", "#107C10", "#DF3A91"],
        pieColors: [
            "#4894FE",
            "#FF8B8B",
            "#FFE556",
            "#7CD474",
            "#C984F9",
            "#00B294",
            "#FF8C00",
        ],
        backgroundColor: "#201F1F",
        textColor: "#F3F2F1",
        gridColor: "#3B3A39",
        description: "Dark theme for better contrast"
    },
    pastel: {
        name: "Pastel",
        barColors: ["#AADEA2", "#F2C5AE", "#A2C5F9", "#F9C3D9", "#C3E5E9"],
        lineColors: ["#FFD7B1", "#C1E0F7", "#D9EAD3", "#FFF2CC", "#E6D0DE"],
        pieColors: [
            "#AADEA2",
            "#F2C5AE",
            "#A2C5F9",
            "#F9C3D9",
            "#C3E5E9",
            "#FFD7B1",
            "#D9EAD3",
        ],
        backgroundColor: "#FCFDFD",
        textColor: "#252423",
        gridColor: "#ECF0F1",
        description: "Soft pastel colors"
    },
    vibrant: {
        name: "Vibrant",
        barColors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
        lineColors: ["#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"],
        pieColors: [
            "#FF6B6B",
            "#4ECDC4",
            "#45B7D1",
            "#96CEB4",
            "#FFEAA7",
            "#DDA0DD",
            "#98D8C8",
        ],
        backgroundColor: "#ffffff",
        textColor: "#2C3E50",
        gridColor: "#BDC3C7",
        description: "Bold and vibrant colors"
    },
    corporate: {
        name: "Corporate",
        barColors: ["#34495E", "#3498DB", "#2980B9", "#5D6D7E", "#85929E"],
        lineColors: ["#E74C3C", "#C0392B", "#A93226", "#922B21", "#7B241C"],
        pieColors: [
            "#34495E",
            "#3498DB",
            "#2980B9",
            "#5D6D7E",
            "#85929E",
            "#E74C3C",
            "#C0392B",
        ],
        backgroundColor: "#ffffff",
        textColor: "#2C3E50",
        gridColor: "#ECF0F1",
        description: "Professional corporate theme"
    }
};

// Sample mock data for charts
const sampleBarData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 600 },
    { name: "Apr", value: 800 },
    { name: "May", value: 500 },
    { name: "Jun", value: 700 },
];

const samplePieData = [
    { name: "Product A", value: 400 },
    { name: "Product B", value: 300 },
    { name: "Product C", value: 300 },
    { name: "Product D", value: 200 },
];

const sampleLineData = [
    { name: "Jan", value: 400, previousYear: 240 },
    { name: "Feb", value: 300, previousYear: 380 },
    { name: "Mar", value: 600, previousYear: 550 },
    { name: "Apr", value: 800, previousYear: 700 },
    { name: "May", value: 500, previousYear: 520 },
    { name: "Jun", value: 700, previousYear: 650 },
];

// Chart config defines the appearance and behavior for each chart type
const chartConfig = {
    bar: {
        name: "Bar Chart",
        icon: BarChart,
        defaultOptions: {
            horizontal: false,
            showGrid: true,
            showLegend: true,
            stacked: false,
        },
        renderPreview: (
            data: any[],
            options: ChartOptions = {},
            colorPalette = colorPalettes.default
        ) => (
            <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={data}>
                    {(options.showGrid ?? true) && (
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={colorPalette.gridColor}
                        />
                    )}
                    <XAxis
                        dataKey="name"
                        tick={{ fill: colorPalette.textColor }}
                    />
                    <YAxis tick={{ fill: colorPalette.textColor }} />
                    <Tooltip />
                    {(options.showLegend ?? true) && <Legend />}
                    <Bar
                        dataKey="value"
                        fill={options.barColor || colorPalette.barColors[0]}
                    />
                </RechartsBarChart>
            </ResponsiveContainer>
        ),
    },
    line: {
        name: "Line Chart",
        icon: LineChart,
        defaultOptions: {
            showGrid: true,
            showLegend: true,
            showDots: true,
            smooth: false,
        },
        renderPreview: (
            data: any[],
            options: ChartOptions = {},
            colorPalette = colorPalettes.default
        ) => (
            <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={data}>
                    {(options.showGrid ?? true) && (
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={colorPalette.gridColor}
                        />
                    )}
                    <XAxis
                        dataKey="name"
                        tick={{ fill: colorPalette.textColor }}
                    />
                    <YAxis tick={{ fill: colorPalette.textColor }} />
                    <Tooltip />
                    {(options.showLegend ?? true) && <Legend />}
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={options.lineColor || colorPalette.lineColors[0]}
                        strokeWidth={2}
                        dot={options.showDots}
                    />
                    <Line
                        type="monotone"
                        dataKey="previousYear"
                        stroke={
                            options.previousYearColor ||
                            colorPalette.lineColors[1]
                        }
                        strokeWidth={2}
                        dot={options.showDots}
                        strokeDasharray="5 5"
                    />
                </RechartsLineChart>
            </ResponsiveContainer>
        ),
    },
    pie: {
        name: "Pie Chart",
        icon: PieChart,
        defaultOptions: {
            showLegend: true,
            innerRadius: 0,
            outerRadius: 80,
            paddingAngle: 0,
        },
        renderPreview: (
            data: any[],
            options: ChartOptions = {},
            colorPalette = colorPalettes.default
        ) => (
            <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={options.innerRadius || 0}
                        outerRadius={options.outerRadius || 80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label
                    >
                        {data.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={
                                    (options.pieColors && options.pieColors[index % options.pieColors.length])
                                    || colorPalette.pieColors[index % colorPalette.pieColors.length]
                                }
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    {(options.showLegend ?? true) && <Legend />}
                </RechartsPieChart>
            </ResponsiveContainer>
        ),
    },
};

// TEMPORARY: TestBarChart component for debugging
const exampleChartOptions = {
    horizontal: false,
    showGrid: true,
    showLegend: true,
    stacked: false,
    barColor: "#0078D4",
    lineColor: "#107C10",
    categoryField: "Region",
    valueField: "TotalPrice",
    aggregation: "sum",
    data: {
        categories: ["East", "North", "South", "West"],
        values: [6797, 6782, 9116, 6270],
        series: [],
    },
};
const chartData = exampleChartOptions.data.categories.map(
    (category, index) => ({
        name: category,
        value: exampleChartOptions.data.values[index],
    })
);

console.log("Test Chart Data Structure:", {
    exampleChartOptions,
    chartData,
});

function TestBarChart() {
    console.log("Rendering Test Chart with data:", chartData);
    return (
        <div style={{ width: 400, height: 300, margin: "24px auto" }}>
            <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={chartData}>
                    {exampleChartOptions.showGrid && (
                        <CartesianGrid strokeDasharray="3 3" stroke="#E1DFDD" />
                    )}
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    {exampleChartOptions.showLegend && <Legend />}
                    <Bar dataKey="value" fill={exampleChartOptions.barColor} />
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
}

const DashboardEditor = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isNewDashboard = id === undefined || id === "new";
    const [dashboardTitle, setDashboardTitle] = useState(
        isNewDashboard ? "New Dashboard" : "Dashboard Title"
    );
    const [selectedElement, setSelectedElement] = useState<DashboardItem | null>(null);
    const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([]);
    const [selectedDataSource, setSelectedDataSource] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [currentTab, setCurrentTab] = useState<"charts" | "data">("charts");
    const [draggedItem, setDraggedItem] = useState<{
        type: string;
        dataSourceId?: string;
    } | null>(null);
    const [selectedColorPalette, setSelectedColorPalette] = useState<string>("default");
    const canvasRef = useRef<HTMLDivElement>(null);
    const [isMoving, setIsMoving] = useState(false);
    const [moveOffset, setMoveOffset] = useState({ x: 0, y: 0 });
    const [movingItemId, setMovingItemId] = useState<string | null>(null);
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [isLoadingDatasets, setIsLoadingDatasets] = useState(false);
    const [hasMoreDatasets, setHasMoreDatasets] = useState(true);
    const [datasetPage, setDatasetPage] = useState(1);
    const datasetPageSize = 20;
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [dashboardBackground, setDashboardBackground] = useState("#f5f5f5");
    // Track canvas dimensions to handle overflow
    const [canvasSize, setCanvasSize] = useState({ width: 2000, height: 2000 });
    const [selectedFields, setSelectedFields] = useState<{
        category?: string;
        value?: string;
        series?: string;
    }>({});
    const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
    const [chartOptions, setChartOptions] = useState({
        categoryField: "",
        valueField: "",
        seriesField: "",
        aggregation: "sum",
        timeInterval: "month",
    });
    const [hasChanges, setHasChanges] = useState(false);
    const [initialState, setInitialState] = useState<{
        title: string;
        items: DashboardItem[];
    } | null>(null);

    const form = useForm({
        defaultValues: {
            title: "",
            showLegend: true,
            showGrid: true,
            barColor: "#4F6BED",
            lineColor: "#FF8961",
            xAxisLabel: "",
            yAxisLabel: "",
            innerRadius: 0,
            outerRadius: 80,
            backgroundColor: "#ffffff",
            borderColor: "#e5e7eb",
        },
    });

    // Generate a unique ID
    const generateId = () => `item_${Math.random().toString(36).substr(2, 9)}`;

    // Handle drag of chart types
    const handleDragStart = (e: React.DragEvent, chartType: string) => {
        setDraggedItem({ type: chartType });
        e.dataTransfer.setData("chartType", chartType);
        // Create a custom ghost image for dragging
        const ghostElement = document.createElement("div");
        ghostElement.classList.add(
            "bg-dashboard-primary",
            "text-white",
            "p-2",
            "rounded"
        );
        ghostElement.innerText = chartType;
        document.body.appendChild(ghostElement);
        e.dataTransfer.setDragImage(ghostElement, 0, 0);
        setTimeout(() => {
            document.body.removeChild(ghostElement);
        }, 0);
    };

    // Handle data source drag
    const handleDataSourceDragStart = (
        e: React.DragEvent,
        dataSourceId: string
    ) => {
        setDraggedItem({ type: "dataset", dataSourceId });
        e.dataTransfer.setData("dataSourceId", dataSourceId);
    };

    // Expand canvas if needed to fit items
    const expandCanvasIfNeeded = (
        x: number,
        y: number,
        width: number,
        height: number
    ) => {
        const rightEdge = x + width + 50; // Add padding
        const bottomEdge = y + height + 50;

        let newWidth = canvasSize.width;
        let newHeight = canvasSize.height;

        if (rightEdge > canvasSize.width) {
            newWidth = rightEdge;
        }

        if (bottomEdge > canvasSize.height) {
            newHeight = bottomEdge;
        }

        if (newWidth !== canvasSize.width || newHeight !== canvasSize.height) {
            setCanvasSize({ width: newWidth, height: newHeight });
        }
    };

    // Handle drag over on the canvas
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (canvasRef.current) {
            canvasRef.current.classList.add(
                "border-dashboard-primary",
                "border-2"
            );
        }
    };

    // Handle drag leave on the canvas
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        if (canvasRef.current) {
            canvasRef.current.classList.remove(
                "border-dashboard-primary",
                "border-2"
            );
        }
    };

    // Handle drop on the canvas
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (canvasRef.current) {
            canvasRef.current.classList.remove(
                "border-dashboard-primary",
                "border-2"
            );

            const chartType = e.dataTransfer.getData("chartType");
            const dataSourceId = e.dataTransfer.getData("dataSourceId");

            // Calculate the position relative to the canvas
            const rect = canvasRef.current.getBoundingClientRect();
            const x = Math.round((e.clientX - rect.left) / 20) * 20; // Snap to grid
            const y = Math.round((e.clientY - rect.top) / 20) * 20; // Snap to grid

            // Find a suitable position to place the new chart (avoiding overlap)
            const { newX, newY } = findSuitablePosition(x, y);

            if (chartType) {
                // Create a new dashboard item
                const currentPalette =
                    colorPalettes[
                    selectedColorPalette as keyof typeof colorPalettes
                    ];
                const newWidth = 400;
                const newHeight = 300;

                // Expand canvas if needed
                expandCanvasIfNeeded(newX, newY, newWidth, newHeight);

                const newItem: DashboardItem = {
                    id: generateId(),
                    type: chartType,
                    x: newX,
                    y: newY,
                    width: newWidth,
                    height: newHeight,
                    title: `${chartConfig[chartType as keyof typeof chartConfig]
                        ?.name || "Chart"
                        }`,
                    dataSourceId: null,
                    chartOptions: {
                        ...(chartConfig[chartType as keyof typeof chartConfig]
                            ?.defaultOptions || {}),
                        barColor: currentPalette.barColors[0],
                        lineColor: currentPalette.lineColors[0],
                        backgroundColor: currentPalette.backgroundColor,
                        borderColor: "#e5e7eb",
                    },
                };

                setDashboardItems((prev) => [...prev, newItem]);
                setSelectedElement(newItem);

                customToast.success(`Added ${chartType} to dashboard!`);
            } else if (dataSourceId) {
                // If a dataset is dropped directly, we could either:
                // 1. Create a default chart with this data source
                // 2. Update the selected element with this data source
                if (selectedElement) {
                    const updatedItem = {
                        ...selectedElement,
                        dataSourceId,
                        title: `${selectedElement.title} - ${datasets.find((ds) => ds.datasetId === dataSourceId)?.name
                            }`,
                        chartOptions: {
                            ...selectedElement.chartOptions,
                            backgroundColor: currentPalette.backgroundColor,
                            borderColor: "#e5e7eb",
                        },
                    };

                    setDashboardItems((prev) =>
                        prev.map((item) =>
                            item.id === selectedElement.id ? updatedItem : item
                        )
                    );
                    setSelectedElement(updatedItem);
                    setSelectedDataSource(dataSourceId);

                    // Set preview data
                    const dataset = datasets.find(
                        (ds) => ds.datasetId === dataSourceId
                    );
                    if (dataset && dataset.previewData) {
                        setPreviewData(dataset.previewData);
                    }

                    customToast.success(`Data source assigned to chart!`);
                } else {
                    // Create a new table visualization with this data
                    const dataset = datasets.find(
                        (ds) => ds.datasetId === dataSourceId
                    );
                    const currentPalette =
                        colorPalettes[
                        selectedColorPalette as keyof typeof colorPalettes
                        ];
                    const newWidth = 400;
                    const newHeight = 300;

                    // Expand canvas if needed
                    expandCanvasIfNeeded(newX, newY, newWidth, newHeight);

                    const newItem: DashboardItem = {
                        id: generateId(),
                        type: "table",
                        x: newX,
                        y: newY,
                        width: newWidth,
                        height: newHeight,
                        title: `${dataset?.name || "Data Table"}`,
                        dataSourceId,
                        chartOptions: {
                            backgroundColor: currentPalette.backgroundColor,
                            borderColor: "#e5e7eb",
                        },
                    };

                    setDashboardItems((prev) => [...prev, newItem]);
                    setSelectedElement(newItem);
                    setSelectedDataSource(dataSourceId);

                    // Set preview data
                    if (dataset && dataset.previewData) {
                        setPreviewData(dataset.previewData);
                    }

                    customToast.success(
                        `Added table with ${dataset?.datasetName} data!`
                    );
                }
            }
        }

        setDraggedItem(null);
    };

    // Find a suitable position for a new chart (avoiding overlaps)
    const findSuitablePosition = (x: number, y: number) => {
        let newX = x;
        let newY = y;

        // Check if the position overlaps with existing charts
        const checkOverlap = () => {
            return dashboardItems.some((item) => {
                return (
                    newX < item.x + item.width &&
                    newX + 400 > item.x &&
                    newY < item.y + item.height &&
                    newY + 300 > item.y
                );
            });
        };

        // If overlaps, adjust the position
        if (checkOverlap()) {
            // Try to find space on the grid (each 20px)
            for (let gridY = 0; gridY < canvasSize.height; gridY += 20) {
                for (let gridX = 0; gridX < canvasSize.width; gridX += 20) {
                    newX = gridX;
                    newY = gridY;
                    if (!checkOverlap()) {
                        return { newX, newY };
                    }
                }
            }
        }

        return { newX, newY };
    };

    // Handle item moving
    useEffect(() => {
        if (!isMoving || !movingItemId) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!canvasRef.current) return;

            const rect = canvasRef.current.getBoundingClientRect();
            // Snap to grid (20px)
            const x =
                Math.round((e.clientX - rect.left - moveOffset.x) / 20) * 20;
            const y =
                Math.round((e.clientY - rect.top - moveOffset.y) / 20) * 20;

            // Find the current item
            const currentItem = dashboardItems.find(
                (item) => item.id === movingItemId
            );
            if (currentItem) {
                // Expand canvas if needed
                expandCanvasIfNeeded(
                    x,
                    y,
                    currentItem.width,
                    currentItem.height
                );
            }

            setDashboardItems((prev) =>
                prev.map((item) =>
                    item.id === movingItemId ? { ...item, x, y } : item
                )
            );
        };

        const handleMouseUp = () => {
            setIsMoving(false);
            setMovingItemId(null);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isMoving, movingItemId, moveOffset, dashboardItems]);

    // Start moving an item
    const startMovingItem = (e: React.MouseEvent, item: DashboardItem) => {
        e.preventDefault();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setMoveOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
        setIsMoving(true);
        setMovingItemId(item.id);
        setSelectedElement(item);
    };

    // Handle chart resizing
    const handleChartResize = (id: string, width: number, height: number) => {
        setDashboardItems((prev) => {
            const updatedItems = prev.map((item) => {
                if (item.id === id) {
                    // Expand canvas if needed
                    expandCanvasIfNeeded(item.x, item.y, width, height);
                    return { ...item, width, height };
                }
                return item;
            });
            return updatedItems;
        });
    };

    // Handle click on a dashboard item
    const handleItemClick = (item: DashboardItem) => {
        setSelectedElement(item);
        if (item.dataSourceId) {
            const dataset = datasets.find((ds) => ds.datasetId === item.dataSourceId);
            setSelectedDataset(dataset || null);
            setSelectedDataSource(item.dataSourceId);
            if (dataset?.previewData) {
                setPreviewData(dataset.previewData);
            }
        } else {
            setSelectedDataset(null);
            setSelectedDataSource(null);
            setPreviewData([]);
        }
    };

    // Update the dataset selection handler
    const handleDatasetSelect = async (dataset: Dataset) => {
        if (!selectedElement) return;

        try {
            // Fetch dataset details
            const datasetDetail = await datasetService.getDatasetShortDetail(
                dataset.datasetId
            );

            const updatedItem = {
                ...selectedElement,
                dataSourceId: dataset.datasetId?.toString(),
                title: `${chartConfig[selectedElement.type as keyof typeof chartConfig]?.name || "Chart"} - ${dataset.datasetName}`,
                chartOptions: {
                    ...selectedElement.chartOptions,
                    categoryField: undefined,
                    valueField: undefined,
                    seriesField: undefined,
                },
            };

            setDashboardItems((prev) =>
                prev.map((item) =>
                    item.id === selectedElement.id ? updatedItem : item
                )
            );
            setSelectedElement(updatedItem);
            setSelectedDataset(dataset);
            setSelectedDataSource(dataset.datasetId?.toString());

            // Set preview data
            if (datasetDetail.data?.items) {
                setPreviewData(datasetDetail.data.items);
            }

            customToast.success("Dataset selected successfully");
        } catch (error) {
            console.error("Error fetching dataset details:", error);
            customToast.error("Failed to load dataset details");
        }
    };

    // Update the field selection handler
    const handleFieldSelect = (
        fieldType: "category" | "value" | "series",
        fieldName: string,
        options?: {
            aggregation?: "sum" | "avg" | "count" | "min" | "max";
            timeInterval?: "day" | "week" | "month" | "quarter" | "year";
        }
    ) => {
        if (!selectedElement) return;

        const updatedElement = {
            ...selectedElement,
            chartOptions: {
                ...selectedElement.chartOptions,
                [fieldType === "category" ? "categoryField" : fieldType === "value" ? "valueField" : "seriesField"]: fieldName,
                ...(options?.aggregation && { aggregation: options.aggregation }),
                ...(options?.timeInterval && { timeInterval: options.timeInterval }),
            },
        };

        setSelectedElement(updatedElement);
        setDashboardItems((prev) =>
            prev.map((item) =>
                item.id === selectedElement.id ? updatedElement : item
            )
        );
    };

    const handleAggregationChange = (newAggregation: string) => {
        if (!selectedElement) return;

        const updatedElement = {
            ...selectedElement,
            chartOptions: {
                ...selectedElement.chartOptions,
                aggregation: newAggregation as "sum" | "avg" | "count" | "min" | "max",
            },
        };

        setSelectedElement(updatedElement);
        setDashboardItems((prev) =>
            prev.map((item) =>
                item.id === selectedElement.id ? updatedElement : item
            )
        );
    };

    const handleApply = async () => {
        if (!selectedElement) return;

        try {
            console.log("Calling API with params:", {
                datasetId: selectedDataset.datasetId,
                categoryField: selectedElement.chartOptions.categoryField,
                valueField: selectedElement.chartOptions.valueField,
                seriesField: selectedElement.chartOptions.seriesField,
                aggregation: selectedElement.chartOptions.aggregation || "sum",
                timeInterval: selectedElement.chartOptions.timeInterval,
            });

            const response = await datasetService.aggregateDataset(
                selectedDataset.datasetId,
                {
                    categoryField: selectedElement.chartOptions.categoryField,
                    valueField: selectedElement.chartOptions.valueField,
                    seriesField: selectedElement.chartOptions.seriesField,
                    aggregation: selectedElement.chartOptions.aggregation || "sum",
                    timeInterval: selectedElement.chartOptions.timeInterval,
                }
            );

            console.log("API Response:", response);

            // Update chart options with new data
            const updatedOptions = {
                ...selectedElement?.chartOptions,
                data: {
                    categories: response.categories,
                    values: response.values,
                    series: response.series || [],
                },
            };
            console.log("Updated chart options:", updatedOptions);

            // Update selected element with new data
            if (selectedElement) {
                const updatedItem = {
                    ...selectedElement,
                    chartOptions: updatedOptions,
                };
                console.log("Updated item:", updatedItem);

                setDashboardItems((prev) =>
                    prev.map((item) =>
                        item.id === selectedElement.id ? updatedItem : item
                    )
                );
                setSelectedElement(updatedItem);
            }

            customToast.success("Chart data updated successfully");
        } catch (error) {
            console.error("Error fetching aggregated data:", error);
            customToast.error("Failed to update chart data");
        }
    };

    // Remove a dashboard item
    const handleRemoveItem = (id: string) => {
        setDashboardItems((prev) => prev.filter((item) => item.id !== id));
        if (selectedElement && selectedElement.id === id) {
            setSelectedElement(null);
        }
        customToast.success("Item removed from dashboard");
    };

    // Handle imported data
    const handleDataImported = (newDataset: Dataset) => {
        // Add icon based on type
        let icon = FileText;
        if (newDataset.type === "json") icon = FileText;
        else if (newDataset.type === "csv") icon = FileSpreadsheet;
        else if (newDataset.type === "api") icon = FileChartLine;

        const datasetWithIcon = {
            ...newDataset,
            icon,
        };

        setDatasets((prev) => [...prev, datasetWithIcon]);
        setSelectedDataSource(newDataset.id);
        setPreviewData(newDataset.previewData || []);
        customToast.success("New data has been added");
    };

    // Update chart properties
    const updateChartProperties = (values: any) => {
        if (!selectedElement) return;

        const updatedItem = {
            ...selectedElement,
            chartOptions: {
                ...selectedElement.chartOptions,
                ...values,
            },
        };

        setDashboardItems((prev) =>
            prev.map((item) =>
                item.id === selectedElement.id ? updatedItem : item
            )
        );
        setSelectedElement(updatedItem);
    };

    // Handle color palette change
    const handleColorPaletteChange = (paletteName: string) => {
        if (selectedElement) {
            const palette = colorPalettes[paletteName as keyof typeof colorPalettes];
            let updatedChartOptions = { ...selectedElement.chartOptions };

            // Gán màu mới từ palette vào chartOptions
            if (selectedElement.type === "bar") {
                updatedChartOptions.barColor = palette.barColors[0];
            }
            if (selectedElement.type === "line") {
                updatedChartOptions.lineColor = palette.lineColors[0];
            }
            updatedChartOptions.backgroundColor = palette.backgroundColor;

            if (selectedElement.type === "pie") {
                updatedChartOptions.pieColors = palette.pieColors;
            }

            const updatedItem = {
                ...selectedElement,
                chartOptions: updatedChartOptions,
            };

            setDashboardItems((prev) =>
                prev.map((item) =>
                    item.id === selectedElement.id ? updatedItem : item
                )
            );
            setSelectedElement(updatedItem);
            setSelectedColorPalette(paletteName);
        }
    };

    // Handle save of dashboard
    const handleSaveDashboard = async () => {
        try {
            const dashboardData = {
                title: dashboardTitle,
                items: dashboardItems.map((item) => ({
                    id: item.id ? parseInt(item.id) : null,
                    type: item.type,
                    x: item.x || 0,
                    y: item.y || 0,
                    width: item.width || 400,
                    height: item.height || 300,
                    title: item.title || "Untitled Chart",
                    dataSourceId: item.dataSourceId || null,
                    chartOptions: JSON.stringify({
                        ...item.chartOptions
                    }),
                }))
            };

            if (isNewDashboard) {
                const response = await dashboardService.createDashboard(dashboardData);
                customToast.success("Dashboard created successfully!");
                setInitialState({
                    title: dashboardTitle,
                    items: dashboardItems
                });
                navigate(`/dashboard/edit/${response.dashboardId}`);
            } else {
                await dashboardService.updateDashboard({
                    id: parseInt(id),
                    ...dashboardData,
                });
                customToast.success("Dashboard updated successfully");
                setInitialState({
                    title: dashboardTitle,
                    items: dashboardItems
                });
            }
            setHasChanges(false);
        } catch (error) {
            console.error("Error saving dashboard:", error);
            customToast.error("Failed to save dashboard");
        }
    };

    // Preview the dashboard
    const handlePreviewDashboard = () => {
        if (id && id !== "new") {
            navigate(`/dashboard/${id}`);
        } else {
            customToast.info("Please save the dashboard first before previewing");
        }
    };

    // Render the appropriate chart based on type and data
    const renderChart = (item: DashboardItem) => {
        console.log("Rendering chart for item:", item);

        // Create chart data in the same format as the test chart
        const chartData = item.chartOptions?.data
            ? item.chartOptions.data.categories.map((category, index) => ({
                name: category,
                value: item.chartOptions.data.values[index],
            }))
            : [];

        console.log("Chart Data Structure:", {
            itemChartOptions: item.chartOptions,
            transformedChartData: chartData,
        });

        if (chartData.length === 0) {
            return (
                <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No data available</p>
                </div>
            );
        }

        switch (item.type) {
            case "bar":
                return (
                    <div style={{ width: "100%", height: "100%" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={chartData}>
                                {(item.chartOptions?.showGrid ?? true) && (
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke={item.chartOptions?.barColor || "#0078D4"}
                                    />
                                )}
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                {(item.chartOptions?.showLegend ?? true) && (
                                    <Legend
                                        verticalAlign="top"
                                        height={36}
                                        formatter={(value) => (
                                            <span style={{ color: "#666" }}>
                                                {value}
                                            </span>
                                        )}
                                    />
                                )}
                                <Bar
                                    dataKey="value"
                                    fill={item.chartOptions?.barColor || "#0078D4"}
                                    name={
                                        item.chartOptions?.valueField || "Value"
                                    }
                                />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </div>
                );

            case "line":
                return (
                    <div style={{ width: "100%", height: "100%" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsLineChart data={chartData}>
                                {(item.chartOptions?.showGrid ?? true) && (
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke={item.chartOptions?.barColor || "#0078D4"}
                                    />
                                )}
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                {(item.chartOptions?.showLegend ?? true) && (
                                    <Legend
                                        verticalAlign="top"
                                        height={36}
                                        formatter={(value) => (
                                            <span style={{ color: "#666" }}>
                                                {value}
                                            </span>
                                        )}
                                    />
                                )}
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={item.chartOptions?.lineColor || "#0078D4"}
                                    strokeWidth={2}
                                    dot={true}
                                    name={
                                        item.chartOptions?.valueField || "Value"
                                    }
                                />
                            </RechartsLineChart>
                        </ResponsiveContainer>
                    </div>
                );

            case "pie":
                return (
                    <div style={{ width: "100%", height: "100%" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={item.chartOptions?.innerRadius || 0}
                                    outerRadius={item.chartOptions?.outerRadius || 80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label
                                >
                                    {chartData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                (item.chartOptions?.pieColors && item.chartOptions.pieColors[index % item.chartOptions.pieColors.length])
                                                || colorPalettes.default.pieColors[index % colorPalettes.default.pieColors.length]
                                            }
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                {(item.chartOptions?.showLegend ?? true) && (
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        formatter={(value) => (
                                            <span style={{ color: "#666" }}>
                                                {value}
                                            </span>
                                        )}
                                    />
                                )}
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    </div>
                );

            default:
                return (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">
                            Unsupported chart type
                        </p>
                    </div>
                );
        }
    };

    // Fetch datasets when a chart is selected
    useEffect(() => {
        const fetchDatasets = async () => {
            if (isLoadingDatasets || !hasMoreDatasets) return;

            setIsLoadingDatasets(true);
            try {
                const response = await datasetService.getDatasets({
                    page: datasetPage,
                    pageSize: datasetPageSize,
                });
                const formattedDatasets = response.items.map((dataset) => ({
                    datasetId: dataset.id,
                    datasetName: dataset.name,
                    sourceType: dataset.type,
                    sourceName: dataset.sourceName,
                    totalRows: dataset.rows,
                    columns: dataset.columns || [],
                    createdAt: dataset.createdAt,
                    createdBy: dataset.createdBy,
                    status: dataset.status,
                    icon:
                        dataset.type === "csv"
                            ? FileText
                            : dataset.type === "excel"
                                ? FileSpreadsheet
                                : FileChartLine,
                }));

                setDatasets((prev) =>
                    datasetPage === 1
                        ? formattedDatasets
                        : [...prev, ...formattedDatasets]
                );
                setHasMoreDatasets(response.hasNextPage);
                setDatasetPage((prev) => prev + 1);
            } catch (error) {
                customToast.error("Failed to fetch datasets");
                console.error("Error fetching datasets:", error);
            } finally {
                setIsLoadingDatasets(false);
            }
        };

        if (selectedElement) {
            fetchDatasets();
        }
    }, [selectedElement]);

    // Handle scroll for infinite loading
    const handleDatasetScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (
            scrollHeight - scrollTop <= clientHeight * 1.5 &&
            !isLoadingDatasets &&
            hasMoreDatasets
        ) {
            // Trigger fetch when user scrolls near bottom
            const fetchDatasets = async () => {
                setIsLoadingDatasets(true);
                try {
                    const response = await datasetService.getDatasets(
                        datasetPage,
                        datasetPageSize
                    );
                    const formattedDatasets = response.items.map((dataset) => ({
                        datasetId: dataset.datasetId,
                        datasetName: dataset.datasetName,
                        sourceType: dataset.sourceType,
                        sourceName: dataset.sourceName,
                        totalRows: dataset.totalRows,
                        columns: dataset.columns || [],
                        createdAt: dataset.createdAt,
                        createdBy: dataset.createdBy,
                        status: dataset.status,
                        icon:
                            dataset.sourceType === "csv"
                                ? FileText
                                : dataset.sourceType === "excel"
                                    ? FileSpreadsheet
                                    : FileChartLine,
                    }));

                    setDatasets((prev) => [...prev, ...formattedDatasets]);
                    setHasMoreDatasets(response.hasNextPage);
                    setDatasetPage((prev) => prev + 1);
                } catch (error) {
                    customToast.error("Failed to fetch more datasets");
                    console.error("Error fetching more datasets:", error);
                } finally {
                    setIsLoadingDatasets(false);
                }
            };
            fetchDatasets();
        }
    };

    // Load dashboard data and datasets when component mounts
    useEffect(() => {
        const loadDashboardAndDatasets = async () => {
            try {
                // Load datasets first
                const datasetsResponse = await datasetService.getDatasets();
                setDatasets(datasetsResponse.items);
                setHasMoreDatasets(datasetsResponse.hasNextPage);

                // If not new dashboard, load dashboard data
                if (!isNewDashboard && id) {
                    const response = await dashboardService.getDashboard(parseInt(id));
                    setDashboardTitle(response.title);

                    // Parse chartOptions từ JSON string thành object
                    const items = response.items.map(item => ({
                        ...item,
                        chartOptions: item.chartOptions ? JSON.parse(item.chartOptions) : {}
                    }));

                    setDashboardItems(items);
                    // Lưu trạng thái ban đầu
                    setInitialState({
                        title: response.title,
                        items: items
                    });

                    // Load data for each chart
                    for (const item of items) {
                        if (item.dataSourceId) {
                            try {
                                const dataset = datasetsResponse.items.find(d => d.id.toString() === item.dataSourceId);
                                if (dataset) {
                                    const response = await datasetService.aggregateDataset(
                                        dataset.id,
                                        {
                                            categoryField: item.chartOptions.categoryField,
                                            valueField: item.chartOptions.valueField,
                                            seriesField: item.chartOptions.seriesField,
                                            aggregation: item.chartOptions.aggregation || "sum",
                                            timeInterval: item.chartOptions.timeInterval || "month"
                                        }
                                    );

                                    // Update chart data
                                    setDashboardItems(prev => prev.map(chart => {
                                        if (chart.id === item.id) {
                                            return {
                                                ...chart,
                                                chartOptions: {
                                                    ...chart.chartOptions,
                                                    data: {
                                                        categories: response.categories,
                                                        values: response.values,
                                                        series: response.series
                                                    }
                                                }
                                            };
                                        }
                                        return chart;
                                    }));
                                }
                            } catch (error) {
                                console.error(`Error loading data for chart ${item.id}:`, error);
                            }
                        }
                    }
                } else {
                    // Nếu là dashboard mới, set initialState là null
                    setInitialState(null);
                }
            } catch (error) {
                console.error("Error loading dashboard:", error);
                customToast.error("Failed to load dashboard");
            }
        };

        loadDashboardAndDatasets();
    }, [id, isNewDashboard]);

    // Kiểm tra sự thay đổi
    useEffect(() => {
        if (isNewDashboard) {
            setHasChanges(dashboardTitle.trim() !== "" && dashboardItems.length > 0);
        } else if (initialState) {
            const hasTitleChanged = dashboardTitle.trim() !== initialState.title.trim();

            const hasItemsChanged = dashboardItems.length !== initialState.items.length ||
                dashboardItems.some((item, index) => {
                    const initialItem = initialState.items[index];
                    if (!initialItem) return true;

                    // So sánh các thuộc tính cơ bản
                    const basicPropsChanged =
                        item.type !== initialItem.type ||
                        item.x !== initialItem.x ||
                        item.y !== initialItem.y ||
                        item.width !== initialItem.width ||
                        item.height !== initialItem.height ||
                        item.title !== initialItem.title ||
                        item.dataSourceId !== initialItem.dataSourceId ||
                        item.chartOptions.backgroundColor !== initialItem.chartOptions.backgroundColor ||
                        item.chartOptions.borderColor !== initialItem.chartOptions.borderColor;

                    if (basicPropsChanged) return true;

                    // So sánh chartOptions
                    if (!item.chartOptions && !initialItem.chartOptions) return false;
                    if (!item.chartOptions || !initialItem.chartOptions) return true;

                    // So sánh từng thuộc tính của chartOptions
                    const chartOptionsChanged =
                        item.chartOptions.showGrid !== initialItem.chartOptions.showGrid ||
                        item.chartOptions.showLegend !== initialItem.chartOptions.showLegend ||
                        item.chartOptions.barColor !== initialItem.chartOptions.barColor ||
                        item.chartOptions.lineColor !== initialItem.chartOptions.lineColor ||
                        item.chartOptions.showDots !== initialItem.chartOptions.showDots ||
                        item.chartOptions.innerRadius !== initialItem.chartOptions.innerRadius ||
                        item.chartOptions.outerRadius !== initialItem.chartOptions.outerRadius ||
                        item.chartOptions.categoryField !== initialItem.chartOptions.categoryField ||
                        item.chartOptions.valueField !== initialItem.chartOptions.valueField ||
                        item.chartOptions.seriesField !== initialItem.chartOptions.seriesField ||
                        item.chartOptions.aggregation !== initialItem.chartOptions.aggregation ||
                        item.chartOptions.timeInterval !== initialItem.chartOptions.timeInterval;

                    return chartOptionsChanged;
                });

            setHasChanges(hasTitleChanged || hasItemsChanged);
        }
    }, [dashboardTitle, dashboardItems, initialState, isNewDashboard]);

    return (
        <div className="flex h-[calc(100vh-8rem)] overflow-hidden border rounded-lg">
            <ResizablePanelGroup direction="horizontal">
                {/* Left Sidebar - Chart Types & Data Sources */}
                <ResizablePanel defaultSize={20} minSize={15}>
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b">
                            <h3 className="font-medium">Dashboard Elements</h3>
                        </div>

                        <Tabs
                            value={currentTab}
                            onValueChange={(value) =>
                                setCurrentTab(value as "charts" | "data")
                            }
                            className="flex-1 flex flex-col overflow-hidden"
                        >
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="charts">Charts</TabsTrigger>
                                <TabsTrigger value="data">Data</TabsTrigger>
                            </TabsList>

                            {/* Charts Tab Content with ScrollArea */}
                            <TabsContent
                                value="charts"
                                className="flex-1 overflow-hidden p-0"
                            >
                                <ScrollArea className="h-full">
                                    <div className="p-4 space-y-4">
                                        {chartTypes.map((chartType) => (
                                            <div
                                                key={chartType.id}
                                                className="flex items-center gap-3 p-3 border rounded-md cursor-move hover:bg-muted/50 transition-colors"
                                                draggable
                                                onDragStart={(e) =>
                                                    handleDragStart(
                                                        e,
                                                        chartType.id
                                                    )
                                                }
                                            >
                                                <div className="bg-primary/10 p-2 rounded-md">
                                                    <chartType.icon className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium">
                                                        {chartType.name}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        {chartType.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Color Palette Selection */}
                                    <div className="p-4 border-t">
                                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                                            <Palette className="h-4 w-4" />{" "}
                                            Color Themes
                                        </h4>
                                        <div className="space-y-3">
                                            {Object.entries(colorPalettes).map(
                                                ([name, palette]) => (
                                                    <ThemePreview
                                                        key={name}
                                                        palette={palette}
                                                        isSelected={selectedColorPalette === name}
                                                        onClick={() => handleColorPaletteChange(name)}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </ScrollArea>
                            </TabsContent>

                            {/* Data Tab Content */}
                            <TabsContent
                                value="data"
                                className="flex-1 overflow-hidden p-0"
                            >
                                <ScrollArea
                                    className="h-full"
                                    onScroll={handleDatasetScroll}
                                >
                                    <div className="p-4">
                                        <Button
                                            className="w-full mb-4"
                                            variant="outline"
                                            onClick={() =>
                                                setImportModalOpen(true)
                                            }
                                        >
                                            <Import className="h-4 w-4 mr-2" />{" "}
                                            Import Data
                                        </Button>

                                        {selectedElement ? (
                                            <div className="space-y-4">
                                                {datasets.filter(ds => ds && ds.datasetId).map(dataset => (
                                                    <div
                                                        key={dataset.datasetId}
                                                        className={`flex flex-col gap-3 p-3 border rounded-md transition-colors ${selectedElement.dataSourceId === dataset.id?.toString() ? "bg-muted/50 border-primary" : "hover:bg-muted/50"}`}
                                                        onClick={() => handleDatasetSelect(dataset)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Database className="h-4 w-4" />
                                                                <span className="font-medium">
                                                                    {dataset.datasetName}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {dataset.totalRows} rows
                                                            </div>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {dataset.sourceName}
                                                        </div>
                                                        {selectedElement.dataSourceId === dataset.datasetId?.toString() && (
                                                            <div className="mt-2 border-t pt-2">
                                                                <DataFieldSelector
                                                                    dataset={dataset}
                                                                    selectedElement={selectedElement}
                                                                    onFieldSelect={handleFieldSelect}
                                                                    onAggregationChange={handleAggregationChange}
                                                                    onApply={handleApply}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {isLoadingDatasets && (
                                                    <div className="flex justify-center py-4">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center text-muted-foreground">
                                                Select a chart to choose a dataset
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </TabsContent>
                        </Tabs>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Center - Dashboard Canvas */}
                <ResizablePanel defaultSize={50}>
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b flex items-center justify-between">
                            <div>
                                <Input
                                    className="font-medium text-lg border-none px-0 py-0 h-auto focus-visible:ring-0"
                                    value={dashboardTitle}
                                    onChange={(e) =>
                                        setDashboardTitle(e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSaveDashboard}
                                    disabled={!hasChanges}
                                >
                                    <Save className="h-4 w-4 mr-2" /> Save
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePreviewDashboard}
                                >
                                    <Eye className="h-4 w-4 mr-2" /> Preview
                                </Button>
                            </div>
                        </div>

                        {/* Dashboard Canvas with Scroll */}
                        <div className="flex-1 overflow-auto p-6 bg-muted/20 h-[calc(100%-4rem)]">
                            <div
                                ref={canvasRef}
                                className="relative bg-background border border-dashed rounded-lg transition-colors"
                                style={{
                                    backgroundColor: dashboardBackground,
                                    width: `${canvasSize.width}px`,
                                    height: `${canvasSize.height}px`,
                                    minWidth: "100%",
                                    minHeight: "100%",
                                }}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                {/* Render dashboard items */}
                                {dashboardItems.map((item) => (
                                    <DraggableChartItem
                                        key={item.id}
                                        item={item}
                                        isSelected={
                                            selectedElement?.id === item.id
                                        }
                                        onClick={() => handleItemClick(item)}
                                        onRemove={handleRemoveItem}
                                        onResize={handleChartResize}
                                        onDragStart={startMovingItem}
                                        renderChart={renderChart}
                                    />
                                ))}

                                {/* Empty state */}
                                {dashboardItems.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center p-8">
                                            <div className="bg-background/80 p-6 rounded-lg border shadow-sm">
                                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/60 flex items-center justify-center">
                                                    <ChartPie className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                                <h3 className="text-lg font-medium mb-1">
                                                    Your dashboard is empty
                                                </h3>
                                                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                                                    Drag and drop charts,
                                                    tables, and KPI cards from
                                                    the sidebar to create your
                                                    dashboard layout.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right Sidebar - Properties */}
                <ResizablePanel defaultSize={30} minSize={20}>
                    <div className="h-full flex flex-col overflow-hidden">
                        <div className="p-4 border-b">
                            <h3 className="font-medium">Properties</h3>
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="p-4">
                                {selectedElement ? (
                                    <Form {...form}>
                                        <form
                                            className="space-y-4"
                                            onSubmit={form.handleSubmit(
                                                updateChartProperties
                                            )}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="title"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Title
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Chart title"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            {selectedElement.type === "bar" && (
                                                <>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <Label className="text-sm font-medium">Bar Colors</Label>
                                                            <div className="mt-2 space-y-2">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex-1">
                                                                        <Label className="text-xs text-muted-foreground">Primary Color</Label>
                                                                        <div className="flex items-center gap-2 mt-1">
                                                                            <div
                                                                                className="w-6 h-6 rounded-full border-2 border-border cursor-pointer"
                                                                                style={{
                                                                                    backgroundColor: selectedElement.chartOptions?.barColor || "#0078D4",
                                                                                }}
                                                                                onClick={() => {
                                                                                    const input = document.createElement('input');
                                                                                    input.type = 'color';
                                                                                    input.value = selectedElement.chartOptions?.barColor || "#0078D4";
                                                                                    input.onchange = (e) => {
                                                                                        const color = (e.target as HTMLInputElement).value;
                                                                                        updateChartProperties({
                                                                                            ...form.getValues(),
                                                                                            barColor: color
                                                                                        });
                                                                                    };
                                                                                    input.click();
                                                                                }}
                                                                            />
                                                                            <Input
                                                                                value={selectedElement.chartOptions?.barColor || "#0078D4"}
                                                                                onChange={(e) => updateChartProperties({
                                                                                    ...form.getValues(),
                                                                                    barColor: e.target.value
                                                                                })}
                                                                                className="flex-1 text-xs"
                                                                                placeholder="#0078D4"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Color Palette Quick Select */}
                                                                <div>
                                                                    <Label className="text-xs text-muted-foreground">Quick Colors</Label>
                                                                    <div className="flex gap-1 mt-1">
                                                                        {colorPalettes[selectedColorPalette as keyof typeof colorPalettes].barColors.slice(0, 5).map((color, index) => (
                                                                            <button
                                                                                key={index}
                                                                                className="w-6 h-6 rounded-full border-2 border-border hover:border-primary transition-colors"
                                                                                style={{ backgroundColor: color }}
                                                                                onClick={() => updateChartProperties({
                                                                                    ...form.getValues(),
                                                                                    barColor: color
                                                                                })}
                                                                                title={color}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {selectedElement.type === "line" && (
                                                <>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <Label className="text-sm font-medium">Line Colors</Label>
                                                            <div className="mt-2 space-y-2">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex-1">
                                                                        <Label className="text-xs text-muted-foreground">Primary Color</Label>
                                                                        <div className="flex items-center gap-2 mt-1">
                                                                            <div
                                                                                className="w-6 h-6 rounded-full border-2 border-border cursor-pointer"
                                                                                style={{
                                                                                    backgroundColor: selectedElement.chartOptions?.lineColor || "#0078D4",
                                                                                }}
                                                                                onClick={() => {
                                                                                    const input = document.createElement('input');
                                                                                    input.type = 'color';
                                                                                    input.value = selectedElement.chartOptions?.lineColor || "#0078D4";
                                                                                    input.onchange = (e) => {
                                                                                        const color = (e.target as HTMLInputElement).value;
                                                                                        updateChartProperties({
                                                                                            ...form.getValues(),
                                                                                            lineColor: color
                                                                                        });
                                                                                    };
                                                                                    input.click();
                                                                                }}
                                                                            />
                                                                            <Input
                                                                                value={selectedElement.chartOptions?.lineColor || "#0078D4"}
                                                                                onChange={(e) => updateChartProperties({
                                                                                    ...form.getValues(),
                                                                                    lineColor: e.target.value
                                                                                })}
                                                                                className="flex-1 text-xs"
                                                                                placeholder="#0078D4"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Color Palette Quick Select */}
                                                                <div>
                                                                    <Label className="text-xs text-muted-foreground">Quick Colors</Label>
                                                                    <div className="flex gap-1 mt-1">
                                                                        {colorPalettes[selectedColorPalette as keyof typeof colorPalettes].lineColors.slice(0, 5).map((color, index) => (
                                                                            <button
                                                                                key={index}
                                                                                className="w-6 h-6 rounded-full border-2 border-border hover:border-primary transition-colors"
                                                                                style={{ backgroundColor: color }}
                                                                                onClick={() => updateChartProperties({
                                                                                    ...form.getValues(),
                                                                                    lineColor: color
                                                                                })}
                                                                                title={color}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {selectedElement.type === "pie" && (
                                                <>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <Label className="text-sm font-medium">Pie Colors</Label>
                                                            <div className="mt-2">
                                                                <Label className="text-xs text-muted-foreground">Color Palette</Label>
                                                                <div className="grid grid-cols-7 gap-1 mt-1">
                                                                    {colorPalettes[selectedColorPalette as keyof typeof colorPalettes].pieColors.map((color, index) => (
                                                                        <div
                                                                            key={index}
                                                                            className="w-6 h-6 rounded-full border border-white shadow-sm"
                                                                            style={{ backgroundColor: color }}
                                                                            title={color}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <FormField
                                                            control={form.control}
                                                            name="innerRadius"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <div className="flex justify-between items-center">
                                                                        <FormLabel>Inner Radius</FormLabel>
                                                                        <span className="text-sm text-muted-foreground">
                                                                            {field.value}
                                                                        </span>
                                                                    </div>
                                                                    <FormControl>
                                                                        <Slider
                                                                            min={0}
                                                                            max={80}
                                                                            step={5}
                                                                            defaultValue={[field.value]}
                                                                            onValueChange={(value) =>
                                                                                field.onChange(value[0])
                                                                            }
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            <FormField
                                                control={form.control}
                                                name="showLegend"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                                        <div>
                                                            <FormLabel>
                                                                Show Legend
                                                            </FormLabel>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={
                                                                    field.value
                                                                }
                                                                onCheckedChange={
                                                                    field.onChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="showGrid"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                                        <div>
                                                            <FormLabel>
                                                                Show Grid
                                                            </FormLabel>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={
                                                                    field.value
                                                                }
                                                                onCheckedChange={
                                                                    field.onChange
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="pt-2 border-t">
                                                <h4 className="text-sm font-medium mb-3">
                                                    Appearance
                                                </h4>

                                                <div className="space-y-4">
                                                    {/* Background Color */}
                                                    <ColorPicker
                                                        value={selectedElement.chartOptions.backgroundColor || "#ffffff"}
                                                        onChange={(color) => updateChartProperties({
                                                            ...form.getValues(),
                                                            backgroundColor: color
                                                        })}
                                                        label="Background Color"
                                                        placeholder="#ffffff"
                                                        presetColors={["#ffffff", "#f8f9fa", "#f1f3f4", "#e8eaed", "#202124", "#f5f5f5", "#fafafa"]}
                                                    />

                                                    {/* Border Color */}
                                                    <ColorPicker
                                                        value={selectedElement.chartOptions.borderColor || "#e5e7eb"}
                                                        onChange={(color) => updateChartProperties({
                                                            ...form.getValues(),
                                                            borderColor: color
                                                        })}
                                                        label="Border Color"
                                                        placeholder="#e5e7eb"
                                                        presetColors={["#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#374151", "#f3f4f6", "#e5e7eb"]}
                                                    />

                                                    {/* Border Style Preview */}
                                                    <div>
                                                        <Label className="text-sm font-medium">Preview</Label>
                                                        <div className="mt-2 p-4 rounded-lg border-2 shadow-sm"
                                                            style={{
                                                                backgroundColor: selectedElement.chartOptions.backgroundColor || "#ffffff",
                                                                borderColor: selectedElement.chartOptions.borderColor || "#e5e7eb",
                                                            }}>
                                                            <div className="text-center text-sm text-muted-foreground">
                                                                Chart Style Preview
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full"
                                            >
                                                Apply Changes
                                            </Button>
                                        </form>
                                    </Form>
                                ) : (
                                    <div className="text-center p-8">
                                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                                            <Settings className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-base font-medium mb-1">
                                            No item selected
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Select a chart or visualization to
                                            view and edit its properties
                                        </p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>

            {/* Import Data Modal */}
            <ImportDataModal
                open={importModalOpen}
                onOpenChange={() => setImportModalOpen(false)}
                onDataImported={handleDataImported}
            />
        </div>
    );
};

export default DashboardEditor;
