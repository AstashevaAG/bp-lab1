import styles from "./ImportSchedulesModal.module.scss";
import Button from "@/ui/Button/Button";
import { useImportSchedules } from "./useImportSchedules";

export interface ImportResults {
  success: boolean;
  results: {
    results: Array<{
      success: boolean;
      record: {
        action: string;
        departureDate: string;
        departureTime: string;
        flightNumber: string;
        departureIataCode: string;
        arrivalIataCode: string;
        aircraftid: string;
        economyPrice: string;
        status: string;
      };
      error?: string;
    }>;
    response: {
      successful: number;
      duplicates: number;
      missing: number;
      errors: number;
    };
  };
}

interface Props {
  onClose: () => void;
  onImport: (results: ImportResults) => void;
}

export default function ImportSchedulesModal({ onClose, onImport }: Props) {
  const {
    selectedFile,
    handleFileChange,
    handleImport,
    isLoading,
    error,
    results,
  } = useImportSchedules(onImport);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Apply Schedule Changes</h2>
        <div className={styles.content}>
          <p>Please select the text file with the changes:</p>
          <input type="file" onChange={handleFileChange} accept=".txt" />
          <Button
            text="Import changes"
            onClick={handleImport}
            disabled={!selectedFile || isLoading}
          />
          {isLoading && <p>Importing schedules...</p>}
          {error && <p className={styles.error}>{error}</p>}
          {results && results.results && results.results.response && (
            <div className={styles.results}>
              <h3>Results</h3>
              <p>Successful Changes Applied: {results.results.response.successful}</p>
              <p>Duplicate Records Discarded: {results.results.response.duplicates}</p>
              <p>Records with missing fields discarded: {results.results.response.missing}</p>
              <p>Errors: {results.results.response.errors}</p>
            </div>
          )}
        </div>
        <Button text="EXIT" onClick={onClose} className={styles.exitButton} />
      </div>
    </div>
  );
}
