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

export const useApiReport = (startDate?: string, endDate?: string, region?: string) => {
  const [kpis, setKpis] = useState<APIKPIs | null>(null);
  const [monthlySales, setMonthlySales] = useState<APIMonthlySales[]>([]);
  const [salesByCategory, setSalesByCategory] = useState<APICategory[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [customersByGender, setCustomersByGender] = useState<APICategory[]>([]);
  const [salesByState, setSalesByState] = useState<APICategory[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [customersByAge, setCustomersByAge] = useState<any[]>([]);
  const [installments, setInstallments] = useState<any[]>([]);
  const [deliveryStatus, setDeliveryStatus] = useState<APICategory[]>([]);
  const [productRatings, setProductRatings] = useState<any[]>([]);
  const [averageDeliveryTime, setAverageDeliveryTime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Construir query params de data e região
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (region) params.append('region', region);
        const queryString = params.toString();
        const suffix = queryString ? `?${queryString}` : '';

        console.log('📡 Buscando dados com filtro:', { startDate, endDate, region, suffix });

        // Carregar todos os dados em paralelo
        const [
          kpisRes,
          monthlySalesRes,
          categoriesRes,
          productsRes,
          genderRes,
          stateRes,
          paymentRes,
          ageRes,
          installmentsRes,
          deliveryRes,
          ratingsRes,
          timeRes,
        ] = await Promise.all([
          fetch(`${API_URL}/kpis${suffix}`),
          fetch(`${API_URL}/sales-by-month${suffix}`),
          fetch(`${API_URL}/sales-by-category${suffix}`),
          fetch(`${API_URL}/top-products${suffix}`),
          fetch(`${API_URL}/customers-by-gender${suffix}`),
          fetch(`${API_URL}/sales-by-state${suffix}`),
          fetch(`${API_URL}/payment-methods${suffix}`),
          fetch(`${API_URL}/customers-by-age${suffix}`),
          fetch(`${API_URL}/installments${suffix}`),
          fetch(`${API_URL}/delivery-status${suffix}`),
          fetch(`${API_URL}/product-ratings${suffix}`),
          fetch(`${API_URL}/average-delivery-time${suffix}`),
        ]);

        // Verificar se todos os responses são ok
        if (
          !kpisRes.ok ||
          !monthlySalesRes.ok ||
          !categoriesRes.ok ||
          !productsRes.ok ||
          !genderRes.ok ||
          !stateRes.ok ||
          !paymentRes.ok ||
          !ageRes.ok ||
          !installmentsRes.ok ||
          !deliveryRes.ok ||
          !ratingsRes.ok ||
          !timeRes.ok
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
        const ageData = await ageRes.json();
        const installmentsData = await installmentsRes.json();
        const deliveryData = await deliveryRes.json();
        const ratingsData = await ratingsRes.json();
        const timeData = await timeRes.json();

        console.log('✅ Dados carregados com sucesso:', {
          kpis: kpisData,
          monthlySales: monthlySalesData.length,
          categories: categoriesData.length,
          products: productsData.length,
          gender: genderData.length,
          state: stateData.length,
          payment: paymentData.length,
          age: ageData.length,
          installments: installmentsData.length,
          delivery: deliveryData.length,
          ratings: ratingsData.length,
          time: timeData,
        });

        setKpis(kpisData);
        setMonthlySales(monthlySalesData);
        setSalesByCategory(categoriesData);
        setTopProducts(productsData);
        setCustomersByGender(genderData);
        setSalesByState(stateData);
        setPaymentMethods(paymentData);
        setCustomersByAge(ageData);
        setInstallments(installmentsData);
        setDeliveryStatus(deliveryData);
        setProductRatings(ratingsData);
        setAverageDeliveryTime(timeData);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMsg);
        console.error('❌ Erro ao carregar relatório:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [startDate, endDate, region]);

  return {
    kpis,
    monthlySales,
    salesByCategory,
    topProducts,
    customersByGender,
    salesByState,
    paymentMethods,
    customersByAge,
    installments,
    deliveryStatus,
    productRatings,
    averageDeliveryTime,
    loading,
    error,
  };
};
