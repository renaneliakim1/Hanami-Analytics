export interface SalesRecord {
  id_transacao: string;
  cliente_id: string;
  nome_cliente: string;
  idade_cliente: number;
  genero_cliente: string;
  cidade_cliente: string;
  estado_cliente: string;
  renda_estimada: number;
  produto_id: string;
  nome_produto: string;
  categoria_produto?: string;
  categoria?: string;
  preco_unitario: number;
  custo_produto: number;
  quantidade: number;
  data_venda: string;
  valor_total?: number;
  valor_final?: number;
  lucro?: number;
  margem_lucro?: number;
  desconto_aplicado?: number;
  forma_pagamento: string;
  parcelas: number;
  status_entrega?: string;
  regiao?: string;
  tempo_entrega_dias?: number;
  avaliacao_produto: number;
  subtotal?: number;
  [key: string]: any;
}

export interface KPIData {
  faturamentoTotal: number;
  lucroTotal: number;
  quantidadeVendas: number;
  clientesUnicos: number;
  ticketMedio: number;
  avaliacaoMedia: number;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}
