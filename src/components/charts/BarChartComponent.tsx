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
  "hsl(199, 89%, 48%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 67%, 55%)",
  "hsl(340, 75%, 55%)",
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
        <h3 className="text-lg font-semibold mb-6">{title}</h3>
        <div className="flex items-center justify-center h-[85%]">
          <p className="text-muted-foreground">Nenhum dado disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container h-[400px]">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart 
          data={data} 
          layout={horizontal ? "vertical" : "horizontal"}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          {horizontal ? (
            <>
              <XAxis 
                type="number" 
                className="text-muted-foreground"
                fontSize={12}
                tickLine={false}
                tickFormatter={formatValue}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                className="text-muted-foreground"
                fontSize={11}
                tickLine={false}
                width={100}
              />
            </>
          ) : (
            <>
              <XAxis 
                dataKey="name" 
                className="text-muted-foreground"
                fontSize={11}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                className="text-muted-foreground"
                fontSize={12}
                tickLine={false}
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
            radius={[4, 4, 0, 0]}
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
  );
};
