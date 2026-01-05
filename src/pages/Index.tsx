import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { Dashboard } from "@/components/Dashboard";
import { SalesRecord } from "@/types/sales";
import { parseCSV } from "@/utils/csvParser";

const Index = () => {
  const [data, setData] = useState<SalesRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar automaticamente o arquivo CSV na inicialização
    const loadDefaultData = async () => {
      try {
        const response = await fetch('/vendas_ficticias_10000_linhas.csv');
        const text = await response.text();
        const records = parseCSV(text);
        setData(records);
      } catch (error) {
        console.error('Erro ao carregar dados padrão:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDefaultData();
  }, []);

  const handleDataLoaded = (records: SalesRecord[]) => {
    setData(records);
  };

  const handleReset = () => {
    setData([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

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
