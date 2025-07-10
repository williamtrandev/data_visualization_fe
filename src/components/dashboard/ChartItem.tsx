import React from "react";
import { DashboardItem } from "@/types/dashboard";

interface ChartItemProps {
    item: DashboardItem;
    renderChart: (item: DashboardItem) => React.ReactNode;
}

const ChartItem: React.FC<ChartItemProps> = ({ item, renderChart }) => {
    // Custom background/border colors from item properties or defaults
    const backgroundColor = item.backgroundColor || "#ffffff";
    const borderColor = item.borderColor || "#e5e7eb";

    return (
        <div
            className="absolute rounded-lg border shadow-sm overflow-hidden"
            data-chart-id={item.id}
            style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${item.width}px`,
                height: `${item.height}px`,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
            }}
        >
            {/* Item header */}
            <div
                className="p-2 border-b bg-muted/30 flex justify-between items-center"
                style={{ borderColor: borderColor }}
            >
                <div className="flex items-center gap-2">
                    <div className="text-sm font-medium truncate">
                        {item.title}
                    </div>
                </div>
            </div>

            {/* Chart content */}
            <div className="p-2 h-[calc(100%-36px)]">{renderChart(item)}</div>
        </div>
    );
};

export default ChartItem;
