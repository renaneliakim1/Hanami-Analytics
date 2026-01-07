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

      {/* Charts em 3 colunas - Sem espaço vazio */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <PieChartComponent
            data={statusEntrega}
            title="Status das Entregas"
          />
        </div>
        <div className="col-span-1">
          <BarChartComponent
            data={avaliacaoPorProduto.slice(0, 6)}
            title="Produtos - Avaliação Baixa"
            dataKey="value"
            colors={["hsl(0, 84%, 60%)"]}
          />
        </div>
        <div className="col-span-1">
          <div className="kpi-card h-full flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">Resumo de Avaliações</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Excelente (4-5):</span>
                  <span className="font-semibold text-green-600">{avaliacaoPorProduto.filter((p: any) => p.value >= 4).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Bom (3-4):</span>
                  <span className="font-semibold text-blue-600">{avaliacaoPorProduto.filter((p: any) => p.value >= 3 && p.value < 4).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Ruim (&lt;3):</span>
                  <span className="font-semibold text-red-600">{avaliacaoPorProduto.filter((p: any) => p.value < 3).length}</span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Média:</span>
                  <span className="text-lg font-bold">{(avaliacaoPorProduto.reduce((sum: number, p: any) => sum + p.value, 0) / avaliacaoPorProduto.length).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Todos os Produtos - Full width */}
      <div className="w-full min-w-0">
        <BarChartComponent
          data={avaliacaoPorProduto}
          title="Todos os Produtos - Avaliação"
          dataKey="value"
          horizontal
          colors={["hsl(0, 84%, 60%)", "hsl(38, 92%, 50%)", "hsl(142, 71%, 45%)"]}
        />
      </div>
    </div>
  );
};
