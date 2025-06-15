import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Download, Share, Filter } from 'lucide-react';
import { dashboardService } from '@/services/dashboardService';
import { DashboardItem, ChartOptions } from '@/types/dashboard';
import { datasetService } from '@/services/datasetService';
import ChartItem from '@/components/dashboard/ChartItem';
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
                      item.chartOptions?.pieColors?.[
                        index %
                        (item.chartOptions?.pieColors?.length || 0)
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

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!id) return;

      try {
        const response = await dashboardService.getDashboard(parseInt(id));

        // Parse chartOptions từ JSON string thành object
        const items = response.items.map(item => ({
          ...item,
          chartOptions: item.chartOptions ? JSON.parse(item.chartOptions) : {}
        }));

        // Load data cho từng biểu đồ
        for (const item of items) {
          if (item.dataSourceId) {
            try {
              const response = await datasetService.aggregateDataset(
                parseInt(item.dataSourceId),
                {
                  categoryField: item.chartOptions.categoryField,
                  valueField: item.chartOptions.valueField,
                  seriesField: item.chartOptions.seriesField,
                  aggregation: item.chartOptions.aggregation || "sum",
                  timeInterval: item.chartOptions.timeInterval || "month"
                }
              );

              // Cập nhật chartOptions với dữ liệu mới
              item.chartOptions = {
                ...item.chartOptions,
                data: {
                  categories: response.categories,
                  values: response.values,
                  series: response.series || []
                }
              };
            } catch (error) {
              console.error(`Error loading data for chart ${item.id}:`, error);
            }
          }
        }

        setDashboard({ ...response, items });
      } catch (err) {
        setError('Failed to fetch dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (error || !dashboard) {
    return <div className="flex items-center justify-center h-64 text-red-500">{error || 'Dashboard not found'}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{dashboard.title}</h1>
          <p className="text-muted-foreground">
            Last updated {new Date(dashboard.updatedAt).toLocaleDateString()}
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
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="bg-muted/30 border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <Button variant="outline" size="sm" className="sm:w-auto w-full">
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>

        <div className="relative" style={{ width: '100%', height: '800px' }}>
          {dashboard.items.map((item: DashboardItem) => (
            <ChartItem
              key={item.id}
              item={item}
              renderChart={renderChart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardViewer;
