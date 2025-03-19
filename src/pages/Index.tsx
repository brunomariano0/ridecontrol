import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, DollarSign, ReceiptText, TrendingUp, BarChart3, PlusCircle, Clock, Timer, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/dashboard/StatCard';
import DashboardCard from '@/components/dashboard/DashboardCard';
import Navbar from '@/components/layout/Navbar';
import PageTransition from '@/components/layout/PageTransition';
import { useReportContext } from '@/context/ReportContext';
import { formatCurrency, formatDistance, formatValuePerKm } from '@/lib/calculations';

const Index = () => {
  const navigate = useNavigate();
  const { entries, getMonthlyStats, getWeeklyStats } = useReportContext();
  
  const stats = getMonthlyStats();
  const hasEntries = entries.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-4 sm:py-6 space-y-4 sm:space-y-8">
        <PageTransition>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 sm:mb-3">Painel de Controle</h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-2 sm:mb-3">
                Acompanhe seus ganhos e despesas como motorista de aplicativo
              </p>
            </div>
            
            <Button 
              onClick={() => navigate('/nova-entrada')}
              className="w-full sm:w-auto flex items-center justify-center"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Entrada
            </Button>
          </div>

          {!hasEntries ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-16 text-center">
              <div className="bg-primary/10 p-3 sm:p-4 rounded-full">
                <Car className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
              </div>
              <h2 className="mt-4 sm:mt-6 text-xl sm:text-2xl font-semibold">Sem dados registrados</h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-md px-4">
                Adicione sua primeira entrada para visualizar estatísticas e relatórios.
              </p>
              <Button 
                onClick={() => navigate('/nova-entrada')} 
                className="mt-4 sm:mt-6 w-full sm:w-auto"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Entrada
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Ganhos do Mês"
                  value={formatCurrency(stats.ganhosTotais)}
                  icon={<DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />}
                  description="Total bruto recebido"
                  className="bg-gradient-to-br from-sky-50 to-white mb-4"
                />
                <StatCard
                  title="Despesas do Mês"
                  value={formatCurrency(stats.despesasTotais)}
                  icon={<ReceiptText className="h-5 w-5 sm:h-6 sm:w-6" />}
                  description="Combustível, pedágios, etc"
                  className="bg-gradient-to-br from-red-50 to-white mb-4"
                />
                <StatCard
                  title="Distância Percorrida"
                  value={formatDistance(stats.distanciaTotal)}
                  icon={<Car className="h-5 w-5 sm:h-6 sm:w-6" />}
                  description="Total no mês atual"
                  className="bg-gradient-to-br from-amber-50 to-white mb-4"
                />
                <StatCard
                  title="Horas Trabalhadas"
                  value={`${stats.horasTrabalhadasTotal.toFixed(1)}h`}
                  icon={<Clock className="h-5 w-5 sm:h-6 sm:w-6" />}
                  description="Total no mês"
                  className="bg-gradient-to-br from-violet-50 to-white mb-4"
                />
              </div>

              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Ganhos por KM"
                  value={formatCurrency(stats.ganhosMediosPorKm)}
                  icon={<MapPin className="h-5 w-5 sm:h-6 sm:w-6" />}
                  description="Média por quilômetro"
                  className="bg-gradient-to-br from-emerald-50 to-white mb-4"
                />
                <StatCard
                  title="Ganhos por Hora"
                  value={formatCurrency(stats.ganhosPorHora)}
                  icon={<Timer className="h-5 w-5 sm:h-6 sm:w-6" />}
                  description="Média por hora"
                  className="bg-gradient-to-br from-blue-50 to-white mb-4"
                />
                <StatCard
                  title="Ganhos por Corrida"
                  value={formatCurrency(stats.ganhosMediosPorCorrida)}
                  icon={<Car className="h-5 w-5 sm:h-6 sm:w-6" />}
                  description="Média por corrida"
                  className="bg-gradient-to-br from-rose-50 to-white mb-4"
                />
                <StatCard
                  title="Lucro por KM"
                  value={formatCurrency(stats.lucroPorKm)}
                  icon={<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />}
                  description="Lucro líquido por km"
                  className="bg-gradient-to-br from-cyan-50 to-white mb-4"
                />
              </div>

              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                <DashboardCard
                  title="Corridas do Mês"
                  description="Total por aplicativo"
                >
                  <div className="space-y-3 sm:space-y-4">
                    {Object.entries(stats.corridasTotais)
                      .sort(([, a], [, b]) => b - a)
                      .map(([app, count]) => {
                        const appConfig = {
                          uber: { name: 'Uber', bgColor: 'bg-black/10', textColor: 'text-black' },
                          noventaENove: { name: '99', bgColor: 'bg-green-100', textColor: 'text-green-600' },
                          inDriver: { name: 'InDriver', bgColor: 'bg-blue-100', textColor: 'text-blue-600' }
                        }[app];

                        return (
                          <div key={app} className="flex justify-between items-center p-2 sm:p-3 bg-muted/50 rounded-md">
                            <div className="flex items-center">
                              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${appConfig.bgColor} flex items-center justify-center mr-2 sm:mr-3`}>
                                <Car className={`h-3 w-3 sm:h-4 sm:w-4 ${appConfig.textColor}`} />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{appConfig.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {count} corridas no mês
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </DashboardCard>

                <DashboardCard
                  title="Lucro Líquido"
                  description="Ganhos menos despesas"
                >
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Este mês</p>
                      <h3 className="text-2xl sm:text-3xl font-bold text-primary">
                        {formatCurrency(stats.lucroLiquido)}
                      </h3>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/relatorios')}
                      className="w-full sm:w-auto flex items-center justify-center"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Ver detalhes
                    </Button>
                  </div>
                  <div className="mt-4 sm:mt-6 h-1 bg-muted">
                    <div 
                      className="h-1 bg-primary" 
                      style={{ width: `${(stats.lucroLiquido / stats.ganhosTotais) * 100}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>Margem: {((stats.lucroLiquido / stats.ganhosTotais) * 100).toFixed(1)}%</span>
                    <span>100%</span>
                  </div>
                </DashboardCard>
              </div>
            </>
          )}
        </PageTransition>
      </main>
    </div>
  );
};

export default Index;
