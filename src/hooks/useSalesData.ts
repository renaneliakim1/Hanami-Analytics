import { useMemo } from "react";
import { SalesRecord, KPIData } from "@/types/sales";

export const useSalesData = (data: SalesRecord[]) => {
  const kpis = useMemo((): KPIData => {
    if (!data || data.length === 0) {
      return {
        faturamentoTotal: 0,
        lucroTotal: 0,
        quantidadeVendas: 0,
        clientesUnicos: 0,
        ticketMedio: 0,
        avaliacaoMedia: 0,
      };
    }

    const faturamentoTotal = data.reduce((sum, r) => sum + (r.valor_total || 0), 0);
    const lucroTotal = data.reduce((sum, r) => sum + (r.lucro || 0), 0);
    const quantidadeVendas = data.length;
    const clientesUnicos = new Set(data.map(r => r.cliente_id).filter(Boolean)).size;
    const ticketMedio = quantidadeVendas > 0 ? faturamentoTotal / quantidadeVendas : 0;
    const avaliacoes = data.filter(r => r.avaliacao_produto > 0);
    const avaliacaoMedia = avaliacoes.length > 0 
      ? avaliacoes.reduce((sum, r) => sum + r.avaliacao_produto, 0) / avaliacoes.length 
      : 0;

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
    if (!data || data.length === 0) return [];
    
    const grouped: Record<string, { faturamento: number; lucro: number; vendas: number }> = {};
    
    data.forEach(r => {
      if (!r.data_venda) return;
      
      let date: Date;
      // Try different date formats
      if (r.data_venda.includes('/')) {
        const parts = r.data_venda.split('/');
        if (parts.length === 3) {
          // DD/MM/YYYY or MM/DD/YYYY
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]);
          const year = parseInt(parts[2]);
          date = new Date(year, month - 1, day);
        } else {
          return;
        }
      } else {
        date = new Date(r.data_venda);
      }
      
      if (isNaN(date.getTime())) return;
      
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!grouped[key]) {
        grouped[key] = { faturamento: 0, lucro: 0, vendas: 0 };
      }
      grouped[key].faturamento += r.valor_total || 0;
      grouped[key].lucro += r.lucro || 0;
      grouped[key].vendas += 1;
    });

    const result = Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, values]) => ({
        name: month,
        faturamento: values.faturamento,
        lucro: values.lucro,
        vendas: values.vendas,
      }));

    console.log('Vendas por mês:', result);
    return result;
  }, [data]);

  const produtosMaisVendidos = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const grouped: Record<string, { quantidade: number; lucro: number; nome: string }> = {};
    
    data.forEach(r => {
      const key = r.produto_id || r.nome_produto || 'Desconhecido';
      if (!grouped[key]) {
        grouped[key] = { quantidade: 0, lucro: 0, nome: r.nome_produto || key };
      }
      grouped[key].quantidade += r.quantidade || 1;
      grouped[key].lucro += r.lucro || 0;
    });

    return Object.values(grouped)
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10)
      .map(p => ({ name: p.nome, quantidade: p.quantidade, lucro: p.lucro }));
  }, [data]);

  const vendasPorCategoria = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const grouped: Record<string, number> = {};
    
    data.forEach(r => {
      const categoria = r.categoria_produto || 'Outros';
      grouped[categoria] = (grouped[categoria] || 0) + (r.valor_total || 0);
    });

    const result = Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    console.log('Vendas por categoria:', result);
    return result;
  }, [data]);

  const clientesPorGenero = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const grouped: Record<string, number> = {};
    
    data.forEach(r => {
      const genero = r.genero_cliente || 'Não informado';
      grouped[genero] = (grouped[genero] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }));
  }, [data]);

  const clientesPorIdade = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const faixas: Record<string, number> = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '56+': 0,
    };
    
    data.forEach(r => {
      const idade = r.idade_cliente || 0;
      if (idade <= 0) return;
      if (idade <= 25) faixas['18-25']++;
      else if (idade <= 35) faixas['26-35']++;
      else if (idade <= 45) faixas['36-45']++;
      else if (idade <= 55) faixas['46-55']++;
      else faixas['56+']++;
    });

    return Object.entries(faixas)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [data]);

  const vendasPorEstado = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const grouped: Record<string, number> = {};
    
    data.forEach(r => {
      const estado = r.estado_cliente || 'Não informado';
      grouped[estado] = (grouped[estado] || 0) + (r.valor_total || 0);
    });

    const result = Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    console.log('Vendas por estado:', result);
    return result;
  }, [data]);

  const formaPagamento = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const grouped: Record<string, { count: number; total: number }> = {};
    
    data.forEach(r => {
      const forma = r.forma_pagamento || 'Não informado';
      if (!grouped[forma]) {
        grouped[forma] = { count: 0, total: 0 };
      }
      grouped[forma].count++;
      grouped[forma].total += r.valor_total || 0;
    });

    const result = Object.entries(grouped)
      .map(([name, values]) => ({
        name,
        quantidade: values.count,
        valorMedio: values.count > 0 ? values.total / values.count : 0,
      }))
      .sort((a, b) => b.quantidade - a.quantidade);

    console.log('Forma pagamento:', result);
    return result;
  }, [data]);

  const parcelamentoMedio = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const grouped: Record<number, number> = {};
    
    data.forEach(r => {
      const parcelas = r.parcelas || 1;
      grouped[parcelas] = (grouped[parcelas] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([parcelas, count]) => ({ name: `${parcelas}x`, value: count }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  }, [data]);

  const statusEntrega = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const grouped: Record<string, number> = {};
    
    data.forEach(r => {
      const status = r.status_entrega || 'Não informado';
      grouped[status] = (grouped[status] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }));
  }, [data]);

  const tempoEntregaMedia = useMemo(() => {
    if (!data || data.length === 0) return 0;
    const validData = data.filter(r => r.tempo_entrega_dias > 0);
    if (validData.length === 0) return 0;
    return validData.reduce((sum, r) => sum + r.tempo_entrega_dias, 0) / validData.length;
  }, [data]);

  const avaliacaoPorProduto = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const grouped: Record<string, { total: number; count: number; nome: string }> = {};
    
    data.forEach(r => {
      if (!r.avaliacao_produto || r.avaliacao_produto <= 0) return;
      const key = r.produto_id || r.nome_produto || 'Desconhecido';
      if (!grouped[key]) {
        grouped[key] = { total: 0, count: 0, nome: r.nome_produto || key };
      }
      grouped[key].total += r.avaliacao_produto;
      grouped[key].count++;
    });

    return Object.values(grouped)
      .map(p => ({ name: p.nome, avaliacao: p.count > 0 ? p.total / p.count : 0 }))
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
