import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Edit,
    Download,
    Share,
    Filter,
    FileText,
    FileSpreadsheet,
    FileChartLine,
} from "lucide-react";
import { dashboardService } from "@/services/dashboardService";
import { DashboardItem, ChartOptions } from "@/types/dashboard";
import { datasetService } from "@/services/datasetService";
import ChartItem from "@/components/dashboard/ChartItem";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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

const renderChart = (item: DashboardItem) => {
    console.log("Rendering chart for item:", item);

    // Get current color palette
    // const palette =
    //     colorPalettes[selectedColorPalette as keyof typeof colorPalettes];

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
                                    stroke={
                                        item.chartOptions?.barColor || "#E1DFDD"
                                    }
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
                                fill={item.chartOptions?.barColor || "#0078D4"}
                                name={item.chartOptions?.valueField || "Value"}
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
                                    stroke={
                                        item.chartOptions?.lineColor ||
                                        "#E1DFDD"
                                    }
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
                                    item.chartOptions?.lineColor || "#107C10"
                                }
                                strokeWidth={2}
                                dot={true}
                                name={item.chartOptions?.valueField || "Value"}
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
                                innerRadius={
                                    item.chartOptions?.innerRadius || 0
                                }
                                outerRadius={
                                    item.chartOptions?.outerRadius || 80
                                }
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label
                            >
                                {chartData.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            ((item.chartOptions as any)
                                                ?.pieColors &&
                                                (item.chartOptions as any)
                                                    .pieColors[
                                                    index %
                                                        (
                                                            item.chartOptions as any
                                                        ).pieColors.length
                                                ]) ||
                                            colorPalettes.default.pieColors[
                                                index %
                                                    colorPalettes.default
                                                        .pieColors.length
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

const DashboardViewer = () => {
    const { id } = useParams<{ id: string }>();
    const [dashboard, setDashboard] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [exporting, setExporting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboard = async () => {
            if (!id) return;

            try {
                const response = await dashboardService.getDashboard(
                    parseInt(id)
                );

                // Parse chartOptions từ JSON string thành object
                const items = response.items.map((item) => ({
                    ...item,
                    chartOptions: item.chartOptions
                        ? JSON.parse(item.chartOptions)
                        : {},
                }));

                // Load data cho từng biểu đồ
                for (const item of items) {
                    if (item.dataSourceId) {
                        try {
                            const response =
                                await datasetService.aggregateDataset(
                                    parseInt(item.dataSourceId),
                                    {
                                        categoryField:
                                            item.chartOptions.categoryField,
                                        valueField:
                                            item.chartOptions.valueField,
                                        seriesField:
                                            item.chartOptions.seriesField,
                                        aggregation:
                                            item.chartOptions.aggregation ||
                                            "sum",
                                        timeInterval:
                                            item.chartOptions.timeInterval ||
                                            "month",
                                    }
                                );

                            // Cập nhật chartOptions với dữ liệu mới
                            item.chartOptions = {
                                ...item.chartOptions,
                                data: {
                                    categories: response.categories,
                                    values: response.values,
                                    series: response.series || [],
                                },
                            };
                        } catch (error) {
                            console.error(
                                `Error loading data for chart ${item.id}:`,
                                error
                            );
                        }
                    }
                }

                setDashboard({ ...response, items });
            } catch (err) {
                setError("Failed to fetch dashboard");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [id]);

    // Debug log để kiểm tra dashboard items
    useEffect(() => {
        if (dashboard) {
            console.log("Dashboard loaded:", dashboard);
            console.log("Dashboard items:", dashboard.items);
            console.log("Number of items:", dashboard.items?.length || 0);
        }
    }, [dashboard]);

    const debugCharts = () => {
        console.log("=== DEBUG CHARTS ===");
        console.log("Dashboard items:", dashboard?.items);

        const chartContainers = document.querySelectorAll(
            ".absolute.rounded-lg.border.shadow-sm.overflow-hidden"
        );
        console.log("Chart containers found:", chartContainers.length);

        chartContainers.forEach((container, index) => {
            console.log(`Chart ${index + 1}:`, container);
            console.log(`Chart ${index + 1} dimensions:`, {
                width: container.clientWidth,
                height: container.clientHeight,
                offsetWidth: container.offsetWidth,
                offsetHeight: container.offsetHeight,
            });
        });

        const dashboardContainer = document.querySelector(
            ".dashboard-container"
        );
        console.log("Dashboard container:", dashboardContainer);

        toast.info(`Found ${chartContainers.length} charts in DOM`);
    };

    const exportToPDF = async () => {
        setExporting(true);
        try {
            const { jsPDF } = await import("jspdf");
            const html2canvas = await import("html2canvas");

            // Đợi một chút để đảm bảo dashboard render xong
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const dashboardElement = document.querySelector(
                ".dashboard-container"
            );
            if (!dashboardElement) {
                toast.error("Không thể tìm thấy dashboard để export");
                return;
            }

            // Thử capture với options khác
            const canvas = await html2canvas.default(
                dashboardElement as HTMLElement,
                {
                    scale: 1,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: "#ffffff",
                    logging: false,
                    width: dashboardElement.scrollWidth,
                    height: dashboardElement.scrollHeight,
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: dashboardElement.scrollWidth,
                    windowHeight: dashboardElement.scrollHeight,
                }
            );

            // Kiểm tra canvas có data không
            if (!canvas || canvas.width === 0 || canvas.height === 0) {
                toast.error("Không thể capture dashboard");
                return;
            }

            const imgData = canvas.toDataURL("image/png", 0.8);

            // Kiểm tra imgData có hợp lệ không
            if (!imgData || imgData === "data:,") {
                toast.error("Không thể tạo image data");
                return;
            }

            const pdf = new jsPDF("landscape", "mm", "a4");
            const imgWidth = 297;
            const pageHeight = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(
                `${dashboard.title}-${
                    new Date().toISOString().split("T")[0]
                }.pdf`
            );
            toast.success("Dashboard đã được export thành PDF");
        } catch (error) {
            console.error("Export PDF error:", error);
            toast.error("Không thể export PDF. Vui lòng thử lại.");
        } finally {
            setExporting(false);
        }
    };

    const exportToPDFAlternative = async () => {
        setExporting(true);
        try {
            const { jsPDF } = await import("jspdf");
            const html2canvas = await import("html2canvas");

            await new Promise((resolve) => setTimeout(resolve, 1000));

            const pdf = new jsPDF("landscape", "mm", "a4");
            let currentPage = 0;

            // Tìm tất cả chart containers
            const chartContainers = document.querySelectorAll(
                ".absolute.rounded-lg.border.shadow-sm.overflow-hidden"
            );
            console.log("Found chart containers:", chartContainers.length);

            if (chartContainers.length === 0) {
                toast.error("Không tìm thấy chart nào để export");
                return;
            }

            // Export từng chart
            for (let i = 0; i < chartContainers.length; i++) {
                const chartElement = chartContainers[i] as HTMLElement;
                console.log(`Exporting chart ${i + 1}:`, chartElement);

                try {
                    const canvas = await html2canvas.default(chartElement, {
                        scale: 1,
                        useCORS: true,
                        allowTaint: false,
                        backgroundColor: "#ffffff",
                        logging: true,
                        width: chartElement.offsetWidth,
                        height: chartElement.offsetHeight,
                    });

                    console.log(
                        `Chart ${i + 1} canvas:`,
                        canvas.width,
                        "x",
                        canvas.height
                    );

                    if (canvas && canvas.width > 0 && canvas.height > 0) {
                        const imgData = canvas.toDataURL("image/png", 0.8);

                        if (imgData && imgData !== "data:,") {
                            if (currentPage > 0) {
                                pdf.addPage();
                            }

                            const imgWidth = 280;
                            const imgHeight =
                                (canvas.height * imgWidth) / canvas.width;
                            const x = (297 - imgWidth) / 2;
                            const y = (210 - imgHeight) / 2;

                            pdf.addImage(
                                imgData,
                                "PNG",
                                x,
                                y,
                                imgWidth,
                                imgHeight
                            );

                            // Thêm title cho chart
                            pdf.setFontSize(14);
                            const chartTitle =
                                chartElement.querySelector(
                                    ".text-sm.font-medium"
                                )?.textContent || `Chart ${i + 1}`;
                            pdf.text(chartTitle, 148, 15, { align: "center" });

                            currentPage++;
                            console.log(`Chart ${i + 1} exported successfully`);
                        } else {
                            console.error(`Chart ${i + 1}: Invalid image data`);
                        }
                    } else {
                        console.error(`Chart ${i + 1}: Invalid canvas`);
                    }
                } catch (chartError) {
                    console.error(
                        `Error exporting chart ${i + 1}:`,
                        chartError
                    );
                }
            }

            if (currentPage > 0) {
                pdf.save(
                    `${dashboard.title}-charts-${
                        new Date().toISOString().split("T")[0]
                    }.pdf`
                );
                toast.success(`${currentPage} charts đã được export thành PDF`);
            } else {
                toast.error("Không thể export bất kỳ chart nào");
            }
        } catch (error) {
            console.error("Export PDF Alternative error:", error);
            toast.error("Không thể export PDF. Vui lòng thử lại.");
        } finally {
            setExporting(false);
        }
    };

    const exportToPDFSimple = async () => {
        setExporting(true);
        try {
            const { jsPDF } = await import("jspdf");
            const html2canvas = await import("html2canvas");

            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Tìm chart đầu tiên
            const firstChart = document.querySelector(
                ".absolute.rounded-lg.border.shadow-sm.overflow-hidden"
            );
            console.log("First chart found:", firstChart);

            if (!firstChart) {
                toast.error("Không tìm thấy chart nào");
                return;
            }

            const canvas = await html2canvas.default(
                firstChart as HTMLElement,
                {
                    scale: 1,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: "#ffffff",
                    logging: true,
                }
            );

            console.log("Canvas created:", canvas.width, "x", canvas.height);

            const imgData = canvas.toDataURL("image/png", 0.8);
            console.log("Image data length:", imgData.length);

            const pdf = new jsPDF("landscape", "mm", "a4");
            const imgWidth = 280;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const x = (297 - imgWidth) / 2;
            const y = (210 - imgHeight) / 2;

            pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
            pdf.save(
                `test-chart-${new Date().toISOString().split("T")[0]}.pdf`
            );

            toast.success("Test chart exported successfully");
        } catch (error) {
            console.error("Export PDF Simple error:", error);
            toast.error("Không thể export test chart");
        } finally {
            setExporting(false);
        }
    };

    const exportToExcel = async () => {
        setExporting(true);
        try {
            const XLSX = await import("xlsx");

            const workbook = XLSX.utils.book_new();

            // Tạo worksheet cho mỗi chart
            dashboard.items.forEach((item: DashboardItem, index: number) => {
                if (item.chartOptions?.data) {
                    const { categories, values, series } =
                        item.chartOptions.data;

                    let data: any[] = [];

                    if (series && series.length > 0) {
                        // Data có series
                        data = categories.map((cat: string, i: number) => {
                            const row: any = { Category: cat };
                            series.forEach((ser: string) => {
                                const seriesIndex = series.indexOf(ser);
                                row[ser] = values[seriesIndex]?.[i] || 0;
                            });
                            return row;
                        });
                    } else {
                        // Data đơn giản
                        data = categories.map((cat: string, i: number) => ({
                            Category: cat,
                            Value: values[i] || 0,
                        }));
                    }

                    const worksheet = XLSX.utils.json_to_sheet(data);
                    XLSX.utils.book_append_sheet(
                        workbook,
                        worksheet,
                        `Chart_${index + 1}`
                    );
                }
            });

            XLSX.writeFile(
                workbook,
                `${dashboard.title}-${
                    new Date().toISOString().split("T")[0]
                }.xlsx`
            );
            toast.success("Dashboard đã được export thành Excel");
        } catch (error) {
            console.error("Export Excel error:", error);
            toast.error("Không thể export Excel");
        } finally {
            setExporting(false);
        }
    };

    const createReport = () => {
        // Chuyển đến trang tạo report với data từ dashboard
        navigate(`/report/new?fromDashboard=${id}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                Loading...
            </div>
        );
    }

    if (error || !dashboard) {
        return (
            <div className="flex items-center justify-center h-64 text-red-500">
                {error || "Dashboard not found"}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {dashboard.title}
                    </h1>
                    <p className="text-muted-foreground">
                        Last updated{" "}
                        {new Date(dashboard.updatedAt).toLocaleDateString()}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link to={`/dashboard/edit/${id}`}>
                        <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                        <Share className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={exporting}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                {exporting ? "Exporting..." : "Export"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={exportToPDF}
                                disabled={exporting}
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                Export as PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={exportToPDFAlternative}
                                disabled={exporting}
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                Export Charts as PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={exportToPDFSimple}
                                disabled={exporting}
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                Export Test Chart
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={exportToExcel}
                                disabled={exporting}
                            >
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                Export as Excel
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={createReport}>
                                <FileChartLine className="mr-2 h-4 w-4" />
                                Create Report
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="bg-muted/30 border rounded-lg p-4 dashboard-container">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="sm:w-auto w-full"
                    >
                        <Filter className="mr-2 h-4 w-4" /> Filters
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={debugCharts}
                        className="sm:w-auto w-full"
                    >
                        Debug Charts
                    </Button>
                </div>

                <div
                    className="relative"
                    style={{ width: "100%", height: "800px" }}
                >
                    {dashboard.items && dashboard.items.length > 0 ? (
                        dashboard.items.map((item: DashboardItem) => (
                            <ChartItem
                                key={item.id}
                                item={item}
                                renderChart={renderChart}
                            />
                        ))
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-muted-foreground mb-4">
                                    No charts found
                                </p>
                                <Button onClick={debugCharts}>Debug</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardViewer;
