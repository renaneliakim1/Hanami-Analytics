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

  return (
    <div className="chart-container h-[400px]">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart 
          data={data} 
          layout={horizontal ? "vertical" : "horizontal"}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
          {horizontal ? (
            <>
              <XAxis 
                type="number" 
                stroke="hsl(215, 20%, 55%)" 
                fontSize={12}
                tickLine={false}
                tickFormatter={formatValue}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="hsl(215, 20%, 55%)" 
                fontSize={11}
                tickLine={false}
                width={100}
              />
            </>
          ) : (
            <>
              <XAxis 
                dataKey="name" 
                stroke="hsl(215, 20%, 55%)" 
                fontSize={11}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="hsl(215, 20%, 55%)" 
                fontSize={12}
                tickLine={false}
                tickFormatter={formatValue}
              />
            </>
          )}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(222, 47%, 8%)', 
              border: '1px solid hsl(222, 47%, 16%)',
              borderRadius: '8px',
              color: 'hsl(210, 40%, 98%)'
            }}
            formatter={(value: number) => [formatValue(value), '']}
          />
          <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
