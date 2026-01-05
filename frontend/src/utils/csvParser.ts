import { SalesRecord } from "@/types/sales";

export const parseCSV = (text: string): SalesRecord[] => {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(/[,;]/).map(h => h.trim().replace(/"/g, '').toLowerCase());
  
  console.log('Headers encontrados:', headers);
  
  const records: SalesRecord[] = [];
  
  // Mapeamento flexível de colunas
  const columnMap: Record<string, string> = {
    'id_transacao': 'id_transacao',
    'idtransacao': 'id_transacao',
    'transacao_id': 'id_transacao',
    'cliente_id': 'cliente_id',
    'clienteid': 'cliente_id',
    'id_cliente': 'cliente_id',
    'nome_cliente': 'nome_cliente',
    'nomecliente': 'nome_cliente',
    'cliente': 'nome_cliente',
    'idade_cliente': 'idade_cliente',
    'idadecliente': 'idade_cliente',
    'idade': 'idade_cliente',
    'genero_cliente': 'genero_cliente',
    'generocliente': 'genero_cliente',
    'genero': 'genero_cliente',
    'sexo': 'genero_cliente',
    'cidade_cliente': 'cidade_cliente',
    'cidadecliente': 'cidade_cliente',
    'cidade': 'cidade_cliente',
    'estado_cliente': 'estado_cliente',
    'estadocliente': 'estado_cliente',
    'estado': 'estado_cliente',
    'uf': 'estado_cliente',
    'renda_estimada': 'renda_estimada',
    'rendaestimada': 'renda_estimada',
    'renda': 'renda_estimada',
    'produto_id': 'produto_id',
    'produtoid': 'produto_id',
    'id_produto': 'produto_id',
    'nome_produto': 'nome_produto',
    'nomeproduto': 'nome_produto',
    'produto': 'nome_produto',
    'categoria_produto': 'categoria_produto',
    'categoriaproduto': 'categoria_produto',
    'categoria': 'categoria_produto',
    'preco_unitario': 'preco_unitario',
    'precounitario': 'preco_unitario',
    'preco': 'preco_unitario',
    'custo_produto': 'custo_produto',
    'custoproduto': 'custo_produto',
    'custo': 'custo_produto',
    'quantidade': 'quantidade',
    'qtd': 'quantidade',
    'data_venda': 'data_venda',
    'datavenda': 'data_venda',
    'data': 'data_venda',
    'valor_total': 'valor_total',
    'valortotal': 'valor_total',
    'total': 'valor_total',
    'valor': 'valor_total',
    'valor_final': 'valor_total',
    'valorfinal': 'valor_total',
    'subtotal': 'subtotal',
    'lucro': 'lucro',
    'margem': 'lucro',
    'margem_lucro': 'margem_lucro',
    'margemlucro': 'margem_lucro',
    'desconto_aplicado': 'desconto_aplicado',
    'descontoaplicado': 'desconto_aplicado',
    'desconto': 'desconto_aplicado',
    'desconto_valor': 'desconto_aplicado',
    'descontovalor': 'desconto_aplicado',
    'forma_pagamento': 'forma_pagamento',
    'formapagamento': 'forma_pagamento',
    'pagamento': 'forma_pagamento',
    'metodo_pagamento': 'forma_pagamento',
    'parcelas': 'parcelas',
    'num_parcelas': 'parcelas',
    'status_entrega': 'status_entrega',
    'statusentrega': 'status_entrega',
    'status': 'status_entrega',
    'tempo_entrega_dias': 'tempo_entrega_dias',
    'tempoentregadias': 'tempo_entrega_dias',
    'tempo_entrega': 'tempo_entrega_dias',
    'dias_entrega': 'tempo_entrega_dias',
    'avaliacao_produto': 'avaliacao_produto',
    'avaliacaoproduto': 'avaliacao_produto',
    'avaliacao': 'avaliacao_produto',
    'nota': 'avaliacao_produto',
    'rating': 'avaliacao_produto',
  };

  // Mapear índices das colunas
  const headerIndexMap: Record<string, number> = {};
  headers.forEach((header, index) => {
    const normalizedHeader = header.replace(/[_\s-]/g, '').toLowerCase();
    const mappedField = columnMap[header] || columnMap[normalizedHeader];
    if (mappedField) {
      headerIndexMap[mappedField] = index;
    }
  });

  console.log('Mapeamento de colunas:', headerIndexMap);

  const numericFields = [
    'idade_cliente', 'renda_estimada', 'preco_unitario', 'custo_produto',
    'quantidade', 'valor_total', 'lucro', 'desconto_aplicado', 'subtotal',
    'parcelas', 'tempo_entrega_dias', 'avaliacao_produto', 'margem_lucro'
  ];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < 5) continue; // Skip invalid lines

    const record: Record<string, any> = {};

    // Mapear valores usando os índices
    Object.entries(headerIndexMap).forEach(([field, index]) => {
      const value = values[index]?.trim().replace(/"/g, '') || '';
      
      if (numericFields.includes(field)) {
        // Parse numeric values, handling different formats
        const cleanValue = value.replace(/[R$\s]/g, '').replace(',', '.');
        record[field] = parseFloat(cleanValue) || 0;
      } else {
        record[field] = value;
      }
    });

    // Calcular lucro se temos margem_lucro e valor_total
    if (record.margem_lucro && record.valor_total && !record.lucro) {
      record.lucro = record.valor_total * record.margem_lucro;
    }
    
    // Ou calcular lucro a partir de subtotal e custo
    if (!record.lucro && record.subtotal && record.custo_produto && record.quantidade) {
      record.lucro = record.subtotal - (record.custo_produto * record.quantidade);
    }

    // Set defaults for missing fields
    record.id_transacao = record.id_transacao || `T${i}`;
    record.cliente_id = record.cliente_id || `C${i}`;
    record.produto_id = record.produto_id || `P${i}`;
    
    records.push(record as SalesRecord);
  }

  console.log('Registros processados:', records.length);
  console.log('Exemplo de registro:', records[0]);
  
  return records;
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  // Detect separator (comma or semicolon)
  const separator = line.includes(';') ? ';' : ',';
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === separator && !inQuotes) {
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
  if (isNaN(value) || value === null || value === undefined) return 'R$ 0';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  if (isNaN(value) || value === null || value === undefined) return '0';
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const formatPercent = (value: number): string => {
  if (isNaN(value) || value === null || value === undefined) return '0%';
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};
