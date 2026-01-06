import { BarChart3, TrendingUp, Package, Users, CreditCard, Truck, Upload, Printer } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesRecord } from "@/types/sales";
import { useSalesData } from "@/hooks/useSalesData";
import { useApiReport } from "@/hooks/useApiReport";
import { OverviewTab } from "./dashboard/OverviewTab";
import { SalesTab } from "./dashboard/SalesTab";
import { ProductsTab } from "./dashboard/ProductsTab";
import { CustomersTab } from "./dashboard/CustomersTab";
import { PaymentsTab } from "./dashboard/PaymentsTab";
import { LogisticsTab } from "./dashboard/LogisticsTab";
import { DateRangePicker } from "./DateRangePicker";
import { ThemeToggle } from "./ThemeToggle";
import { formatNumber, formatCurrency } from "@/utils/csvParser";
import { useState } from "react";

interface DashboardProps {
  data: SalesRecord[];
  onReset: () => void;
}

export const Dashboard = ({ data, onReset }: DashboardProps) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  
  // Usar dados locais se disponíveis, senão carregar da API
  const salesData = useSalesData(data);
  const apiData = useApiReport(startDate || undefined, endDate || undefined);
  
  // Determinar se há filtro de data ativo
  const hasDateFilter = startDate || endDate;

  // Priorizar dados da API se carregados, senão usar dados locais (apenas quando não há filtro)
  const kpis = apiData.kpis ? {
    faturamentoTotal: apiData.kpis.faturamento_total || 0,
    lucroTotal: apiData.kpis.lucro_total || 0,
    quantidadeVendas: apiData.kpis.total_vendas || 0,
    clientesUnicos: apiData.kpis.clientes_unicos || 0,
    ticketMedio: apiData.kpis.ticket_medio || 0,
    avaliacaoMedia: apiData.kpis.avaliacao_media || 0,
  } : (hasDateFilter ? { faturamentoTotal: 0, lucroTotal: 0, quantidadeVendas: 0, clientesUnicos: 0, ticketMedio: 0, avaliacaoMedia: 0 } : salesData.kpis);

  const vendasPorMes = apiData.monthlySales.length > 0 
    ? apiData.monthlySales.map(m => ({
        name: m.mes,
        faturamento: m.faturamento || 0,
        lucro: m.lucro || 0,
        vendas: m.vendas || 0
      }))
    : (hasDateFilter ? [] : salesData.vendasPorMes);

  const vendasPorCategoria = apiData.salesByCategory.length > 0
    ? apiData.salesByCategory
    : (hasDateFilter ? [] : salesData.vendasPorCategoria);

  const produtosMaisVendidos = apiData.topProducts.length > 0
    ? apiData.topProducts
    : (hasDateFilter ? [] : salesData.produtosMaisVendidos);

  const clientesPorGenero = apiData.customersByGender.length > 0
    ? apiData.customersByGender
    : (hasDateFilter ? [] : salesData.clientesPorGenero);

  const vendasPorEstado = apiData.salesByState.length > 0
    ? apiData.salesByState
    : (hasDateFilter ? [] : salesData.vendasPorEstado);

  const formaPagamento = apiData.paymentMethods.length > 0
    ? apiData.paymentMethods
    : (hasDateFilter ? [] : salesData.formaPagamento);

  const clientesPorIdade = apiData.customersByAge.length > 0
    ? apiData.customersByAge
    : (hasDateFilter ? [] : salesData.clientesPorIdade);

  const parcelamentoMedio = apiData.installments.length > 0
    ? apiData.installments
    : (hasDateFilter ? [] : salesData.parcelamentoMedio);

  const statusEntrega = apiData.deliveryStatus.length > 0
    ? apiData.deliveryStatus
    : (hasDateFilter ? [] : salesData.statusEntrega);

  const avaliacaoPorProduto = apiData.productRatings.length > 0
    ? apiData.productRatings
    : (hasDateFilter ? [] : salesData.avaliacaoPorProduto);

  const tempoEntregaMedia = apiData.averageDeliveryTime?.tempo_medio || 0;

  const handlePrint = () => {
    // Usar o print nativo do navegador que respeita CSS de impressão
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const tabs = [
    { id: "overview", label: "Visão Geral", icon: BarChart3 },
    { id: "sales", label: "Vendas", icon: TrendingUp },
    { id: "products", label: "Produtos", icon: Package },
    { id: "customers", label: "Clientes", icon: Users },
    { id: "payments", label: "Pagamentos", icon: CreditCard },
    { id: "logistics", label: "Logística", icon: Truck },
  ];

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Print Header - Only shows when printing */}
      <div className="hidden print:block mb-8">
        <h1 className="text-4xl font-bold mb-2">Hanami Analytics</h1>
        <p className="text-lg text-gray-600 mb-4">Relatório de Análise de Dados</p>
        <p className="text-sm text-gray-500">Gerado em: {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <hr className="my-4" />
      </div>

      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-gradient">Hanami Analytics</span>
          </h1>
          <p className="text-muted-foreground">
            {formatNumber(data.length)} registros carregados
          </p>
          {apiData.loading && <p className="text-sm text-blue-600 mt-1">📡 Carregando dados do servidor...</p>}
        </div>
        <div className="flex items-center gap-3 no-print">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors text-sm font-medium text-accent-foreground"
            title="Imprimir relatório"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <ThemeToggle />
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium"
          >
            <Upload className="w-4 h-4" />
            Novo Upload
          </button>
        </div>
      </header>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="sticky top-0 z-40 flex justify-center py-4 bg-gradient-to-b from-background to-background/95 backdrop-blur-sm border-b">
          <TabsList className="glass-card p-1 inline-flex">
            {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="tab-modern flex items-center gap-2 data-[state=active]:bg-primary/10 rounded-lg whitespace-nowrap"
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        </div>

        {/* Date Range Picker */}
        <div className="mb-6 no-print">
          <DateRangePicker onDateChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }} />
        </div>

        <TabsContent value="overview">
          <OverviewTab
            kpis={kpis}
            vendasPorMes={vendasPorMes}
            vendasPorCategoria={vendasPorCategoria}
          />
        </TabsContent>

        <TabsContent value="sales">
          <SalesTab vendasPorMes={vendasPorMes} />
        </TabsContent>

        <TabsContent value="products">
          <ProductsTab
            produtosMaisVendidos={produtosMaisVendidos}
            vendasPorCategoria={vendasPorCategoria}
            avaliacaoPorProduto={avaliacaoPorProduto}
          />
        </TabsContent>

        <TabsContent value="customers">
          <CustomersTab
            clientesPorGenero={clientesPorGenero}
            clientesPorIdade={clientesPorIdade}
            vendasPorEstado={vendasPorEstado}
          />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentsTab
            formaPagamento={formaPagamento}
            parcelamentoMedio={parcelamentoMedio}
          />
        </TabsContent>

        <TabsContent value="logistics">
          <LogisticsTab
            statusEntrega={statusEntrega}
            tempoEntregaMedia={tempoEntregaMedia}
            avaliacaoPorProduto={avaliacaoPorProduto}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
