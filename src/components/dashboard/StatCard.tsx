
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden transition-all duration-200 card-shadow", className)}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h2 className="text-2xl font-bold tracking-tight">{value}</h2>
          </div>
          <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
        
        {(description || trend) && (
          <div className="mt-4 flex items-center">
            {trend && (
              <span className={cn(
                "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium mr-2",
                trend.positive 
                  ? "bg-green-50 text-green-700" 
                  : "bg-red-50 text-red-700"
              )}>
                {trend.positive ? '+' : ''}{trend.value}%
              </span>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
