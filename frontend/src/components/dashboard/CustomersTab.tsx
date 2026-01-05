import { PieChartComponent } from "@/components/charts/PieChartComponent";
import { BarChartComponent } from "@/components/charts/BarChartComponent";

interface CustomersTabProps {
  clientesPorGenero: any[];
  clientesPorIdade: any[];
  vendasPorEstado: any[];
}

export const CustomersTab = ({ clientesPorGenero, clientesPorIdade, vendasPorEstado }: CustomersTabProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartComponent
          data={clientesPorGenero}
          title="Distribuição por Gênero"
        />
        <BarChartComponent
          data={clientesPorIdade}
          title="Distribuição por Faixa Etária"
          dataKey="value"
        />
      </div>
      <BarChartComponent
        data={vendasPorEstado}
        title="Top 10 Estados por Faturamento"
        dataKey="value"
        isCurrency
      />
    </div>
  );
};
