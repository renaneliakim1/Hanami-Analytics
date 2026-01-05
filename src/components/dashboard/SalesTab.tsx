import { AreaChartComponent } from "@/components/charts/AreaChartComponent";

interface SalesTabProps {
  vendasPorMes: any[];
}

export const SalesTab = ({ vendasPorMes }: SalesTabProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaChartComponent
          data={vendasPorMes}
          title="Evolução do Faturamento"
          dataKey="faturamento"
          color="hsl(199, 89%, 48%)"
        />
        <AreaChartComponent
          data={vendasPorMes}
          title="Evolução do Lucro"
          dataKey="lucro"
          color="hsl(142, 71%, 45%)"
        />
      </div>
      <AreaChartComponent
        data={vendasPorMes}
        title="Quantidade de Vendas por Mês"
        dataKey="vendas"
        color="hsl(38, 92%, 50%)"
      />
    </div>
  );
};
