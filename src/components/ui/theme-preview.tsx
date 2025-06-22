import React from "react";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { ColorPalette } from "@/types/dashboard";

interface ThemePreviewProps {
    palette: ColorPalette;
    isSelected?: boolean;
    onClick?: () => void;
    className?: string;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({
    palette,
    isSelected = false,
    onClick,
    className = ""
}) => {
    return (
        <button
            className={`w-full p-4 border rounded-lg transition-all text-left group ${
                isSelected
                    ? "ring-2 ring-primary border-primary bg-primary/5"
                    : "hover:bg-muted/50 border-border"
            } ${className}`}
            onClick={onClick}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-sm capitalize">
                    {palette.name}
                </span>
                {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                )}
            </div>
            
            {/* Color Preview */}
            <div className="space-y-2 mb-3">
                {/* Bar Colors */}
                <div className="flex items-center gap-2">
                    <BarChart className="h-3 w-3 text-muted-foreground" />
                    <div className="flex gap-1 flex-1">
                        {palette.barColors.slice(0, 4).map((color, i) => (
                            <div
                                key={i}
                                className="w-3 h-3 rounded-full border border-white shadow-sm"
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>
                
                {/* Line Colors */}
                <div className="flex items-center gap-2">
                    <LineChart className="h-3 w-3 text-muted-foreground" />
                    <div className="flex gap-1 flex-1">
                        {palette.lineColors.slice(0, 4).map((color, i) => (
                            <div
                                key={i}
                                className="w-3 h-3 rounded-full border border-white shadow-sm"
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>
                
                {/* Pie Colors */}
                <div className="flex items-center gap-2">
                    <PieChart className="h-3 w-3 text-muted-foreground" />
                    <div className="flex gap-1 flex-1">
                        {palette.pieColors.slice(0, 4).map((color, i) => (
                            <div
                                key={i}
                                className="w-3 h-3 rounded-full border border-white shadow-sm"
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Background Preview */}
            <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">Background:</div>
                <div
                    className="w-4 h-4 rounded border border-border"
                    style={{ backgroundColor: palette.backgroundColor }}
                    title={palette.backgroundColor}
                />
            </div>
            
            {/* Description */}
            {palette.description && (
                <p className="text-xs text-muted-foreground mt-2">
                    {palette.description}
                </p>
            )}
        </button>
    );
};

export default ThemePreview;