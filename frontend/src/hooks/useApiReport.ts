import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface APIKPIs {
  total_vendas: number;
  faturamento_total?: number;
  ticket_medio?: number;
  lucro_total?: number;
  margem_lucro_media?: number;
  clientes_unicos?: number;
  avaliacao_media?: number;
}

export interface APIMonthlySales {
  mes: string;
  faturamento?: number;
  lucro?: number;
  vendas?: number;
}

export interface APICategory {
  name: string;
  value: number;
}

export const useApiReport = () => {
  const [kpis, setKpis] = useState<APIKPIs | null>(null);
  const [monthlySales, setMonthlySales] = useState<APIMonthlySales[]>([]);
  const [salesByCategory, setSalesByCategory] = useState<APICategory[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [customersByGender, setCustomersByGender] = useState<APICategory[]>([]);
  const [salesByState, setSalesByState] = useState<APICategory[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Carregar todos os dados em paralelo
        const [
          kpisRes,
          monthlySalesRes,
          categoriesRes,
          productsRes,
          genderRes,
          stateRes,
          paymentRes,
        ] = await Promise.all([
          fetch(`${API_URL}/kpis`),
          fetch(`${API_URL}/sales-by-month`),
          fetch(`${API_URL}/sales-by-category`),
          fetch(`${API_URL}/top-products`),
          fetch(`${API_URL}/customers-by-gender`),
          fetch(`${API_URL}/sales-by-state`),
          fetch(`${API_URL}/payment-methods`),
        ]);

        // Verificar se todos os responses são ok
        if (
          !kpisRes.ok ||
          !monthlySalesRes.ok ||
          !categoriesRes.ok ||
          !productsRes.ok ||
          !genderRes.ok ||
          !stateRes.ok ||
          !paymentRes.ok
        ) {
          throw new Error('Erro ao carregar dados do servidor');
        }

        // Processar respostas
        const kpisData = await kpisRes.json();
        const monthlySalesData = await monthlySalesRes.json();
        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();
        const genderData = await genderRes.json();
        const stateData = await stateRes.json();
        const paymentData = await paymentRes.json();

        setKpis(kpisData);
        setMonthlySales(monthlySalesData);
        setSalesByCategory(categoriesData);
        setTopProducts(productsData);
        setCustomersByGender(genderData);
        setSalesByState(stateData);
        setPaymentMethods(paymentData);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMsg);
        console.error('Erro ao carregar relatório:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  return {
    kpis,
    monthlySales,
    salesByCategory,
    topProducts,
    customersByGender,
    salesByState,
    paymentMethods,
    loading,
    error,
  };
};
