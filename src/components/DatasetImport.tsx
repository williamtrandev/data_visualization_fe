import { useState } from "react";
import { useDatasetImport } from "../hooks/useDatasetImport";

export const DatasetImport = () => {
    const [datasetName, setDatasetName] = useState("");
    const { importDataset, isLoading, error } = useDatasetImport();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [importSuccess, setImportSuccess] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setImportSuccess(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedFile || !datasetName) return;

        try {
            await importDataset(selectedFile, datasetName);
            setImportSuccess(true);
            // Reset form
            setSelectedFile(null);
            setDatasetName("");
            // Reset file input
            const fileInput = document.querySelector(
                'input[type="file"]'
            ) as HTMLInputElement;
            if (fileInput) fileInput.value = "";
        } catch (err) {
            console.error("Import failed:", err);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Dataset Name
                    </label>
                    <input
                        type="text"
                        value={datasetName}
                        onChange={(e) => setDatasetName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Select File (CSV or Excel)
                    </label>
                    <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileChange}
                        className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-indigo-50 file:text-indigo-700
                            hover:file:bg-indigo-100"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !selectedFile || !datasetName}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                        ${
                            isLoading || !selectedFile || !datasetName
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        }`}
                >
                    {isLoading ? "Importing..." : "Import Dataset"}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">
                        Error: {error.message}
                    </p>
                </div>
            )}

            {importSuccess && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-600">
                        Dataset imported successfully!
                    </p>
                </div>
            )}
        </div>
    );
};
