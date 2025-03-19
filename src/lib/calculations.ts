import { Entry } from '@/context/ReportContext';
import { format, isToday, isThisMonth, isThisWeek, isThisYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Calculate earnings per km
export const calculateEarningsPerKm = (
  earnings: number, 
  expenses: number, 
  distance: number
): number => {
  return distance > 0 ? earnings / distance : 0;
};

// Format currency amount as BRL
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Format distance with KM suffix
export const formatDistance = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'unit',
    unit: 'kilometer',
  }).format(value);
};

// Format value per km (earnings/km)
export const formatValuePerKm = (value: number) => {
  return `${formatCurrency(value)}/km`;
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

// Format date based on how recent it is
export const formatSmartDate = (date: Date): string => {
  if (isToday(date)) {
    return 'Hoje';
  }
  
  if (isThisWeek(date)) {
    return format(date, "EEEE", { locale: ptBR });
  }
  
  if (isThisMonth(date)) {
    return format(date, "d 'de' MMMM", { locale: ptBR });
  }
  
  if (isThisYear(date)) {
    return format(date, "d 'de' MMMM", { locale: ptBR });
  }
  
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
};

// Calculate statistics for a group of entries
export const calculateStats = (entries: Entry[]) => {
  if (entries.length === 0) {
    return {
      totalEarnings: 0,
      totalExpenses: 0,
      totalDistance: 0,
      netEarnings: 0,
      averageEarningsPerKm: 0,
    };
  }

  const totalEarnings = entries.reduce((sum, entry) => sum + entry.earnings, 0);
  const totalExpenses = entries.reduce((sum, entry) => sum + entry.expenses, 0);
  const totalDistance = entries.reduce((sum, entry) => sum + entry.distance, 0);
  const netEarnings = totalEarnings - totalExpenses;
  const averageEarningsPerKm = totalDistance > 0 ? totalEarnings / totalDistance : 0;

  return {
    totalEarnings,
    totalExpenses,
    totalDistance,
    netEarnings,
    averageEarningsPerKm,
  };
};

// Group entries by a time period (day, week, month, year)
export const groupEntriesByPeriod = (
  entries: Entry[],
  period: 'day' | 'week' | 'month' | 'year'
) => {
  const groups: { [key: string]: Entry[] } = {};

  entries.forEach(entry => {
    const date = new Date(entry.date);
    let key = '';

    switch (period) {
      case 'day':
        key = format(date, 'yyyy-MM-dd');
        break;
      case 'week':
        // Get the week number and year
        const weekNumber = Math.ceil(date.getDate() / 7);
        key = `${date.getFullYear()}-${date.getMonth() + 1}-W${weekNumber}`;
        break;
      case 'month':
        key = format(date, 'yyyy-MM');
        break;
      case 'year':
        key = format(date, 'yyyy');
        break;
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(entry);
  });

  return groups;
};

export const formatHours = (value: number) => {
  return `${value.toFixed(1)}h`;
};

export const formatRides = (value: number) => {
  return `${value} corridas`;
};

// Group entries by date
export const groupEntriesByDate = (entries: Entry[]) => {
  const groups = entries.reduce((acc, entry) => {
    const date = format(new Date(entry.data), 'dd/MM/yyyy');
    if (!acc[date]) {
      acc[date] = {
        date,
        ganhos: 0,
        despesas: 0,
        distancia: 0,
        corridas: {
          uber: 0,
          noventaENove: 0,
          inDriver: 0,
        },
      };
    }
    acc[date].ganhos += entry.ganhos;
    acc[date].despesas += entry.despesas;
    acc[date].distancia += entry.distancia;
    acc[date].corridas.uber += entry.corridas.uber;
    acc[date].corridas.noventaENove += entry.corridas.noventaENove;
    acc[date].corridas.inDriver += entry.corridas.inDriver;
    return acc;
  }, {} as Record<string, {
    date: string;
    ganhos: number;
    despesas: number;
    distancia: number;
    corridas: {
      uber: number;
      noventaENove: number;
      inDriver: number;
    };
  }>);

  return Object.values(groups).sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split('/').map(Number);
    const [dayB, monthB, yearB] = b.date.split('/').map(Number);
    return new Date(yearB, monthB - 1, dayB).getTime() - new Date(yearA, monthA - 1, dayA).getTime();
  });
};
