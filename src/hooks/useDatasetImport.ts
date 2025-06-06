import { useState } from "react";
import { datasetService } from "../services/datasetService";

interface UseDatasetImportReturn {
    importDataset: (file: File, datasetName: string) => Promise<void>;
    isLoading: boolean;
    error: Error | null;
}

export const useDatasetImport = (): UseDatasetImportReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const importDataset = async (file: File, datasetName: string) => {
        setIsLoading(true);
        setError(null);

        try {
            await datasetService.importDataset({ file, datasetName });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err
                    : new Error("Failed to import dataset")
            );
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        importDataset,
        isLoading,
        error,
    };
};
