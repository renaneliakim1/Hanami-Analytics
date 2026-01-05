import { DollarSign, TrendingUp, ShoppingCart, Users, Receipt, Star } from "lucide-react";
import { KPICard } from "@/components/KPICard";
import { AreaChartComponent } from "@/components/charts/AreaChartComponent";
import { PieChartComponent } from "@/components/charts/PieChartComponent";
import { KPIData } from "@/types/sales";
import { formatCurrency, formatNumber } from "@/utils/csvParser";

interface OverviewTabProps {
  kpis: KPIData;
  vendasPorMes: any[];
  vendasPorCategoria: any[];
}

export const OverviewTab = ({ kpis, vendasPorMes, vendasPorCategoria }: OverviewTabProps) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Faturamento Total"
          value={formatCurrency(kpis.faturamentoTotal)}
          icon={<DollarSign className="w-6 h-6" />}
          delay={0}
        />
        <KPICard
          title="Lucro Total"
          value={formatCurrency(kpis.lucroTotal)}
          icon={<TrendingUp className="w-6 h-6" />}
          delay={1}
        />
        <KPICard
          title="Quantidade de Vendas"
          value={formatNumber(kpis.quantidadeVendas)}
          icon={<ShoppingCart className="w-6 h-6" />}
          delay={2}
        />
        <KPICard
          title="Clientes Únicos"
          value={formatNumber(kpis.clientesUnicos)}
          icon={<Users className="w-6 h-6" />}
          delay={3}
        />
        <KPICard
          title="Ticket Médio"
          value={formatCurrency(kpis.ticketMedio)}
          icon={<Receipt className="w-6 h-6" />}
          delay={4}
        />
        <KPICard
          title="Avaliação Média"
          value={kpis.avaliacaoMedia.toFixed(1)}
          icon={<Star className="w-6 h-6" />}
          delay={5}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaChartComponent
          data={vendasPorMes}
          title="Faturamento Mensal"
          dataKey="faturamento"
        />
        <PieChartComponent
          data={vendasPorCategoria}
          title="Vendas por Categoria"
          isCurrency
        />
      </div>
    </div>
  );
};
