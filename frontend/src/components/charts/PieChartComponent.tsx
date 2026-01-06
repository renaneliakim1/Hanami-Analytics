import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatNumber, formatCurrency } from "@/utils/csvParser";

interface PieChartComponentProps {
  data: any[];
  title: string;
  isCurrency?: boolean;
}

const COLORS = [
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

export const PieChartComponent = ({ data, title, isCurrency = false }: PieChartComponentProps) => {
  const formatValue = isCurrency ? formatCurrency : formatNumber;

  const calculatePercentage = (value: number) => {
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
    if (total === 0) return '0%';
    return ((value / total) * 100).toFixed(1) + '%';
  };

  // Check if we have valid data
  const hasData = data && data.length > 0 && data.some(item => item.value > 0);

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

  // Calcular altura da legenda baseado no número de itens
  const legendHeight = Math.max(36, Math.ceil(data.length / 3) * 20 + 16);
  const chartHeight = Math.max(250, 400 - legendHeight);

  return (
    <div className="chart-container h-auto min-h-[400px] flex flex-col overflow-hidden">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={data.length <= 5 ? 
              ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` 
              : false
            }
            labelLine={data.length <= 5}
            isAnimationActive={true}
            animationDuration={1000}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                className="stroke-card"
                strokeWidth={2}
              />
            ))}
          </Pie>
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
            formatter={(value: number, name: string, props: any) => [
              `${formatValue(value)} (${calculatePercentage(value)})`,
              name
            ]}
          />
          <Legend 
            verticalAlign="bottom" 
            height={legendHeight}
            wrapperStyle={{
              paddingTop: '10px',
              overflow: 'visible'
            }}
            formatter={(value) => <span className="text-xs sm:text-sm text-muted-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
