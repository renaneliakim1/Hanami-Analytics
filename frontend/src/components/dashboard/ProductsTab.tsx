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
      {/* Vendas por Categoria + Top 5 em 3 colunas */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <PieChartComponent
            data={vendasPorCategoria}
            title="Vendas por Categoria"
            isCurrency
          />
        </div>
        <div className="col-span-1">
          <BarChartComponent
            data={produtosMaisVendidos.slice(0, 5)}
            title="Top 5 por Quantidade"
            dataKey="quantidade"
            colors={["hsl(200, 100%, 50%)"]}
          />
        </div>
        <div className="col-span-1">
          <BarChartComponent
            data={produtosMaisVendidos.slice(0, 5)}
            title="Top 5 por Lucro"
            dataKey="lucro"
            isCurrency
            colors={["hsl(142, 71%, 45%)"]}
          />
        </div>
      </div>

      {/* Top 10 Produtos Mais Vendidos - Full width */}
      <div className="w-full min-w-0">
        <BarChartComponent
          data={produtosMaisVendidos}
          title="Top 10 Produtos Mais Vendidos"
          dataKey="quantidade"
          horizontal
        />
      </div>

      {/* Lucro e Avaliação side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <div className="w-full min-w-0">
          <BarChartComponent
            data={produtosMaisVendidos}
            title="Lucro por Produto (Top 10)"
            dataKey="lucro"
            horizontal
            isCurrency
            colors={["hsl(142, 71%, 45%)"]}
          />
        </div>
        <div className="w-full min-w-0">
          <BarChartComponent
            data={avaliacaoPorProduto}
            title="Produtos com Menor Avaliação"
            dataKey="avaliacao"
            horizontal
            colors={["hsl(0, 84%, 60%)"]}
          />
        </div>
      </div>
    </div>
  );
};
