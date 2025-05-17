export interface ChartOptions {
    showGrid?: boolean;
    showLegend?: boolean;
    showDots?: boolean;
    barColor?: string;
    lineColor?: string;
    previousYearColor?: string;
    innerRadius?: number;
    outerRadius?: number;
    categoryField?: string;
    valueField?: string;
    seriesField?: string;
    aggregation?: "sum" | "average" | "count" | "min" | "max";
}

export interface DashboardItem {
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    title: string;
    dataSourceId: string | null;
    chartOptions: ChartOptions;
    backgroundColor: string;
    borderColor?: string;
}

export interface Dataset {
    id: string;
    name: string;
    type: string;
    rows: number;
    columns: number;
    columnNames: string[];
    lastUpdated: string;
    createdBy: string;
    icon: any;
    previewData: any[];
}

export interface ChartColors {
    barColors: string[];
    lineColors: string[];
    pieColors: string[];
    backgroundColor: string;
    textColor: string;
    gridColor: string;
}
