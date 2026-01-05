import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { Dashboard } from "@/components/Dashboard";
import { SalesRecord } from "@/types/sales";

const Index = () => {
  const [data, setData] = useState<SalesRecord[]>([]);

  const handleDataLoaded = (records: SalesRecord[]) => {
    setData(records);
  };

  const handleReset = () => {
    setData([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {data.length === 0 ? (
        <FileUpload onDataLoaded={handleDataLoaded} />
      ) : (
        <Dashboard data={data} onReset={handleReset} />
      )}
    </div>
  );
};

export default Index;
