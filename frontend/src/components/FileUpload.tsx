import { useCallback, useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Database } from "lucide-react";
import { SalesRecord } from "@/types/sales";
import { ThemeToggle } from "./ThemeToggle";

interface FileUploadProps {
  onDataLoaded: (data: SalesRecord[], startDate?: string, endDate?: string) => void;
  onError?: (error: string) => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const parseDate = (dateStr: string): Date | null => {
  if (!dateStr || typeof dateStr !== 'string') return null;

  // Remover espaços
  dateStr = dateStr.trim();

  // Tentar formato DD/MM/YYYY
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      
      if (day > 0 && day <= 31 && month > 0 && month <= 12 && year > 1900 && year < 2100) {
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    }
  }

  // Tentar formato YYYY-MM-DD
  if (dateStr.includes('-') && !dateStr.includes('T')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      
      if (day > 0 && day <= 31 && month > 0 && month <= 12 && year > 1900 && year < 2100) {
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    }
  }

  // Tentar usar Date.parse como último recurso
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date;
  }

  return null;
};

const getDateRange = (records: SalesRecord[]): { startDate: string; endDate: string } | null => {
  if (records.length === 0) return null;

  const dates = records
    .map(r => {
      const dateStr = r.data_venda || r.data_compra || r.data_transacao || '';
      return parseDate(dateStr);
    })
    .filter((d): d is Date => d !== null);

  if (dates.length === 0) {
    console.warn('⚠️ Nenhuma data válida encontrada nos registros');
    return null;
  }

  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const result = {
    startDate: formatDate(minDate),
    endDate: formatDate(maxDate),
  };

  console.log('📅 Data range detectado:', result, `(${dates.length} datas válidas de ${records.length} registros)`);
  return result;
};

export const FileUpload = ({ onDataLoaded, onError }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const isValid = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!isValid) {
      const errorMsg = 'Por favor, selecione um arquivo CSV, XLSX ou XLS';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setIsLoading(true);
    setFileName(file.name);
    setError(null);

    try {
      // Enviar arquivo para o backend
      const formData = new FormData();
      formData.append('file', file);

      let response: Response;
      try {
        response = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData,
        });
      } catch (fetchError) {
        throw new Error(
          `O sistema está temporariamente indisponível. Por favor, tente novamente em alguns momentos.`
        );
      }

      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.detail || `Erro ao processar arquivo`);
        } catch {
          throw new Error(
            `Erro ao processar o arquivo. Por favor, tente novamente.`
          );
        }
      }

      const uploadResult = await response.json();
      console.log('✅ Arquivo enviado com sucesso:', uploadResult);

      // Carregar dados do backend
      let dataResponse: Response;
      try {
        dataResponse = await fetch(`${API_URL}/sales?limit=10000`);
      } catch (fetchError) {
        throw new Error(
          `O sistema está temporariamente indisponível. Por favor, tente novamente em alguns momentos.`
        );
      }

      if (!dataResponse.ok) {
        throw new Error(
          `Erro ao carregar os dados. Por favor, tente novamente.`
        );
      }

      const dataResult = await dataResponse.json();
      const records: SalesRecord[] = dataResult.data.map((item: any) => ({
        id: item.id || item.id_transacao || Math.random(),
        ...item,
      }));

      const dateRange = getDateRange(records);
      onDataLoaded(records, dateRange?.startDate, dateRange?.endDate);
      console.log('✅ Dados carregados do backend', { dateRange });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido ao processar arquivo';
      console.error('Erro ao processar arquivo:', error);
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [onDataLoaded, onError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  }, [handleFile]);

  const handleLoadDefaultData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setFileName('Dados Padrão');

    try {
      let dataResponse: Response;
      try {
        dataResponse = await fetch(`${API_URL}/sales?limit=10000`);
      } catch (fetchError) {
        throw new Error(
          `O sistema está temporariamente indisponível. Por favor, tente novamente em alguns momentos.`
        );
      }

      if (!dataResponse.ok) {
        throw new Error(
          `Erro ao carregar os dados. Por favor, tente novamente.`
        );
      }

      const dataResult = await dataResponse.json();
      const records: SalesRecord[] = dataResult.data.map((item: any) => ({
        id: item.id || item.id_transacao || Math.random(),
        ...item,
      }));

      const dateRange = getDateRange(records);
      onDataLoaded(records, dateRange?.startDate, dateRange?.endDate);
      console.log('✅ Dados padrão carregados do backend', { dateRange });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido ao carregar dados';
      console.error('Erro ao carregar dados:', error);
      setError(errorMsg);
      onError?.(errorMsg);
      setFileName(null);
    } finally {
      setIsLoading(false);
    }
  }, [onDataLoaded, onError]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      {/* Theme Toggle - Fixed in top right corner */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Hanami Analytics</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Faça upload do seu arquivo CSV, XLSX ou XLS para visualizar os dados
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-950 border border-red-400 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-medium">Erro ao processar</p>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`upload-zone ${isDragging ? 'border-primary bg-primary/10' : ''} ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
        >
          <div className="flex flex-col items-center gap-6">
            {isLoading ? (
              <>
                <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                <p className="text-lg text-muted-foreground">Enviando e processando...</p>
              </>
            ) : fileName ? (
              <>
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground">{fileName}</p>
                  <p className="text-sm text-muted-foreground">Carregado com sucesso</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <FileSpreadsheet className="w-10 h-10 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-foreground mb-2">
                    Arraste seu arquivo aqui
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ou clique para selecionar
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Upload className="w-4 h-4" />
                  <span>Suporta .csv, .xlsx e .xls</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="text-center text-sm text-muted-foreground">Ou</div>
          <button
            onClick={handleLoadDefaultData}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Database className="w-4 h-4" />
            Usar Dados Padrão
          </button>
        </div>
      </div>
    </div>
  );
};
