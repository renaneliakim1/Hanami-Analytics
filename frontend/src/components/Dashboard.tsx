import { BarChart3, TrendingUp, Package, Users, CreditCard, Truck, Upload, Printer, FileSpreadsheet, FileText, Download, ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SalesRecord } from "@/types/sales";
import { useSalesData } from "@/hooks/useSalesData";
import { useFilteredSalesData } from "@/hooks/useFilteredSalesData";
import { useApiReport } from "@/hooks/useApiReport";
import { useExportReport } from "@/hooks/useExportReport";
import { OverviewTab } from "./dashboard/OverviewTab";
import { SalesTab } from "./dashboard/SalesTab";
import { ProductsTab } from "./dashboard/ProductsTab";
import { CustomersTab } from "./dashboard/CustomersTab";
import { PaymentsTab } from "./dashboard/PaymentsTab";
import { LogisticsTab } from "./dashboard/LogisticsTab";
import { DateRangePicker } from "./DateRangePicker";
import { ThemeToggle } from "./ThemeToggle";
import { ActionMenu } from "./ActionMenu";
import { formatNumber, formatCurrency } from "@/utils/csvParser";
import { useState, useEffect } from "react";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DashboardProps {
  data: SalesRecord[];
  onReset: () => void;
  initialDateRange?: { startDate: string; endDate: string } | null;
}

export const Dashboard = ({ data, onReset, initialDateRange }: DashboardProps) => {
  const [startDate, setStartDate] = useState<string>(initialDateRange?.startDate || "");
  const [endDate, setEndDate] = useState<string>(initialDateRange?.endDate || "");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  
  // Dados originais sem filtro
  const salesData = useSalesData(data);
  
  // Dados filtrados por data e região
  const filteredSalesData = useFilteredSalesData(data, selectedRegion || undefined, startDate || undefined, endDate || undefined);
  
  // Dados da API (quando disponível)
  const apiData = useApiReport(startDate || undefined, endDate || undefined, selectedRegion || undefined);
  
  // Hook de exportação
  const { exportCSV, exportExcel, isExporting, error: exportError } = useExportReport();
  
  // Determinar se há filtro ativo (data ou região)
  const hasDateFilter = startDate || endDate;
  const hasRegionFilter = selectedRegion;
  const hasAnyFilter = hasDateFilter || hasRegionFilter;

  // IMPORTANTE: Sempre usar dados filtrados quando há filtro (API é fallback)
  // Dados filtrados locais são mais confiáveis que a API
  const shouldUseFiltered = hasAnyFilter;
  
  // Priorizar: Dados Filtrados Locais (quando há filtro) > API > Dados Originais
  const kpis = shouldUseFiltered
    ? filteredSalesData.kpis
    : (apiData.kpis && hasAnyFilter ? {
        faturamentoTotal: apiData.kpis.faturamento_total || 0,
        lucroTotal: apiData.kpis.lucro_total || 0,
        quantidadeVendas: apiData.kpis.total_vendas || 0,
        clientesUnicos: apiData.kpis.clientes_unicos || 0,
        ticketMedio: apiData.kpis.ticket_medio || 0,
        avaliacaoMedia: apiData.kpis.avaliacao_media || 0,
      } : salesData.kpis);

  const vendasPorMes = shouldUseFiltered
    ? filteredSalesData.vendasPorMes
    : (apiData.monthlySales.length > 0 && hasAnyFilter
      ? apiData.monthlySales.map(m => ({
          name: m.mes,
          faturamento: m.faturamento || 0,
          lucro: m.lucro || 0,
          vendas: m.vendas || 0
        }))
      : salesData.vendasPorMes);

  const vendasPorCategoria = shouldUseFiltered
    ? filteredSalesData.vendasPorCategoria
    : (apiData.salesByCategory.length > 0 && hasAnyFilter
      ? apiData.salesByCategory
      : salesData.vendasPorCategoria);

  const produtosMaisVendidos = shouldUseFiltered
    ? filteredSalesData.produtosMaisVendidos
    : (apiData.topProducts.length > 0 && hasAnyFilter
      ? apiData.topProducts
      : salesData.produtosMaisVendidos);

  const clientesPorGenero = shouldUseFiltered
    ? filteredSalesData.clientesPorGenero
    : (apiData.customersByGender.length > 0 && hasAnyFilter
      ? apiData.customersByGender
      : salesData.clientesPorGenero);

  const vendasPorEstado = shouldUseFiltered
    ? filteredSalesData.vendasPorEstado
    : (apiData.salesByState.length > 0 && hasAnyFilter
      ? apiData.salesByState
      : salesData.vendasPorEstado);

  const formaPagamento = shouldUseFiltered
    ? filteredSalesData.formaPagamento
    : (apiData.paymentMethods.length > 0 && hasAnyFilter
      ? apiData.paymentMethods
      : salesData.formaPagamento);

  const clientesPorIdade = shouldUseFiltered
    ? filteredSalesData.clientesPorIdade
    : (apiData.customersByAge.length > 0 && hasAnyFilter
      ? apiData.customersByAge
      : salesData.clientesPorIdade);

  const parcelamentoMedio = shouldUseFiltered
    ? filteredSalesData.parcelamentoMedio
    : (apiData.installments.length > 0 && hasAnyFilter
      ? apiData.installments
      : salesData.parcelamentoMedio);

  const statusEntrega = shouldUseFiltered
    ? filteredSalesData.statusEntrega
    : (apiData.deliveryStatus.length > 0 && hasAnyFilter
      ? apiData.deliveryStatus
      : salesData.statusEntrega);

  const avaliacaoPorProduto = shouldUseFiltered
    ? filteredSalesData.avaliacaoPorProduto
    : (apiData.productRatings.length > 0 && hasAnyFilter
      ? apiData.productRatings
      : salesData.avaliacaoPorProduto);

  const tempoEntregaMedia = apiData.averageDeliveryTime?.tempo_medio || 0;

  // Log de rastreamento detalhado
  useEffect(() => {
    console.log('📊 DASHBOARD - RASTREAMENTO COMPLETO:', {
      filtrosAplicados: {
        startDate: startDate || 'Nenhuma',
        endDate: endDate || 'Nenhuma',
        region: selectedRegion || 'Todas as Regiões',
        hasAnyFilter,
      },
      dataSourceAtual: shouldUseFiltered ? '✅ Dados Filtrados Locais' : (apiData.loading ? '⏳ Carregando API' : '📄 Dados Originais'),
      estatisticas: {
        registrosFiltrados: filteredSalesData.kpis.quantidadeVendas,
        registrosOriginais: salesData.kpis.quantidadeVendas,
        registrosAPI: apiData.kpis?.total_vendas || 0,
      },
      graficos: {
        vendasPorMes: filteredSalesData.vendasPorMes.length,
        vendasPorCategoria: filteredSalesData.vendasPorCategoria.length,
        produtosMaisVendidos: filteredSalesData.produtosMaisVendidos.length,
        clientesPorGenero: filteredSalesData.clientesPorGenero.length,
        vendasPorEstado: filteredSalesData.vendasPorEstado.length,
        formaPagamento: filteredSalesData.formaPagamento.length,
        clientesPorIdade: filteredSalesData.clientesPorIdade.length,
        parcelamentoMedio: filteredSalesData.parcelamentoMedio.length,
        statusEntrega: filteredSalesData.statusEntrega.length,
        avaliacaoPorProduto: filteredSalesData.avaliacaoPorProduto.length,
      },
      kpis: {
        faturamentoTotal: kpis.faturamentoTotal,
        lucroTotal: kpis.lucroTotal,
        quantidadeVendas: kpis.quantidadeVendas,
        clientesUnicos: kpis.clientesUnicos,
        ticketMedio: kpis.ticketMedio,
        avaliacaoMedia: kpis.avaliacaoMedia,
      },
    });
  }, [startDate, endDate, selectedRegion, shouldUseFiltered, apiData.loading]);

  const handlePrint = () => {
    // Usar o print nativo do navegador que respeita CSS de impressão
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleExportCSV = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    try {
      await exportCSV({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        region: selectedRegion || undefined,
      });
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
    }
  };

  const handleExportExcel = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    try {
      await exportExcel({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        region: selectedRegion || undefined,
      });
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
    }
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
    <div className="min-h-screen p-6 lg:p-8 relative">
      {/* Mobile Menu - Top right corner (< 670px) */}
      <div className="absolute top-4 right-4 z-50 min-[670px]:hidden no-print">
        <ActionMenu
          onExportCSV={handleExportCSV}
          onExportExcel={handleExportExcel}
          onPrint={handlePrint}
          onNewUpload={onReset}
          isExporting={isExporting}
        />
      </div>

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
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground">
              {formatNumber(data.length)} registros carregados
            </p>
            {hasAnyFilter && (
              <div className="flex gap-2">
                {startDate && endDate && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-semibold">
                    📅 {format(parse(startDate, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy', { locale: ptBR })} → {format(parse(endDate, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                )}
                {selectedRegion && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold">
                    🗺️ {selectedRegion}
                  </span>
                )}
              </div>
            )}
          </div>
          {apiData.loading && <p className="text-sm text-blue-600 mt-1">📡 Carregando dados do servidor...</p>}
        </div>
        
        {/* Desktop Actions - Hidden on mobile (< 670px) */}
        <div className="hidden min-[670px]:flex items-center gap-3 no-print">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm font-medium text-white"
                title="Exportar relatório"
                type="button"
              >
                <Download className="w-4 h-4" />
                {isExporting ? "Exportando..." : "Exportar"}
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  if (!isExporting) {
                    handleExportCSV();
                  }
                }}
                disabled={isExporting}
              >
                <FileText className="w-4 h-4 mr-2" />
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  if (!isExporting) {
                    handleExportExcel();
                  }
                }}
                disabled={isExporting}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

      {/* Error Alert for Export */}
      {exportError && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg no-print">
          <p className="font-semibold">Erro na exportação:</p>
          <p>{exportError}</p>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6 max-[670px]:pb-24">
        {/* Desktop: tabs no topo | Mobile: tabs no rodapé */}
        <div className="hidden min-[670px]:flex sticky top-0 z-40 justify-center py-4 bg-gradient-to-b from-background to-background/95 backdrop-blur-sm border-b">
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
        
        {/* Tabs fixas no rodapé para mobile */}
        <div className="max-[670px]:flex max-[670px]:fixed max-[670px]:bottom-0 max-[670px]:left-0 max-[670px]:right-0 max-[670px]:z-50 max-[670px]:justify-center max-[670px]:py-2 max-[670px]:bg-background max-[670px]:border-t max-[670px]:shadow-lg hidden">
          <TabsList className="glass-card p-1 inline-flex overflow-x-auto max-w-full">
            {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="tab-modern flex flex-col items-center gap-1 data-[state=active]:bg-primary/10 rounded-lg min-w-[60px] text-xs"
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px]">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        </div>

        {/* Date Range Picker */}
        <div className="mb-6 no-print">
          <DateRangePicker 
            onDateChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            onRegionChange={(region) => {
              setSelectedRegion(region);
            }}
            initialStartDate={startDate}
            initialEndDate={endDate}
            initialRegion={selectedRegion}
          />
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
