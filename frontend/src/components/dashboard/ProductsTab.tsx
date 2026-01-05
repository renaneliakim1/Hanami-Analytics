import { BarChartComponent } from "@/components/charts/BarChartComponent";
import { PieChartComponent } from "@/components/charts/PieChartComponent";

interface ProductsTabProps {
  produtosMaisVendidos: any[];
  vendasPorCategoria: any[];
  avaliacaoPorProduto: any[];
}

export const ProductsTab = ({ produtosMaisVendidos, vendasPorCategoria, avaliacaoPorProduto }: ProductsTabProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartComponent
          data={produtosMaisVendidos}
          title="Top 10 Produtos Mais Vendidos"
          dataKey="quantidade"
          horizontal
        />
        <PieChartComponent
          data={vendasPorCategoria}
          title="Vendas por Categoria"
          isCurrency
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartComponent
          data={produtosMaisVendidos}
          title="Lucro por Produto (Top 10)"
          dataKey="lucro"
          horizontal
          isCurrency
          colors={["hsl(142, 71%, 45%)"]}
        />
        <BarChartComponent
          data={avaliacaoPorProduto}
          title="Produtos com Menor Avaliação"
          dataKey="avaliacao"
          horizontal
          colors={["hsl(0, 84%, 60%)"]}
        />
      </div>
    </div>
  );
};
