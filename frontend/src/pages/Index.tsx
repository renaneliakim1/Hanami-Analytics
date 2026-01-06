import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { Dashboard } from "@/components/Dashboard";
import { SalesRecord } from "@/types/sales";
import { parseCSV } from "@/utils/csvParser";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Index = () => {
  const [data, setData] = useState<SalesRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);

  const handleDataLoaded = (records: SalesRecord[], startDate?: string, endDate?: string) => {
    setData(records);
    if (startDate && endDate) {
      setDateRange({ startDate, endDate });
    }
  };

  const handleReset = () => {
    setData([]);
    setDateRange(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {data.length === 0 ? (
        <FileUpload onDataLoaded={handleDataLoaded} />
      ) : (
        <Dashboard data={data} onReset={handleReset} initialDateRange={dateRange} />
      )}
    </div>
  );
};

export default Index;
