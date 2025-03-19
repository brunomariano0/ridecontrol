import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Entry {
  id: string;
  data: Date;
  ganhos: number;
  despesas: number;
  distancia: number;
  ganhosPorKm: number;
  horasTrabalhadas: number;
  corridas: {
    uber: number;
    noventaENove: number;
    inDriver: number;
  };
}

interface ReportContextType {
  entries: Entry[];
  addEntry: (entry: Entry) => void;
  removeEntry: (id: string) => void;
  getMonthlyStats: () => {
    ganhosTotais: number;
    despesasTotais: number;
    distanciaTotal: number;
    ganhosMediosPorKm: number;
    lucroLiquido: number;
    horasTrabalhadasTotal: number;
    corridasTotais: {
      uber: number;
      noventaENove: number;
      inDriver: number;
    };
    ganhosMediosPorCorrida: number;
    ganhosPorHora: number;
    lucroPorKm: number;
  };
  getDailyStats: (date: Date) => {
    ganhos: number;
    despesas: number;
    distancia: number;
    ganhosPorKm: number;
    lucroLiquido: number;
  } | null;
  getWeeklyStats: () => {
    corridasTotais: {
      uber: number;
      noventaENove: number;
      inDriver: number;
    };
  };
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

const STORAGE_KEY = 'ride-report-entries';

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<Entry[]>(() => {
    // Load entries from localStorage
    const storedEntries = localStorage.getItem(STORAGE_KEY);
    if (storedEntries) {
      try {
        // Parse dates back to Date objects
        return JSON.parse(storedEntries, (key, value) => {
          if (key === 'data') return new Date(value);
          return value;
        });
      } catch (e) {
        console.error('Erro ao carregar entradas:', e);
        return [];
      }
    }
    return [];
  });

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry: Entry) => {
    setEntries(prev => {
      // Check if an entry for the same date already exists
      const existingEntryIndex = prev.findIndex(
        e => new Date(e.data).toDateString() === new Date(entry.data).toDateString()
      );
      
      if (existingEntryIndex >= 0) {
        // Replace existing entry
        const updatedEntries = [...prev];
        updatedEntries[existingEntryIndex] = entry;
        return updatedEntries;
      } else {
        // Add new entry
        return [...prev, entry];
      }
    });
  };

  const removeEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const getMonthlyStats = () => {
    if (entries.length === 0) {
      return {
        ganhosTotais: 0,
        despesasTotais: 0,
        distanciaTotal: 0,
        ganhosMediosPorKm: 0,
        lucroLiquido: 0,
        horasTrabalhadasTotal: 0,
        corridasTotais: {
          uber: 0,
          noventaENove: 0,
          inDriver: 0,
        },
        ganhosMediosPorCorrida: 0,
        ganhosPorHora: 0,
        lucroPorKm: 0,
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter entries for the current month
    const monthEntries = entries.filter(entry => {
      const entryDate = new Date(entry.data);
      return entryDate.getMonth() === currentMonth && 
             entryDate.getFullYear() === currentYear;
    });

    // Calculate totals
    const ganhosTotais = monthEntries.reduce((sum, entry) => sum + entry.ganhos, 0);
    const despesasTotais = monthEntries.reduce((sum, entry) => sum + entry.despesas, 0);
    const distanciaTotal = monthEntries.reduce((sum, entry) => sum + entry.distancia, 0);
    const horasTrabalhadasTotal = monthEntries.reduce((sum, entry) => sum + entry.horasTrabalhadas, 0);
    
    const corridasTotais = monthEntries.reduce((acc, entry) => ({
      uber: acc.uber + entry.corridas.uber,
      noventaENove: acc.noventaENove + entry.corridas.noventaENove,
      inDriver: acc.inDriver + entry.corridas.inDriver,
    }), { uber: 0, noventaENove: 0, inDriver: 0 });

    const totalCorridas = corridasTotais.uber + corridasTotais.noventaENove + corridasTotais.inDriver;
    
    // Calculate average earnings per km
    const ganhosMediosPorKm = distanciaTotal > 0 ? ganhosTotais / distanciaTotal : 0;
    const ganhosMediosPorCorrida = totalCorridas > 0 ? ganhosTotais / totalCorridas : 0;
    const ganhosPorHora = horasTrabalhadasTotal > 0 ? ganhosTotais / horasTrabalhadasTotal : 0;
    const lucroPorKm = distanciaTotal > 0 ? (ganhosTotais - despesasTotais) / distanciaTotal : 0;

    const lucroLiquido = ganhosTotais - despesasTotais;

    return {
      ganhosTotais,
      despesasTotais,
      distanciaTotal,
      ganhosMediosPorKm,
      lucroLiquido,
      horasTrabalhadasTotal,
      corridasTotais,
      ganhosMediosPorCorrida,
      ganhosPorHora,
      lucroPorKm,
    };
  };

  const getDailyStats = (date: Date) => {
    const targetDateStr = new Date(date).toDateString();
    
    const entry = entries.find(
      e => new Date(e.data).toDateString() === targetDateStr
    );

    if (!entry) return null;

    return {
      ganhos: entry.ganhos,
      despesas: entry.despesas,
      distancia: entry.distancia,
      ganhosPorKm: entry.ganhosPorKm,
      lucroLiquido: entry.ganhos - entry.despesas,
    };
  };

  const getWeeklyStats = () => {
    if (entries.length === 0) {
      return {
        corridasTotais: {
          uber: 0,
          noventaENove: 0,
          inDriver: 0,
        }
      };
    }

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Domingo
    startOfWeek.setHours(0, 0, 0, 0);

    // Filter entries for the current week
    const weekEntries = entries.filter(entry => {
      const entryDate = new Date(entry.data);
      return entryDate >= startOfWeek;
    });

    const corridasTotais = weekEntries.reduce((acc, entry) => ({
      uber: acc.uber + entry.corridas.uber,
      noventaENove: acc.noventaENove + entry.corridas.noventaENove,
      inDriver: acc.inDriver + entry.corridas.inDriver,
    }), { uber: 0, noventaENove: 0, inDriver: 0 });

    return {
      corridasTotais
    };
  };

  return (
    <ReportContext.Provider 
      value={{ 
        entries, 
        addEntry, 
        removeEntry, 
        getMonthlyStats,
        getWeeklyStats,
        getDailyStats 
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReportContext = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReportContext must be used within a ReportProvider');
  }
  return context;
};
