import { BarChartComponent } from "@/components/charts/BarChartComponent";
import { PieChartComponent } from "@/components/charts/PieChartComponent";

interface PaymentsTabProps {
  formaPagamento: any[];
  parcelamentoMedio: any[];
}

export const PaymentsTab = ({ formaPagamento, parcelamentoMedio }: PaymentsTabProps) => {
  const pagamentoQuantidade = formaPagamento.map(p => ({
    name: p.name,
    value: p.quantidade
  }));

  const pagamentoValorMedio = formaPagamento.map(p => ({
    name: p.name,
    value: p.valorMedio || 0
  }));

  const paymentColors = [
    "hsl(199, 89%, 48%)",
    "hsl(142, 71%, 45%)",
    "hsl(38, 92%, 50%)",
    "hsl(280, 67%, 55%)",
    "hsl(340, 75%, 55%)",
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
