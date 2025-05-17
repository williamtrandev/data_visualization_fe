
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, Database, Table } from "lucide-react";
import { toast } from "sonner";

interface ImportDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataImported: (data: any) => void;
}

const ImportDataModal = ({ open, onOpenChange, onDataImported }: ImportDataModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleFileUpload = async () => {
    if (!file) {
      toast.error('Vui lòng chọn file để tải lên');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Demo đọc file
      const text = await file.text();
      let data;
      
      // Phân tích dựa trên loại file
      if (file.name.endsWith('.json')) {
        data = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        data = parseCSV(text);
      } else {
        throw new Error('Định dạng file không được hỗ trợ');
      }
      
      onDataImported({
        id: `imported_${Date.now()}`,
        name: file.name,
        type: file.name.endsWith('.json') ? 'json' : 'csv',
        data: data,
        rows: Array.isArray(data) ? data.length : 1,
        columns: Array.isArray(data) && data.length > 0 ? Object.keys(data[0]).length : 0,
        lastUpdated: new Date().toISOString(),
        createdBy: 'User',
        previewData: Array.isArray(data) ? data.slice(0, 5) : [data],
      });
      
      toast.success('Dữ liệu đã được tải lên thành công!');
      onOpenChange(false);
    } catch (error) {
      console.error('Lỗi khi đọc file:', error);
      toast.error('Có lỗi xảy ra khi xử lý file');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApiImport = async () => {
    if (!urlInput) {
      toast.error('Vui lòng nhập URL API');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Thực hiện gọi API
      const response = await fetch(urlInput);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      onDataImported({
        id: `api_${Date.now()}`,
        name: `API Data ${new Date().toLocaleTimeString()}`,
        type: 'api',
        data: data,
        rows: Array.isArray(data) ? data.length : 1,
        columns: Array.isArray(data) && data.length > 0 ? Object.keys(data[0]).length : 0,
        lastUpdated: new Date().toISOString(),
        createdBy: 'User',
        previewData: Array.isArray(data) ? data.slice(0, 5) : [data],
      });
      
      toast.success('Dữ liệu API đã được nhập thành công!');
      onOpenChange(false);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu API:', error);
      toast.error('Có lỗi xảy ra khi lấy dữ liệu từ API');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Hàm phân tích CSV đơn giản
  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).filter(line => line.trim() !== '').map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: Record<string, string | number> = {};
      
      headers.forEach((header, i) => {
        const value = values[i] || '';
        // Cố gắng chuyển đổi sang số nếu có thể
        obj[header] = isNaN(Number(value)) ? value : Number(value);
      });
      
      return obj;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nhập dữ liệu</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="file">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="file">
              <FileText className="h-4 w-4 mr-2" />
              Tải file
            </TabsTrigger>
            <TabsTrigger value="api">
              <Database className="h-4 w-4 mr-2" />
              API
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="file" className="space-y-4 py-4">
            <div className="grid gap-4">
              <Label htmlFor="file">Chọn file dữ liệu (JSON, CSV)</Label>
              <Input 
                id="file" 
                type="file" 
                accept=".json,.csv" 
                onChange={handleFileChange}
              />
              {file && (
                <div className="text-sm text-muted-foreground">
                  File đã chọn: {file.name} ({Math.round(file.size / 1024)} KB)
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4 py-4">
            <div className="grid gap-4">
              <Label htmlFor="api-url">URL API</Label>
              <Input 
                id="api-url" 
                type="url" 
                placeholder="https://api.example.com/data" 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          
          <Button 
            onClick={() => {
              if (file) {
                handleFileUpload();
              } else {
                handleApiImport();
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Nhập dữ liệu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDataModal;
