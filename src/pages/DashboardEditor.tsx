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
import { DashboardItem, Dataset, ChartColors } from "@/types/dashboard";
import { processDataForChart } from "@/lib/chartDataProcessor";
import DataFieldSelector from "@/components/dashboard/DataFieldSelector";
import { datasetService } from "@/services/datasetService";

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

// Enhanced mock datasets with detailed information
const initialDatasets: Dataset[] = [
    {
        id: "sales-2025",
        name: "Sales Data 2025",
        type: "csv",
        rows: 234,
        columns: 8,
        columnNames: [
            "Date",
            "Region",
            "Product",
            "Sales",
            "Profit",
            "Units",
            "Customer",
            "Channel",
        ],
        lastUpdated: "2025-02-15T08:30:00Z",
        createdBy: "John Smith",
        icon: FileSpreadsheet,
        previewData: [
            {
                Date: "2025-01-01",
                Region: "North",
                Product: "Laptop",
                Sales: 25000,
                Profit: 5000,
                Units: 25,
                Customer: "Tech Corp",
                Channel: "Direct",
            },
            {
                Date: "2025-01-01",
                Region: "North",
                Product: "Phone",
                Sales: 18000,
                Profit: 3600,
                Units: 36,
                Customer: "Mobile Inc",
                Channel: "Online",
            },
            {
                Date: "2025-01-01",
                Region: "South",
                Product: "Laptop",
                Sales: 22000,
                Profit: 4400,
                Units: 22,
                Customer: "Global IT",
                Channel: "Direct",
            },
            {
                Date: "2025-01-01",
                Region: "South",
                Product: "Phone",
                Sales: 15000,
                Profit: 3000,
                Units: 30,
                Customer: "South Tech",
                Channel: "Online",
            },
            {
                Date: "2025-01-15",
                Region: "North",
                Product: "Laptop",
                Sales: 26000,
                Profit: 5200,
                Units: 26,
                Customer: "North Solutions",
                Channel: "Direct",
            },
            {
                Date: "2025-01-15",
                Region: "North",
                Product: "Phone",
                Sales: 20000,
                Profit: 4000,
                Units: 40,
                Customer: "North Mobile",
                Channel: "Online",
            },
            {
                Date: "2025-01-15",
                Region: "South",
                Product: "Laptop",
                Sales: 23000,
                Profit: 4600,
                Units: 23,
                Customer: "South Tech",
                Channel: "Direct",
            },
            {
                Date: "2025-01-15",
                Region: "South",
                Product: "Phone",
                Sales: 17000,
                Profit: 3400,
                Units: 34,
                Customer: "South Mobile",
                Channel: "Online",
            },
            {
                Date: "2025-02-01",
                Region: "North",
                Product: "Laptop",
                Sales: 28000,
                Profit: 5600,
                Units: 28,
                Customer: "North Tech",
                Channel: "Direct",
            },
            {
                Date: "2025-02-01",
                Region: "North",
                Product: "Phone",
                Sales: 22000,
                Profit: 4400,
                Units: 44,
                Customer: "North Mobile",
                Channel: "Online",
            },
            {
                Date: "2025-02-01",
                Region: "South",
                Product: "Laptop",
                Sales: 24000,
                Profit: 4800,
                Units: 24,
                Customer: "South Systems",
                Channel: "Direct",
            },
            {
                Date: "2025-02-01",
                Region: "South",
                Product: "Phone",
                Sales: 19000,
                Profit: 3800,
                Units: 38,
                Customer: "South Mobile",
                Channel: "Online",
            },
            {
                Date: "2025-02-15",
                Region: "North",
                Product: "Laptop",
                Sales: 27000,
                Profit: 5400,
                Units: 27,
                Customer: "North Systems",
                Channel: "Direct",
            },
            {
                Date: "2025-02-15",
                Region: "North",
                Product: "Phone",
                Sales: 21000,
                Profit: 4200,
                Units: 42,
                Customer: "North Mobile",
                Channel: "Online",
            },
            {
                Date: "2025-02-15",
                Region: "South",
                Product: "Laptop",
                Sales: 25000,
                Profit: 5000,
                Units: 25,
                Customer: "South Tech",
                Channel: "Direct",
            },
            {
                Date: "2025-02-15",
                Region: "South",
                Product: "Phone",
                Sales: 20000,
                Profit: 4000,
                Units: 40,
                Customer: "South Mobile",
                Channel: "Online",
            },
        ],
    },
    {
        id: "2",
        name: "Marketing Budget",
        type: "excel",
        rows: 56,
        columns: 12,
        columnNames: [
            "Month",
            "Channel",
            "Campaign",
            "Budget",
            "Spend",
            "ROI",
            "Leads",
            "Conversions",
        ],
        lastUpdated: "2025-05-01",
        createdBy: "Jane Smith",
        icon: FileSpreadsheet,
        previewData: [
            {
                Month: "Jan 2025",
                Channel: "Social Media",
                Budget: 15000,
                Spend: 14750,
                ROI: 2.3,
            },
            {
                Month: "Jan 2025",
                Channel: "Search",
                Budget: 22000,
                Spend: 21800,
                ROI: 3.1,
            },
            {
                Month: "Feb 2025",
                Channel: "Social Media",
                Budget: 15000,
                Spend: 15200,
                ROI: 2.5,
            },
            {
                Month: "Feb 2025",
                Channel: "Search",
                Budget: 22000,
                Spend: 20500,
                ROI: 3.4,
            },
        ],
    },
    {
        id: "3",
        name: "Customer Feedback",
        type: "api",
        rows: 453,
        columns: 15,
        columnNames: [
            "Date",
            "Customer ID",
            "Product",
            "Rating",
            "Sentiment",
            "Comments",
        ],
        lastUpdated: "2025-04-25",
        createdBy: "Alex Wong",
        icon: FileChartLine,
        previewData: [
            {
                Date: "2025-04-01",
                Customer: "10045",
                Product: "Widget A",
                Rating: 4.5,
                Sentiment: "Positive",
            },
            {
                Date: "2025-04-02",
                Customer: "10086",
                Product: "Widget B",
                Rating: 3.2,
                Sentiment: "Neutral",
            },
            {
                Date: "2025-04-03",
                Customer: "10124",
                Product: "Widget C",
                Rating: 2.0,
                Sentiment: "Negative",
            },
            {
                Date: "2025-04-04",
                Customer: "10156",
                Product: "Widget A",
                Rating: 5.0,
                Sentiment: "Positive",
            },
        ],
    },
    {
        id: "4",
        name: "Regional Performance",
        type: "database",
        rows: 189,
        columns: 10,
        columnNames: [
            "Region",
            "Sales",
            "Profit",
            "Growth",
            "Expenses",
            "Employees",
        ],
        lastUpdated: "2025-05-02",
        createdBy: "Sarah Chen",
        icon: FileChartPie,
        previewData: [
            {
                Region: "North America",
                Sales: 1250000,
                Profit: 312500,
                Growth: 12.3,
                Employees: 45,
            },
            {
                Region: "Europe",
                Sales: 980000,
                Profit: 245000,
                Growth: 8.7,
                Employees: 38,
            },
            {
                Region: "Asia Pacific",
                Sales: 1450000,
                Profit: 362500,
                Growth: 15.2,
                Employees: 52,
            },
            {
                Region: "Latin America",
                Sales: 560000,
                Profit: 140000,
                Growth: 9.8,
                Employees: 24,
            },
        ],
    },
];

// Power BI inspired color palettes
const colorPalettes = {
    default: {
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
    },
    modern: {
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
    },
    dark: {
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
    },
    pastel: {
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
    },
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
            data,
            options = {},
            colorPalette = colorPalettes.default
        ) => (
            <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={data}>
                    {options.showGrid && (
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
                    {options.showLegend && <Legend />}
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
            data,
            options = {},
            colorPalette = colorPalettes.default
        ) => (
            <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={data}>
                    {options.showGrid && (
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
                    {options.showLegend && <Legend />}
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
            data,
            options = {},
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
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={
                                    colorPalette.pieColors[
                                        index % colorPalette.pieColors.length
                                    ]
                                }
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    {options.showLegend && <Legend />}
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
    const [selectedElement, setSelectedElement] =
        useState<DashboardItem | null>(null);
    const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([]);
    const [selectedDataSource, setSelectedDataSource] = useState<string | null>(
        null
    );
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [currentTab, setCurrentTab] = useState<"charts" | "data">("charts");
    const [draggedItem, setDraggedItem] = useState<{
        type: string;
        dataSourceId?: string;
    } | null>(null);
    const [selectedColorPalette, setSelectedColorPalette] =
        useState<string>("default");
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
    const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(
        null
    );
    const [chartOptions, setChartOptions] = useState({
        categoryField: "",
        valueField: "",
        seriesField: "",
        aggregation: "sum",
        timeInterval: "month",
    });

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
                    title: `${
                        chartConfig[chartType as keyof typeof chartConfig]
                            ?.name || "Chart"
                    }`,
                    dataSourceId: null,
                    chartOptions: {
                        ...(chartConfig[chartType as keyof typeof chartConfig]
                            ?.defaultOptions || {}),
                        barColor: currentPalette.barColors[0],
                        lineColor: currentPalette.lineColors[0],
                    },
                    backgroundColor: currentPalette.backgroundColor,
                    borderColor: "#e5e7eb",
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
                        title: `${selectedElement.title} - ${
                            datasets.find((ds) => ds.id === dataSourceId)?.name
                        }`,
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
                        (ds) => ds.id === dataSourceId
                    );
                    if (dataset && dataset.previewData) {
                        setPreviewData(dataset.previewData);
                    }

                    customToast.success(`Data source assigned to chart!`);
                } else {
                    // Create a new table visualization with this data
                    const dataset = datasets.find(
                        (ds) => ds.id === dataSourceId
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
                        chartOptions: {},
                        backgroundColor: currentPalette.backgroundColor,
                    };

                    setDashboardItems((prev) => [...prev, newItem]);
                    setSelectedElement(newItem);
                    setSelectedDataSource(dataSourceId);

                    // Set preview data
                    if (dataset && dataset.previewData) {
                        setPreviewData(dataset.previewData);
                    }

                    customToast.success(
                        `Added table with ${dataset?.name} data!`
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
            const dataset = datasets.find((ds) => ds.id === item.dataSourceId);
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
                dataSourceId: dataset.datasetId.toString(),
                title: `${
                    chartConfig[
                        selectedElement.type as keyof typeof chartConfig
                    ]?.name || "Chart"
                } - ${dataset.datasetName}`,
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
            setSelectedDataSource(dataset.datasetId.toString());

            // Set preview data
            if (datasetDetail.previewData) {
                setPreviewData(datasetDetail.previewData);
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

        // Update selected fields
        setSelectedFields((prev) => ({
            ...prev,
            [fieldType]: fieldName,
        }));

        // Update chart options based on selected fields
        const updatedOptions = {
            ...selectedElement.chartOptions,
            [`${fieldType}Field`]: fieldName,
            ...(options?.aggregation && { aggregation: options.aggregation }),
            ...(options?.timeInterval && {
                timeInterval: options.timeInterval,
            }),
        };

        // Update the selected element with new chart options
        const updatedItem = {
            ...selectedElement,
            chartOptions: updatedOptions,
        };

        setDashboardItems((prev) =>
            prev.map((item) =>
                item.id === selectedElement.id ? updatedItem : item
            )
        );
        setSelectedElement(updatedItem);
    };

    const handleApply = async () => {
        if (
            !selectedDataset ||
            !selectedFields.category ||
            !selectedFields.value
        ) {
            console.log("Missing required fields:", {
                selectedDataset,
                selectedFields,
            });
            return;
        }

        try {
            console.log("Calling API with params:", {
                datasetId: selectedDataset.datasetId,
                categoryField: selectedFields.category,
                valueField: selectedFields.value,
                seriesField: selectedFields.series,
                aggregation: chartOptions.aggregation || "sum",
                timeInterval: chartOptions.timeInterval,
            });

            const response = await datasetService.aggregateDataset(
                selectedDataset.datasetId,
                {
                    categoryField: selectedFields.category,
                    valueField: selectedFields.value,
                    seriesField: selectedFields.series,
                    aggregation: chartOptions.aggregation || "sum",
                    timeInterval: chartOptions.timeInterval,
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
            title: values.title || selectedElement.title,
            backgroundColor: values.backgroundColor,
            borderColor: values.borderColor,
            chartOptions: {
                ...selectedElement.chartOptions,
                showLegend: values.showLegend,
                showGrid: values.showGrid,
                barColor: values.barColor,
                lineColor: values.lineColor,
                xAxisLabel: values.xAxisLabel,
                yAxisLabel: values.yAxisLabel,
                innerRadius: values.innerRadius,
                outerRadius: values.outerRadius,
                showDots: values.showDots,
            },
        };

        setDashboardItems((prev) =>
            prev.map((item) =>
                item.id === selectedElement.id ? updatedItem : item
            )
        );
        setSelectedElement(updatedItem);

        customToast.success("Chart properties updated");
    };

    // Handle color palette change
    const handleColorPaletteChange = (paletteName: string) => {
        setSelectedColorPalette(paletteName);
        const palette =
            colorPalettes[paletteName as keyof typeof colorPalettes];

        if (selectedElement) {
            // Update the selected element with new palette colors
            const chartType = selectedElement.type as keyof typeof chartConfig;
            let updatedChartOptions = { ...selectedElement.chartOptions };

            if (chartType === "bar") {
                updatedChartOptions = {
                    ...updatedChartOptions,
                    barColor: palette.barColors[0],
                };
            } else if (chartType === "line") {
                updatedChartOptions = {
                    ...updatedChartOptions,
                    lineColor: palette.lineColors[0],
                };
            }

            const updatedItem = {
                ...selectedElement,
                backgroundColor: palette.backgroundColor,
                chartOptions: updatedChartOptions,
            };

            setDashboardItems((prev) =>
                prev.map((item) =>
                    item.id === selectedElement.id ? updatedItem : item
                )
            );
            setSelectedElement(updatedItem);

            // Update form values
            form.setValue("barColor", palette.barColors[0]);
            form.setValue("lineColor", palette.lineColors[0]);
            form.setValue("backgroundColor", palette.backgroundColor);
        }

        // Apply new background color if selected
        setDashboardBackground(palette.backgroundColor);
    };

    // Handle save of dashboard
    const handleSaveDashboard = () => {
        customToast.success("Dashboard saved successfully!");
    };

    // Preview the dashboard
    const handlePreviewDashboard = () => {
        if (id && id !== "new") {
            navigate(`/dashboard/${id}`);
        } else {
            customToast.info("Save the dashboard first before previewing");
        }
    };

    // Render the appropriate chart based on type and data
    const renderChart = (item: DashboardItem) => {
        console.log("Rendering chart for item:", item);

        // Get current color palette
        const palette =
            colorPalettes[selectedColorPalette as keyof typeof colorPalettes];

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
                                {item.chartOptions?.showGrid && (
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#E1DFDD"
                                    />
                                )}
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                {item.chartOptions?.showLegend && (
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
                                    fill={
                                        item.chartOptions?.barColor || "#0078D4"
                                    }
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
                                {item.chartOptions?.showGrid && (
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#E1DFDD"
                                    />
                                )}
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                {item.chartOptions?.showLegend && (
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
                                    stroke={
                                        item.chartOptions?.lineColor ||
                                        "#107C10"
                                    }
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
                                    innerRadius={0}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label
                                >
                                    {chartData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                palette.pieColors[
                                                    index %
                                                        palette.pieColors.length
                                                ]
                                            }
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                {item.chartOptions?.showLegend && (
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
                                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                            <Palette className="h-4 w-4" />{" "}
                                            Color Theme
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {Object.entries(colorPalettes).map(
                                                ([name, palette]) => (
                                                    <button
                                                        key={name}
                                                        className={`p-2 border rounded-md transition-all ${
                                                            selectedColorPalette ===
                                                            name
                                                                ? "ring-2 ring-primary border-primary"
                                                                : "hover:bg-muted/50"
                                                        }`}
                                                        onClick={() =>
                                                            handleColorPaletteChange(
                                                                name
                                                            )
                                                        }
                                                    >
                                                        <div className="flex gap-1 justify-center mb-1">
                                                            {palette.barColors
                                                                .slice(0, 3)
                                                                .map(
                                                                    (
                                                                        color,
                                                                        i
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="w-3 h-3 rounded-full"
                                                                            style={{
                                                                                backgroundColor:
                                                                                    color,
                                                                            }}
                                                                        />
                                                                    )
                                                                )}
                                                        </div>
                                                        <p className="text-xs capitalize">
                                                            {name}
                                                        </p>
                                                    </button>
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
                                                {datasets.map((dataset) => (
                                                    <div
                                                        key={dataset.datasetId}
                                                        className={`flex flex-col gap-3 p-3 border rounded-md transition-colors ${
                                                            selectedElement.dataSourceId ===
                                                            dataset.datasetId.toString()
                                                                ? "bg-muted/50 border-primary"
                                                                : "hover:bg-muted/50"
                                                        }`}
                                                        onClick={() =>
                                                            handleDatasetSelect(
                                                                dataset
                                                            )
                                                        }
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Database className="h-4 w-4" />
                                                                <span className="font-medium">
                                                                    {
                                                                        dataset.datasetName
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {
                                                                    dataset.totalRows
                                                                }{" "}
                                                                rows
                                                            </div>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {dataset.sourceName}
                                                        </div>

                                                        {selectedElement.dataSourceId ===
                                                            dataset.datasetId.toString() && (
                                                            <div className="mt-2 border-t pt-2">
                                                                <DataFieldSelector
                                                                    dataset={
                                                                        dataset
                                                                    }
                                                                    selectedFields={{
                                                                        category:
                                                                            selectedElement
                                                                                .chartOptions
                                                                                ?.categoryField,
                                                                        value: selectedElement
                                                                            .chartOptions
                                                                            ?.valueField,
                                                                        series: selectedElement
                                                                            .chartOptions
                                                                            ?.seriesField,
                                                                    }}
                                                                    onFieldSelect={
                                                                        handleFieldSelect
                                                                    }
                                                                    onApply={
                                                                        handleApply
                                                                    }
                                                                    chartType={
                                                                        selectedElement.type
                                                                    }
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
                                                Select a chart to choose a
                                                dataset
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
                                                    <FormField
                                                        control={form.control}
                                                        name="barColor"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <div className="flex justify-between">
                                                                    <FormLabel>
                                                                        Bar
                                                                        Color
                                                                    </FormLabel>
                                                                    <div
                                                                        className="w-5 h-5 rounded-full border"
                                                                        style={{
                                                                            backgroundColor:
                                                                                field.value,
                                                                        }}
                                                                    />
                                                                </div>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        type="color"
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </>
                                            )}

                                            {selectedElement.type ===
                                                "line" && (
                                                <>
                                                    <FormField
                                                        control={form.control}
                                                        name="lineColor"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <div className="flex justify-between">
                                                                    <FormLabel>
                                                                        Line
                                                                        Color
                                                                    </FormLabel>
                                                                    <div
                                                                        className="w-5 h-5 rounded-full border"
                                                                        style={{
                                                                            backgroundColor:
                                                                                field.value,
                                                                        }}
                                                                    />
                                                                </div>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        type="color"
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </>
                                            )}

                                            {selectedElement.type === "pie" && (
                                                <>
                                                    <FormField
                                                        control={form.control}
                                                        name="innerRadius"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <div className="flex justify-between items-center">
                                                                    <FormLabel>
                                                                        Inner
                                                                        Radius
                                                                    </FormLabel>
                                                                    <span className="text-sm text-muted-foreground">
                                                                        {
                                                                            field.value
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <FormControl>
                                                                    <Slider
                                                                        min={0}
                                                                        max={80}
                                                                        step={5}
                                                                        defaultValue={[
                                                                            field.value,
                                                                        ]}
                                                                        onValueChange={(
                                                                            value
                                                                        ) =>
                                                                            field.onChange(
                                                                                value[0]
                                                                            )
                                                                        }
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
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

                                                <FormField
                                                    control={form.control}
                                                    name="backgroundColor"
                                                    render={({ field }) => (
                                                        <FormItem className="mb-2">
                                                            <div className="flex justify-between">
                                                                <FormLabel>
                                                                    Background
                                                                </FormLabel>
                                                                <div
                                                                    className="w-5 h-5 rounded-full border"
                                                                    style={{
                                                                        backgroundColor:
                                                                            field.value,
                                                                    }}
                                                                />
                                                            </div>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    type="color"
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="borderColor"
                                                    render={({ field }) => (
                                                        <FormItem className="mb-4">
                                                            <div className="flex justify-between">
                                                                <FormLabel>
                                                                    Border
                                                                </FormLabel>
                                                                <div
                                                                    className="w-5 h-5 rounded-full border"
                                                                    style={{
                                                                        backgroundColor:
                                                                            field.value,
                                                                    }}
                                                                />
                                                            </div>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    type="color"
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
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
                onClose={() => setImportModalOpen(false)}
                onImport={handleDataImported}
            />
        </div>
    );
};

export default DashboardEditor;
