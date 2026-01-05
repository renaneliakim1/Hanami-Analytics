import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/utils/csvParser";

interface AreaChartComponentProps {
  data: any[];
  title: string;
  dataKey: string;
  color?: string;
}

export const AreaChartComponent = ({ data, title, dataKey, color = "hsl(199, 89%, 48%)" }: AreaChartComponentProps) => {
  return (
    <div className="chart-container h-[400px]">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
          <XAxis 
            dataKey="name" 
            stroke="hsl(215, 20%, 55%)" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="hsl(215, 20%, 55%)" 
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(222, 47%, 8%)', 
              border: '1px solid hsl(222, 47%, 16%)',
              borderRadius: '8px',
              color: 'hsl(210, 40%, 98%)'
            }}
            formatter={(value: number) => [formatCurrency(value), '']}
          />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2}
            fill={`url(#gradient-${dataKey})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
