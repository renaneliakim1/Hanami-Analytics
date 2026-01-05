import { BarChart3, TrendingUp, Package, Users, CreditCard, Truck, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesRecord } from "@/types/sales";
import { useSalesData } from "@/hooks/useSalesData";
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
  const salesData = useSalesData(data);

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
        </div>
        <div className="flex items-center gap-3">
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
            kpis={salesData.kpis}
            vendasPorMes={salesData.vendasPorMes}
            vendasPorCategoria={salesData.vendasPorCategoria}
          />
        </TabsContent>

        <TabsContent value="sales">
          <SalesTab vendasPorMes={salesData.vendasPorMes} />
        </TabsContent>

        <TabsContent value="products">
          <ProductsTab
            produtosMaisVendidos={salesData.produtosMaisVendidos}
            vendasPorCategoria={salesData.vendasPorCategoria}
            avaliacaoPorProduto={salesData.avaliacaoPorProduto}
          />
        </TabsContent>

        <TabsContent value="customers">
          <CustomersTab
            clientesPorGenero={salesData.clientesPorGenero}
            clientesPorIdade={salesData.clientesPorIdade}
            vendasPorEstado={salesData.vendasPorEstado}
          />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentsTab
            formaPagamento={salesData.formaPagamento}
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
