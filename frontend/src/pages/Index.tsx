import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { Dashboard } from "@/components/Dashboard";
import { SalesRecord } from "@/types/sales";
import { parseCSV } from "@/utils/csvParser";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Index = () => {
  const [data, setData] = useState<SalesRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useAPI, setUseAPI] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (useAPI) {
          // Tentar carregar da API
          const response = await fetch(`${API_URL}/sales?limit=10000`);
          if (response.ok) {
            const result = await response.json();
            setData(result.data);
            console.log('✅ Dados carregados da API');
          } else {
            throw new Error('API não disponível');
          }
        } else {
          // Fallback: carregar CSV local
          const response = await fetch('/vendas_ficticias_10000_linhas.csv');
          const text = await response.text();
          const records = parseCSV(text);
          setData(records);
          console.log('✅ Dados carregados do CSV local');
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('Erro ao carregar da API:', errorMsg);
        
        // Verificar se é erro de conexão
        const isConnectionError = error instanceof TypeError && error.message.includes('fetch');
        if (isConnectionError) {
          setApiError(
            `O sistema está temporariamente indisponível.\n\n` +
            `Por favor, tente novamente em alguns momentos.`
          );
          console.warn('⚠️ Backend não está respondendo');
        }
        
        // Fallback para CSV
        try {
          const response = await fetch('/vendas_ficticias_10000_linhas.csv');
          const text = await response.text();
          const records = parseCSV(text);
          setData(records);
          setUseAPI(false);
        } catch (csvError) {
          console.error('Erro ao carregar dados:', csvError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [useAPI]);

  const handleDataLoaded = (records: SalesRecord[]) => {
    setData(records);
  };

  const handleReset = () => {
    setData([]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground mb-8 text-lg">Carregando...</p>
            {apiError && (
              <div className="mt-8 p-8 bg-amber-50 border-2 border-amber-300 rounded-xl text-center">
                <p className="text-amber-900 font-semibold text-lg mb-4">⚠️ Sistema Indisponível</p>
                <p className="text-amber-800 text-base leading-relaxed">
                  {apiError}
                </p>
              </div>
            )}
          </div>
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
