
import React, { useState, useRef, useEffect } from 'react';
import { X, Move, ChevronDown } from 'lucide-react';
import { DashboardItem } from '@/types/dashboard';

interface DraggableChartItemProps {
  item: DashboardItem;
  isSelected: boolean;
  onClick: () => void;
  onRemove: (id: string) => void;
  onResize?: (id: string, width: number, height: number) => void;
  onDragStart?: (e: React.MouseEvent, item: DashboardItem) => void;
  renderChart: (item: DashboardItem) => React.ReactNode;
}

const DraggableChartItem: React.FC<DraggableChartItemProps> = ({ 
  item, 
  isSelected, 
  onClick, 
  onRemove,
  onResize,
  onDragStart,
  renderChart
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Custom background/border colors from item properties or defaults
  const backgroundColor = item.backgroundColor || '#ffffff';
  const borderColor = item.borderColor || '#e5e7eb';
  
  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (chartRef.current) {
      setIsResizing(true);
      setResizeStartPos({ x: e.clientX, y: e.clientY });
      setInitialSize({ 
        width: chartRef.current.offsetWidth, 
        height: chartRef.current.offsetHeight 
      });
      
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
    }
  };
  
  // Handle resize movement
  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - resizeStartPos.x;
    const deltaY = e.clientY - resizeStartPos.y;
    
    const newWidth = Math.max(200, initialSize.width + deltaX);
    const newHeight = Math.max(150, initialSize.height + deltaY);
    
    if (chartRef.current) {
      chartRef.current.style.width = `${newWidth}px`;
      chartRef.current.style.height = `${newHeight}px`;
    }
  };
  
  // Handle resize end
  const handleResizeEnd = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
    
    if (onResize && chartRef.current) {
      onResize(
        item.id, 
        chartRef.current.offsetWidth, 
        chartRef.current.offsetHeight
      );
    }
  };
  
  // Handle drag start for chart movement
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDragStart) {
      onDragStart(e, item);
    }
  };
  
  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing]);

  return (
    <div
      ref={chartRef}
      className={`absolute rounded-lg border shadow-sm overflow-hidden
        ${isSelected ? 'ring-2 ring-dashboard-primary' : ''}`}
      style={{
        left: `${item.x}px`,
        top: `${item.y}px`,
        width: `${item.width}px`,
        height: `${item.height}px`,
        zIndex: isSelected ? 10 : 1,
        backgroundColor: backgroundColor,
        borderColor: borderColor
      }}
      onClick={onClick}
    >
      {/* Item header */}
      <div 
        className="p-2 border-b bg-muted/30 flex justify-between items-center chart-header cursor-move"
        style={{ borderColor: borderColor }}
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-2">
          <Move className="h-3.5 w-3.5 text-muted-foreground" />
          <div className="text-sm font-medium truncate">{item.title}</div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            className="p-1 hover:bg-muted rounded-sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(item.id);
            }}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
      
      {/* Chart content */}
      <div className="p-2 h-[calc(100%-36px)]">
        {renderChart(item)}
      </div>
      
      {/* Resize handle */}
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10"
        onMouseDown={handleResizeStart}
      >
        <svg 
          width="10" 
          height="10" 
          viewBox="0 0 10 10" 
          className="absolute bottom-1 right-1"
        >
          <path 
            d="M0,10 L10,10 L10,0 Z" 
            fill={isSelected ? "#6366f1" : "#9ca3af"} 
          />
        </svg>
      </div>
    </div>
  );
};

export default DraggableChartItem;
