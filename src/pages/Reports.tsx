import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Car, DollarSign, PencilLine, ReceiptText, Trash2, TrendingUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import DashboardCard from '@/components/dashboard/DashboardCard';
import Navbar from '@/components/layout/Navbar';
import PageTransition from '@/components/layout/PageTransition';
import { useReportContext } from '@/context/ReportContext';
import { formatCurrency, formatDistance, formatValuePerKm } from '@/lib/calculations';

const Reports = () => {
  const navigate = useNavigate();
  const { entries, removeEntry } = useReportContext();
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) => {
    return new Date(b.data).getTime() - new Date(a.data).getTime();
  });

  const handleEdit = (id: string) => {
    // Find the entry
    const entry = entries.find(e => e.id === id);
    if (entry) {
      // Navigate to edit page with entry data
      navigate('/nova-entrada', { state: { entry } });
    }
  };

  const handleDelete = () => {
    if (entryToDelete) {
      removeEntry(entryToDelete);
      setEntryToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <AlertDialog open={!!entryToDelete} onOpenChange={(open) => !open && setEntryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Entrada</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta entrada? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <main className="container py-4 sm:py-6 space-y-4 sm:space-y-8">
        <PageTransition>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Relatórios</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Visualize e gerencie seus registros de corridas
              </p>
            </div>
          </div>

          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-16 text-center">
              <div className="bg-primary/10 p-3 sm:p-4 rounded-full">
                <BarChart className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
              </div>
              <h2 className="mt-4 sm:mt-6 text-xl sm:text-2xl font-semibold">Sem dados para exibir</h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-md px-4">
                Adicione entradas para visualizar relatórios detalhados.
              </p>
              <Button 
                onClick={() => navigate('/nova-entrada')} 
                className="mt-4 sm:mt-6 w-full sm:w-auto"
              >
                Adicionar Entrada
              </Button>
            </div>
          ) : (
            <DashboardCard
              title="Histórico de Entradas"
              description="Todos os registros ordenados por data"
            >
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="min-w-[800px] sm:min-w-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Data</TableHead>
                        <TableHead className="w-[120px]">Ganhos</TableHead>
                        <TableHead className="w-[120px]">Despesas</TableHead>
                        <TableHead className="w-[100px]">Distância</TableHead>
                        <TableHead className="w-[80px]">Horas</TableHead>
                        <TableHead className="w-[150px]">Corridas</TableHead>
                        <TableHead className="w-[100px]">Média/KM</TableHead>
                        <TableHead className="w-[120px]">Líquido</TableHead>
                        <TableHead className="w-[100px] text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedEntries.map((entry) => {
                        const lucroLiquido = entry.ganhos - entry.despesas;
                        const totalCorridas = entry.corridas.uber + entry.corridas.noventaENove + entry.corridas.inDriver;
                        
                        return (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium whitespace-nowrap">
                              {format(new Date(entry.data), 'dd/MM/yyyy', { locale: ptBR })}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <DollarSign className="h-4 w-4 text-emerald-500" />
                                <span>{formatCurrency(entry.ganhos)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <ReceiptText className="h-4 w-4 text-red-500" />
                                <span>{formatCurrency(entry.despesas)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <Car className="h-4 w-4 text-blue-500" />
                                <span>{formatDistance(entry.distancia)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <span>{entry.horasTrabalhadas.toFixed(1)}h</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">
                                  Uber: {entry.corridas.uber}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  99: {entry.corridas.noventaENove}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  InDriver: {entry.corridas.inDriver}
                                </span>
                                <span className="text-sm font-medium mt-1">
                                  Total: {totalCorridas}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <TrendingUp className="h-4 w-4 text-purple-500" />
                                <span>{formatCurrency(entry.ganhosPorKm)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <span className={
                                lucroLiquido >= 0 
                                  ? "text-emerald-600 font-medium" 
                                  : "text-red-600 font-medium"
                              }>
                                {formatCurrency(lucroLiquido)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleEdit(entry.id)}
                                >
                                  <PencilLine className="h-4 w-4" />
                                  <span className="sr-only">Editar</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => setEntryToDelete(entry.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Excluir</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </DashboardCard>
          )}
        </PageTransition>
      </main>
    </div>
  );
};

export default Reports;
