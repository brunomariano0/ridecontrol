import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import PageTransition from '@/components/layout/PageTransition';
import { useReportContext } from '@/context/ReportContext';
import { formatCurrency } from '@/lib/calculations';

const DailyEntry = () => {
  const navigate = useNavigate();
  const { addEntry } = useReportContext();
  
  const [formData, setFormData] = useState({
    data: format(new Date(), 'yyyy-MM-dd'),
    ganhos: '',
    despesas: '',
    distancia: '',
    horasTrabalhadas: '',
    corridas: {
      uber: '',
      noventaENove: '',
      inDriver: '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const entry = {
      id: uuidv4(),
      data: new Date(formData.data),
      ganhos: Number(formData.ganhos),
      despesas: Number(formData.despesas),
      distancia: Number(formData.distancia),
      horasTrabalhadas: Number(formData.horasTrabalhadas),
      corridas: {
        uber: Number(formData.corridas.uber),
        noventaENove: Number(formData.corridas.noventaENove),
        inDriver: Number(formData.corridas.inDriver),
      },
      ganhosPorKm: Number(formData.distancia) > 0 
        ? Number(formData.ganhos) / Number(formData.distancia)
        : 0,
    };

    addEntry(entry);
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('corridas.')) {
      const platform = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        corridas: {
          ...prev.corridas,
          [platform]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-6">
        <PageTransition>
          <Card>
            <CardHeader>
              <CardTitle>Nova Entrada</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="data">Data</Label>
                    <Input
                      id="data"
                      name="data"
                      type="date"
                      value={formData.data}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="horasTrabalhadas">Horas Trabalhadas</Label>
                    <Input
                      id="horasTrabalhadas"
                      name="horasTrabalhadas"
                      type="number"
                      step="0.5"
                      min="0"
                      value={formData.horasTrabalhadas}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ganhos">Ganhos (R$)</Label>
                    <Input
                      id="ganhos"
                      name="ganhos"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.ganhos}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="despesas">Despesas (R$)</Label>
                    <Input
                      id="despesas"
                      name="despesas"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.despesas}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="distancia">Distância (km)</Label>
                    <Input
                      id="distancia"
                      name="distancia"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.distancia}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Corridas por Aplicativo</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="corridas.uber">Uber</Label>
                      <Input
                        id="corridas.uber"
                        name="corridas.uber"
                        type="number"
                        min="0"
                        value={formData.corridas.uber}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="corridas.noventaENove">99</Label>
                      <Input
                        id="corridas.noventaENove"
                        name="corridas.noventaENove"
                        type="number"
                        min="0"
                        value={formData.corridas.noventaENove}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="corridas.inDriver">InDriver</Label>
                      <Input
                        id="corridas.inDriver"
                        name="corridas.inDriver"
                        type="number"
                        min="0"
                        value={formData.corridas.inDriver}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Salvar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </PageTransition>
      </main>
    </div>
  );
};

export default DailyEntry;
