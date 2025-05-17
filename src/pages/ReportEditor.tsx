import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save, Upload } from "lucide-react";

const ReportEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        dataSource: "",
        file: null as File | null,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // TODO: Implement API call
            toast.success(
                `Report ${isEdit ? "updated" : "created"} successfully`
            );
            navigate("/reports");
        } catch (error) {
            toast.error("Failed to save report");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, file });
        }
    };

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/reports")}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">
                    {isEdit ? "Edit Report" : "New Report"}
                </h1>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Report Details</CardTitle>
                        <CardDescription>
                            Enter the details for your new report
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Enter report name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Enter report description"
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dataSource">Data Source</Label>
                            <Select
                                value={formData.dataSource}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        dataSource: value,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select data source" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sales">
                                        Sales Data
                                    </SelectItem>
                                    <SelectItem value="marketing">
                                        Marketing Data
                                    </SelectItem>
                                    <SelectItem value="finance">
                                        Finance Data
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="file">Upload Report File</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    id="file"
                                    type="file"
                                    accept=".pbix,.xlsx,.csv"
                                    onChange={handleFileChange}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <Upload className="h-4 w-4" />
                                    Browse
                                </Button>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/reports")}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                <Save className="mr-2 h-4 w-4" />
                                {isEdit ? "Update" : "Create"} Report
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};

export default ReportEditor;
