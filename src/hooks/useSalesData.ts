import { useMemo } from "react";
import { SalesRecord, KPIData } from "@/types/sales";

export const useSalesData = (data: SalesRecord[]) => {
  const kpis = useMemo((): KPIData => {
    if (data.length === 0) {
      return {
        faturamentoTotal: 0,
        lucroTotal: 0,
        quantidadeVendas: 0,
        clientesUnicos: 0,
        ticketMedio: 0,
        avaliacaoMedia: 0,
      };
    }

    const faturamentoTotal = data.reduce((sum, r) => sum + r.valor_total, 0);
    const lucroTotal = data.reduce((sum, r) => sum + r.lucro, 0);
    const quantidadeVendas = data.length;
    const clientesUnicos = new Set(data.map(r => r.cliente_id)).size;
    const ticketMedio = faturamentoTotal / quantidadeVendas;
    const avaliacaoMedia = data.reduce((sum, r) => sum + r.avaliacao_produto, 0) / quantidadeVendas;

    return {
      faturamentoTotal,
      lucroTotal,
      quantidadeVendas,
      clientesUnicos,
      ticketMedio,
      avaliacaoMedia,
    };
  }, [data]);

  const vendasPorMes = useMemo(() => {
    const grouped: Record<string, { faturamento: number; lucro: number; vendas: number }> = {};
    
    data.forEach(r => {
      const date = new Date(r.data_venda);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!grouped[key]) {
        grouped[key] = { faturamento: 0, lucro: 0, vendas: 0 };
      }
      grouped[key].faturamento += r.valor_total;
      grouped[key].lucro += r.lucro;
      grouped[key].vendas += 1;
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, values]) => ({
        name: month,
        faturamento: values.faturamento,
        lucro: values.lucro,
        vendas: values.vendas,
      }));
  }, [data]);

  const produtosMaisVendidos = useMemo(() => {
    const grouped: Record<string, { quantidade: number; lucro: number; nome: string }> = {};
    
    data.forEach(r => {
      if (!grouped[r.produto_id]) {
        grouped[r.produto_id] = { quantidade: 0, lucro: 0, nome: r.nome_produto };
      }
      grouped[r.produto_id].quantidade += r.quantidade;
      grouped[r.produto_id].lucro += r.lucro;
    });

    return Object.values(grouped)
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10)
      .map(p => ({ name: p.nome, quantidade: p.quantidade, lucro: p.lucro }));
  }, [data]);

  const vendasPorCategoria = useMemo(() => {
    const grouped: Record<string, number> = {};
    
    data.forEach(r => {
      grouped[r.categoria_produto] = (grouped[r.categoria_produto] || 0) + r.valor_total;
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const clientesPorGenero = useMemo(() => {
    const grouped: Record<string, number> = {};
    
    data.forEach(r => {
      grouped[r.genero_cliente] = (grouped[r.genero_cliente] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }));
  }, [data]);

  const clientesPorIdade = useMemo(() => {
    const faixas: Record<string, number> = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '56+': 0,
    };
    
    data.forEach(r => {
      const idade = r.idade_cliente;
      if (idade <= 25) faixas['18-25']++;
      else if (idade <= 35) faixas['26-35']++;
      else if (idade <= 45) faixas['36-45']++;
      else if (idade <= 55) faixas['46-55']++;
      else faixas['56+']++;
    });

    return Object.entries(faixas).map(([name, value]) => ({ name, value }));
  }, [data]);

  const vendasPorEstado = useMemo(() => {
    const grouped: Record<string, number> = {};
    
    data.forEach(r => {
      grouped[r.estado_cliente] = (grouped[r.estado_cliente] || 0) + r.valor_total;
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [data]);

  const formaPagamento = useMemo(() => {
    const grouped: Record<string, { count: number; total: number }> = {};
    
    data.forEach(r => {
      if (!grouped[r.forma_pagamento]) {
        grouped[r.forma_pagamento] = { count: 0, total: 0 };
      }
      grouped[r.forma_pagamento].count++;
      grouped[r.forma_pagamento].total += r.valor_total;
    });

    return Object.entries(grouped)
      .map(([name, values]) => ({
        name,
        quantidade: values.count,
        valorMedio: values.total / values.count,
      }))
      .sort((a, b) => b.quantidade - a.quantidade);
  }, [data]);

  const parcelamentoMedio = useMemo(() => {
    const grouped: Record<number, number> = {};
    
    data.forEach(r => {
      grouped[r.parcelas] = (grouped[r.parcelas] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([parcelas, count]) => ({ name: `${parcelas}x`, value: count }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  }, [data]);

  const statusEntrega = useMemo(() => {
    const grouped: Record<string, number> = {};
    
    data.forEach(r => {
      grouped[r.status_entrega] = (grouped[r.status_entrega] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }));
  }, [data]);

  const tempoEntregaMedia = useMemo(() => {
    if (data.length === 0) return 0;
    return data.reduce((sum, r) => sum + r.tempo_entrega_dias, 0) / data.length;
  }, [data]);

  const avaliacaoPorProduto = useMemo(() => {
    const grouped: Record<string, { total: number; count: number; nome: string }> = {};
    
    data.forEach(r => {
      if (!grouped[r.produto_id]) {
        grouped[r.produto_id] = { total: 0, count: 0, nome: r.nome_produto };
      }
      grouped[r.produto_id].total += r.avaliacao_produto;
      grouped[r.produto_id].count++;
    });

    return Object.values(grouped)
      .map(p => ({ name: p.nome, avaliacao: p.total / p.count }))
      .sort((a, b) => a.avaliacao - b.avaliacao)
      .slice(0, 10);
  }, [data]);

  return {
    kpis,
    vendasPorMes,
    produtosMaisVendidos,
    vendasPorCategoria,
    clientesPorGenero,
    clientesPorIdade,
    vendasPorEstado,
    formaPagamento,
    parcelamentoMedio,
    statusEntrega,
    tempoEntregaMedia,
    avaliacaoPorProduto,
  };
};
