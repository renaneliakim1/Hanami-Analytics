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
import { ThemeToggle } from "./ThemeToggle";
import { formatNumber } from "@/utils/csvParser";

interface DashboardProps {
  data: SalesRecord[];
  onReset: () => void;
}

export const Dashboard = ({ data, onReset }: DashboardProps) => {
  // Usar dados locais se disponíveis, senão carregar da API
  const salesData = useSalesData(data);
  const apiData = useApiReport();

  // Priorizar dados da API se carregados, senão usar dados locais
  const kpis = apiData.kpis ? {
    faturamentoTotal: apiData.kpis.faturamento_total || 0,
    lucroTotal: apiData.kpis.lucro_total || 0,
    quantidadeVendas: apiData.kpis.total_vendas || 0,
    clientesUnicos: apiData.kpis.clientes_unicos || 0,
    ticketMedio: apiData.kpis.ticket_medio || 0,
    avaliacaoMedia: apiData.kpis.avaliacao_media || 0,
  } : salesData.kpis;

  const vendasPorMes = apiData.monthlySales.length > 0 
    ? apiData.monthlySales.map(m => ({
        name: m.mes,
        faturamento: m.faturamento || 0,
        lucro: m.lucro || 0,
        vendas: m.vendas || 0
      }))
    : salesData.vendasPorMes;

  const vendasPorCategoria = apiData.salesByCategory.length > 0
    ? apiData.salesByCategory
    : salesData.vendasPorCategoria;

  const produtosMaisVendidos = apiData.topProducts.length > 0
    ? apiData.topProducts
    : salesData.produtosMaisVendidos;

  const clientesPorGenero = apiData.customersByGender.length > 0
    ? apiData.customersByGender
    : salesData.clientesPorGenero;

  const vendasPorEstado = apiData.salesByState.length > 0
    ? apiData.salesByState
    : salesData.vendasPorEstado;

  const formaPagamento = apiData.paymentMethods.length > 0
    ? apiData.paymentMethods
    : salesData.formaPagamento;

  const handlePrint = () => {
    window.print();
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
        <div className="flex justify-center">
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
            avaliacaoPorProduto={salesData.avaliacaoPorProduto}
          />
        </TabsContent>

        <TabsContent value="customers">
          <CustomersTab
            clientesPorGenero={clientesPorGenero}
            clientesPorIdade={salesData.clientesPorIdade}
            vendasPorEstado={vendasPorEstado}
          />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentsTab
            formaPagamento={formaPagamento}
            parcelamentoMedio={salesData.parcelamentoMedio}
          />
        </TabsContent>

        <TabsContent value="logistics">
          <LogisticsTab
            statusEntrega={salesData.statusEntrega}
            tempoEntregaMedia={salesData.tempoEntregaMedia}
            avaliacaoPorProduto={salesData.avaliacaoPorProduto}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
