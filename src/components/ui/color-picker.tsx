import React, { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Palette, Check } from "lucide-react";

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
    label?: string;
    placeholder?: string;
    presetColors?: string[];
    className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
    value,
    onChange,
    label,
    placeholder = "#000000",
    presetColors = [
        "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
        "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
        "#F8B195", "#F67280", "#C06C84", "#6C5B7B", "#355C7D",
        "#A8E6CF", "#DCEDC1", "#FFD3B6", "#FFAAA5", "#FF8B94"
    ],
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleColorChange = (color: string) => {
        setInputValue(color);
        onChange(color);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        
        // Validate hex color
        if (/^#[0-9A-F]{6}$/i.test(newValue)) {
            onChange(newValue);
        }
    };

    const handleInputBlur = () => {
        // Reset to valid color if input is invalid
        if (!/^#[0-9A-F]{6}$/i.test(inputValue)) {
            setInputValue(value);
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && <Label className="text-sm font-medium">{label}</Label>}
            
            <div className="flex items-center gap-2">
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-12 h-10 p-0 border-2 border-border hover:border-primary transition-colors"
                            style={{ backgroundColor: value }}
                            onClick={() => setIsOpen(true)}
                        >
                            <div className="w-full h-full rounded-sm" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4" align="start">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Custom Color</Label>
                                <div className="flex items-center gap-2">
                                    <input
                                        ref={inputRef}
                                        type="color"
                                        value={value}
                                        onChange={(e) => handleColorChange(e.target.value)}
                                        className="w-10 h-10 rounded border cursor-pointer"
                                    />
                                    <Input
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        onBlur={handleInputBlur}
                                        placeholder={placeholder}
                                        className="flex-1 text-sm"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Preset Colors</Label>
                                <div className="grid grid-cols-5 gap-2">
                                    {presetColors.map((color) => (
                                        <button
                                            key={color}
                                            className="w-8 h-8 rounded border-2 border-border hover:border-primary transition-colors relative"
                                            style={{ backgroundColor: color }}
                                            onClick={() => handleColorChange(color)}
                                            title={color}
                                        >
                                            {value === color && (
                                                <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-sm" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
                
                <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder={placeholder}
                    className="flex-1 text-sm"
                />
            </div>
        </div>
    );
};

export default ColorPicker; 