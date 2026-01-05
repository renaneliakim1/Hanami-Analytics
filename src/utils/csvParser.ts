import { SalesRecord } from "@/types/sales";

export const parseCSV = (text: string): SalesRecord[] => {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  const records: SalesRecord[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const record: Record<string, any> = {};
      headers.forEach((header, index) => {
        const value = values[index]?.trim().replace(/"/g, '') || '';
        
        // Parse numeric fields
        if (['idade_cliente', 'renda_estimada', 'preco_unitario', 'custo_produto', 
             'quantidade', 'valor_total', 'lucro', 'desconto_aplicado', 
             'parcelas', 'tempo_entrega_dias', 'avaliacao_produto'].includes(header)) {
          record[header] = parseFloat(value) || 0;
        } else {
          record[header] = value;
        }
      });
      records.push(record as SalesRecord);
    }
  }
  
  return records;
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};
