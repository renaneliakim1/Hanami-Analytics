import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: number;
  delay?: number;
}

export const KPICard = ({ title, value, icon, trend, delay = 0 }: KPICardProps) => {
  const colors = [
    { bg: 'bg-blue-50', darkBg: 'rgb(25, 28, 37)', icon: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
    { bg: 'bg-green-50', darkBg: 'rgb(25, 28, 37)', icon: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
    { bg: 'bg-orange-50', darkBg: 'rgb(25, 28, 37)', icon: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
    { bg: 'bg-purple-50', darkBg: 'rgb(25, 28, 37)', icon: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
    { bg: 'bg-pink-50', darkBg: 'rgb(25, 28, 37)', icon: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800' },
    { bg: 'bg-indigo-50', darkBg: 'rgb(25, 28, 37)', icon: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800' },
  ];
  
  const colorScheme = colors[delay % colors.length];

  return (
    <div 
      className={`kpi-card opacity-0 animate-slide-up border-2 ${colorScheme.border} ${colorScheme.bg}`}
      style={{ animationDelay: `${delay * 0.1}s`, backgroundColor: `var(--kpi-bg-${delay % 6})` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl ${colorScheme.bg} flex items-center justify-center border-2 ${colorScheme.border}`} style={{ backgroundColor: `var(--kpi-bg-${delay % 6})` }}>
          <div className={`text-xl ${colorScheme.icon}`}>{icon}</div>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
      <p className="kpi-value mb-2 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="kpi-label text-sm font-medium text-gray-700 dark:text-gray-300">{title}</p>
    </div>
  );
};
