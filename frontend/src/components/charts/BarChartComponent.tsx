import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { formatCurrency, formatNumber } from "@/utils/csvParser";

interface BarChartComponentProps {
  data: any[];
  title: string;
  dataKey: string;
  horizontal?: boolean;
  isCurrency?: boolean;
  colors?: string[];
}

const defaultColors = [
  "#3b82f6",  // blue-500
  "#10b981",  // emerald-500
  "#f59e0b",  // amber-500
  "#8b5cf6",  // violet-500
  "#ec4899",  // pink-500
  "#06b6d4",  // cyan-500
  "#6366f1",  // indigo-500
  "#14b8a6",  // teal-500
  "#d97706",  // amber-600
  "#7c3aed",  // violet-600
];

export const BarChartComponent = ({ 
  data, 
  title, 
  dataKey, 
  horizontal = false,
  isCurrency = false,
  colors = defaultColors 
}: BarChartComponentProps) => {
  const formatValue = isCurrency ? formatCurrency : formatNumber;

  const getDataLabel = (key: string) => {
    const labels: Record<string, string> = {
      quantidade: 'Quantidade',
      lucro: 'Lucro',
      avaliacao: 'Avaliação',
      value: 'Valor'
    };
    return labels[key] || key;
  };

  // Check if we have valid data
  const hasData = data && data.length > 0;

  if (!hasData) {
    return (
      <div className="chart-container h-[400px]">
        <h3 className="text-lg font-semibold mb-6 dark:text-white">{title}</h3>
        <div className="flex items-center justify-center h-[85%]">
          <p className="text-muted-foreground">Nenhum dado disponível</p>
        </div>
      </div>
    );
  }

  // Calcular altura dinamicamente baseado no número de barras
  const chartHeight = Math.max(300, Math.min(600, data.length * 35 + 100));
  // Margem esquerda responsiva: máximo de 200px em desktop, reduzido para mobile
  const maxLabelWidth = Math.max(...data.map((d: any) => (d.name || '').toString().length)) * 7;
  const leftMargin = horizontal ? Math.max(80, Math.min(200, maxLabelWidth)) : 0;

  return (
    <div className="w-full chart-container flex flex-col overflow-hidden">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">{title}</h3>
      <div className="w-full flex-1">
        <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart 
          data={data} 
          layout={horizontal ? "vertical" : "horizontal"}
          margin={horizontal ? { top: 5, right: 30, left: leftMargin, bottom: 5 } : { top: 5, right: 30, left: 20, bottom: 80 }}
          barCategoryGap={horizontal ? "20%" : "5%"}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={!horizontal} />
          {horizontal ? (
            <>
              <XAxis 
                type="number" 
                className="text-muted-foreground"
                fontSize={10}
                tickLine={false}
                width={100}
                tickFormatter={formatValue}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                className="text-muted-foreground"
                fontSize={9}
                tickLine={false}
                width={leftMargin - 10}
                interval={0}
              />
            </>
          ) : (
            <>
              <XAxis 
                dataKey="name" 
                className="text-muted-foreground"
                fontSize={10}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={data.length > 5 ? Math.ceil(data.length / 5) - 1 : 0}
              />
              <YAxis 
                className="text-muted-foreground"
                fontSize={11}
                tickLine={false}
                width={100}
                tickFormatter={formatValue}
              />
            </>
          )}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--popover))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--popover-foreground))',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              padding: '12px'
            }}
            labelStyle={{ 
              color: 'hsl(var(--popover-foreground))',
              fontWeight: 'bold',
              marginBottom: '4px'
            }}
            itemStyle={{
              color: 'hsl(var(--popover-foreground))'
            }}
            formatter={(value: number) => [formatValue(value), getDataLabel(dataKey)]}
            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            animationDuration={200}
          />
          <Bar 
            dataKey={dataKey} 
            radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
            isAnimationActive={true}
            animationDuration={1000}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
