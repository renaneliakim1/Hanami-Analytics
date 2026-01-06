import { Truck, Clock, AlertTriangle } from "lucide-react";
import { PieChartComponent } from "@/components/charts/PieChartComponent";
import { BarChartComponent } from "@/components/charts/BarChartComponent";

interface LogisticsTabProps {
  statusEntrega: any[];
  tempoEntregaMedia: number;
  avaliacaoPorProduto: any[];
}

export const LogisticsTab = ({ statusEntrega, tempoEntregaMedia, avaliacaoPorProduto }: LogisticsTabProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="kpi-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusEntrega.length}</p>
              <p className="text-sm text-muted-foreground">Status de Entrega</p>
            </div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{tempoEntregaMedia.toFixed(1)} dias</p>
              <p className="text-sm text-muted-foreground">Tempo Médio de Entrega</p>
            </div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{avaliacaoPorProduto.filter(p => p.avaliacao < 3).length}</p>
              <p className="text-sm text-muted-foreground">Produtos com Baixa Avaliação</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartComponent
          data={statusEntrega}
          title="Status das Entregas"
        />
      </div>

      {/* Produtos com Menor Avaliação - Full width */}
      <div className="w-full min-w-0">
        <BarChartComponent
          data={avaliacaoPorProduto}
          title="Produtos com Menor Avaliação"
          dataKey="avaliacao"
          horizontal
          colors={["hsl(0, 84%, 60%)", "hsl(38, 92%, 50%)", "hsl(142, 71%, 45%)"]}
        />
      </div>
    </div>
  );
};
