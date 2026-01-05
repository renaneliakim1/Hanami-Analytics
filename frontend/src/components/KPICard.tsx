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
  return (
    <div 
      className="kpi-card opacity-0 animate-slide-up"
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <div className="text-primary">{icon}</div>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-accent' : 'text-destructive'}`}>
            {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
      <p className="kpi-value mb-1">{value}</p>
      <p className="kpi-label">{title}</p>
      
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    </div>
  );
};
