import { BarChartComponent } from "@/components/charts/BarChartComponent";
import { PieChartComponent } from "@/components/charts/PieChartComponent";

interface PaymentsTabProps {
  formaPagamento: any[];
  parcelamentoMedio: any[];
}

export const PaymentsTab = ({ formaPagamento, parcelamentoMedio }: PaymentsTabProps) => {
  const pagamentoQuantidade = formaPagamento.map(p => ({
    name: p.name,
    value: p.value
  }));

  const pagamentoValorMedio = formaPagamento.map(p => ({
    name: p.name,
    value: p.revenue || 0
  }));

  const paymentColors = [
    "#3b82f6",  // blue-500
    "#10b981",  // emerald-500
    "#f59e0b",  // amber-500
    "#8b5cf6",  // violet-500
    "#ec4899",  // pink-500
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartComponent
          data={pagamentoQuantidade}
          title="Formas de Pagamento Mais Usadas"
        />
        <BarChartComponent
          data={pagamentoValorMedio}
          title="Valor Médio por Forma de Pagamento"
          dataKey="value"
          isCurrency
          colors={paymentColors}
        />
      </div>
      <PieChartComponent
        data={parcelamentoMedio}
        title="Distribuição de Parcelamento"
      />
    </div>
  );
};
