import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatNumber, formatCurrency } from "@/utils/csvParser";

interface PieChartComponentProps {
  data: any[];
  title: string;
  isCurrency?: boolean;
}

const COLORS = [
  "hsl(199, 89%, 48%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 67%, 55%)",
  "hsl(340, 75%, 55%)",
  "hsl(180, 70%, 45%)",
  "hsl(60, 70%, 50%)",
  "hsl(320, 70%, 50%)",
];

export const PieChartComponent = ({ data, title, isCurrency = false }: PieChartComponentProps) => {
  const formatValue = isCurrency ? formatCurrency : formatNumber;

  return (
    <div className="chart-container h-[400px]">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
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
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
            formatter={(value: number) => [formatValue(value), '']}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-muted-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
