import { useState } from "react";
import { ImportResults } from "./ImportSchedulesModal";
import schedulesService from "@/services/schedules.service";

export const useImportSchedules = (
  onImport: (results: ImportResults) => void
) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ImportResults | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setError(null);
      setResults(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const importResults = await schedulesService.importSchedules(selectedFile);
      setResults(importResults);
      onImport(importResults);
    } catch (err) {
      setError(
        "An error occurred while importing schedules. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedFile,
    handleFileChange,
    handleImport,
    isLoading,
    error,
    results,
  };
};
