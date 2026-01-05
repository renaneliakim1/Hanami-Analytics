import { useCallback, useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { parseCSV } from "@/utils/csvParser";
import { SalesRecord } from "@/types/sales";

interface FileUploadProps {
  onDataLoaded: (data: SalesRecord[]) => void;
}

export const FileUpload = ({ onDataLoaded }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Por favor, selecione um arquivo CSV');
      return;
    }

    setIsLoading(true);
    setFileName(file.name);

    try {
      const text = await file.text();
      const records = parseCSV(text);
      onDataLoaded(records);
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      alert('Erro ao processar o arquivo CSV');
    } finally {
      setIsLoading(false);
    }
  }, [onDataLoaded]);

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
    input.accept = '.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  }, [handleFile]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Sales Analytics</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Faça upload do seu arquivo CSV para visualizar os dados de vendas
          </p>
        </div>

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
                <p className="text-lg text-muted-foreground">Processando...</p>
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
                    Arraste seu arquivo CSV aqui
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ou clique para selecionar
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Upload className="w-4 h-4" />
                  <span>Suporta arquivos .csv</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
