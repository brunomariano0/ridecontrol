
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  children,
  footer,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden transition-all duration-200 card-shadow", className)}>
      <CardHeader className="p-6 pb-3">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-6 pt-3">
        {children}
      </CardContent>
      {footer && (
        <CardFooter className="p-6 pt-0 border-t">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default DashboardCard;
