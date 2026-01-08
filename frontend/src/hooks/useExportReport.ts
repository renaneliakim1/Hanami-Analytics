import { useState } from 'react';

interface ExportOptions {
  startDate?: string;
  endDate?: string;
  region?: string;
}

interface UseExportReportReturn {
  exportCSV: (options?: ExportOptions) => Promise<void>;
  exportExcel: (options?: ExportOptions) => Promise<void>;
  isExporting: boolean;
  error: string | null;
}

const API_BASE_URL = 'http://localhost:8000';

/**
 * Hook para exportar relatórios em CSV e Excel
 * 
 * Suporta filtros de data e região
 */
export const useExportReport = (): UseExportReportReturn => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Função auxiliar para fazer download de arquivo
   */
  const downloadFile = async (url: string, filename: string) => {
    try {
      setIsExporting(true);
      setError(null);

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro ao exportar: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao exportar';
      setError(errorMessage);
      console.error('Erro na exportação:', err);
      throw err;
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Constrói URL com parâmetros de filtro
   */
  const buildExportUrl = (endpoint: string, options?: ExportOptions): string => {
    const params = new URLSearchParams();

    if (options?.startDate) {
      params.append('start_date', options.startDate);
    }

    if (options?.endDate) {
      params.append('end_date', options.endDate);
    }

    if (options?.region && options.region !== '') {
      params.append('region', options.region);
    }

    const queryString = params.toString();
    return `${API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
  };

  /**
   * Exporta relatório em formato CSV
   */
  const exportCSV = async (options?: ExportOptions) => {
    const url = buildExportUrl('/export/csv', options);
    const filename = `relatorio_vendas_${new Date().getTime()}.csv`;
    await downloadFile(url, filename);
  };

  /**
   * Exporta relatório em formato Excel
   */
  const exportExcel = async (options?: ExportOptions) => {
    const url = buildExportUrl('/export/excel', options);
    const filename = `relatorio_vendas_${new Date().getTime()}.xlsx`;
    await downloadFile(url, filename);
  };

  return {
    exportCSV,
    exportExcel,
    isExporting,
    error,
  };
};
