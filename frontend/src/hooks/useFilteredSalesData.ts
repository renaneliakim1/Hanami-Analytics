import { useMemo } from "react";
import { SalesRecord, KPIData } from "@/types/sales";

export const useFilteredSalesData = (data: SalesRecord[], region?: string, startDate?: string, endDate?: string) => {
  // Filtrar dados por region, startDate e endDate
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.filter(record => {
      // Filtro por região
      if (region && record.regiao !== region) {
        return false;
      }
      
      // Filtro por data inicial
      if (startDate) {
        const recordDate = new Date(record.data_venda);
        const filterDate = new Date(startDate);
        if (recordDate < filterDate) {
          return false;
        }
      }
      
      // Filtro por data final
      if (endDate) {
        const recordDate = new Date(record.data_venda);
        const filterDate = new Date(endDate);
        filterDate.setDate(filterDate.getDate() + 1); // Incluir o dia final completo
        if (recordDate >= filterDate) {
          return false;
        }
      }
      
      return true;
    });
  }, [data, region, startDate, endDate]);

  // Calcular KPIs dos dados filtrados
  const kpis = useMemo((): KPIData => {
    if (!filteredData || filteredData.length === 0) {
      return {
        faturamentoTotal: 0,
        lucroTotal: 0,
        quantidadeVendas: 0,
        clientesUnicos: 0,
        ticketMedio: 0,
        avaliacaoMedia: 0,
      };
    }

    const faturamentoTotal = filteredData.reduce((sum, r) => sum + (r.valor_total || r.valor_final || 0), 0);
    const lucroTotal = filteredData.reduce((sum, r) => sum + (r.margem_lucro || 0), 0);
    const quantidadeVendas = filteredData.length;
    const clientesUnicos = new Set(filteredData.map(r => r.cliente_id).filter(Boolean)).size;
    const ticketMedio = quantidadeVendas > 0 ? faturamentoTotal / quantidadeVendas : 0;
    const avaliacoes = filteredData.filter(r => r.avaliacao_produto > 0);
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
  }, [filteredData]);

  // Vendas por mês
  const vendasPorMes = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    
    const grouped: Record<string, { faturamento: number; lucro: number; vendas: number }> = {};
    
    filteredData.forEach(r => {
      if (!r.data_venda) return;
      
      let date: Date;
      // Try different date formats
      if (r.data_venda.includes('/')) {
        const parts = r.data_venda.split('/');
        if (parts.length === 3) {
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
      const valorVenda = Number(r.valor_final) || 0;
      const valorLucro = Number(r.margem_lucro) || 0;
      grouped[key].faturamento += valorVenda;
      grouped[key].lucro += valorLucro;
      grouped[key].vendas += 1;
    });

    const result = Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, values]) => {
        const [year, monthNum] = month.split('-');
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const monthName = monthNames[parseInt(monthNum) - 1];
        return {
          name: `${monthName}/${year}`,
          faturamento: Math.round(values.faturamento * 100) / 100,
          lucro: Math.round(values.lucro * 100) / 100,
          vendas: values.vendas,
        };
      });

    return result;
  }, [filteredData]);

  // Vendas por categoria
  const vendasPorCategoria = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    
    const grouped: Record<string, number> = {};
    
    filteredData.forEach(r => {
      const categoria = r.categoria || 'Desconhecido';
      grouped[categoria] = (grouped[categoria] || 0) + (r.valor_final || 0);
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredData]);

  // Produtos mais vendidos
  const produtosMaisVendidos = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    
    const grouped: Record<string, { quantidade: number; valor: number; nome: string }> = {};
    
    filteredData.forEach(r => {
      const key = r.produto_id || r.nome_produto || 'Desconhecido';
      if (!grouped[key]) {
        grouped[key] = { quantidade: 0, valor: 0, nome: r.nome_produto || key };
      }
      grouped[key].quantidade += r.quantidade || 1;
      grouped[key].valor += r.valor_final || 0;
    });

    return Object.entries(grouped)
      .map(([_, item]) => ({
        name: item.nome,
        value: item.quantidade,
        revenue: item.valor,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filteredData]);

  // Clientes por gênero
  const clientesPorGenero = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    
    const grouped: Record<string, number> = {};
    
    filteredData.forEach(r => {
      const genero = r.genero_cliente === 'M' ? 'Masculino' : r.genero_cliente === 'F' ? 'Feminino' : 'Outro';
      grouped[genero] = (grouped[genero] || 0) + (r.valor_final || 0);
    });

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Vendas por estado
  const vendasPorEstado = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    
    const grouped: Record<string, number> = {};
    
    filteredData.forEach(r => {
      const estado = r.estado_cliente || 'Desconhecido';
      grouped[estado] = (grouped[estado] || 0) + (r.valor_final || 0);
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredData]);

  // Formas de pagamento
  const formaPagamento = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    
    const grouped: Record<string, { quantidade: number; valor: number }> = {};
    
    filteredData.forEach(r => {
      const forma = r.forma_pagamento || 'Desconhecido';
      if (!grouped[forma]) {
        grouped[forma] = { quantidade: 0, valor: 0 };
      }
      grouped[forma].quantidade += 1;
      grouped[forma].valor += r.valor_final || 0;
    });

    return Object.entries(grouped)
      .map(([name, item]) => ({
        name,
        value: item.quantidade,
        revenue: item.valor,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredData]);

  // Clientes por idade
  const clientesPorIdade = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    
    const ranges = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '56+': 0,
    };
    
    filteredData.forEach(r => {
      const idade = r.idade_cliente || 0;
      if (idade <= 25) ranges['18-25'] += r.valor_final || 0;
      else if (idade <= 35) ranges['26-35'] += r.valor_final || 0;
      else if (idade <= 45) ranges['36-45'] += r.valor_final || 0;
      else if (idade <= 55) ranges['46-55'] += r.valor_final || 0;
      else ranges['56+'] += r.valor_final || 0;
    });

    return Object.entries(ranges)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Parcelamento médio
  const parcelamentoMedio = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    
    const grouped: Record<number, number> = {};
    
    filteredData.forEach(r => {
      const parcelas = r.parcelas || 1;
      grouped[parcelas] = (grouped[parcelas] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([parcelas, count]) => ({
        name: `${parcelas}x`,
        value: count,
      }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  }, [filteredData]);

  // Status de entrega
  const statusEntrega = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    
    const grouped: Record<string, number> = {};
    
    filteredData.forEach(r => {
      const status = r.status_entrega || 'Desconhecido';
      grouped[status] = (grouped[status] || 0) + (r.valor_final || 0);
    });

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Avaliação por produto
  const avaliacaoPorProduto = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    
    const grouped: Record<string, { soma: number; count: number; nome: string }> = {};
    
    filteredData.forEach(r => {
      const key = r.produto_id || r.nome_produto || 'Desconhecido';
      if (!grouped[key]) {
        grouped[key] = { soma: 0, count: 0, nome: r.nome_produto || key };
      }
      grouped[key].soma += r.avaliacao_produto || 0;
      grouped[key].count += 1;
    });

    return Object.entries(grouped)
      .map(([_, item]) => ({
        name: item.nome,
        value: item.count > 0 ? item.soma / item.count : 0,
        count: item.count,
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filteredData]);

  return {
    kpis,
    vendasPorMes,
    vendasPorCategoria,
    produtosMaisVendidos,
    clientesPorGenero,
    vendasPorEstado,
    formaPagamento,
    clientesPorIdade,
    parcelamentoMedio,
    statusEntrega,
    avaliacaoPorProduto,
  };
};
