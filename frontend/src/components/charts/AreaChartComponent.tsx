import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency, formatNumber } from "@/utils/csvParser";

interface AreaChartComponentProps {
  data: any[];
  title: string;
  dataKey: string;
  color?: string;
  isCurrency?: boolean;
}

export const AreaChartComponent = ({ data, title, dataKey, color = "hsl(199, 89%, 48%)", isCurrency = true }: AreaChartComponentProps) => {
  const formatValue = isCurrency ? formatCurrency : formatNumber;

  const getDataLabel = (key: string) => {
    const labels: Record<string, string> = {
      faturamento: 'Faturamento',
      lucro: 'Lucro',
      vendas: 'Vendas'
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

  return (
    <div className="chart-container h-[400px]">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis 
            dataKey="name" 
            className="text-muted-foreground"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            className="text-muted-foreground"
            fontSize={12}
            tickLine={false}
            width={100}
            tickFormatter={(value) => formatValue(value)}
          />
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
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '5 5' }}
            animationDuration={200}
          />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2}
            fill={`url(#gradient-${dataKey})`}
            activeDot={{ r: 6, strokeWidth: 2, stroke: color }}
            isAnimationActive={true}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
