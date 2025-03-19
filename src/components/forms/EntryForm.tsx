import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useReportContext } from '@/context/ReportContext';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  date: z.date({
    required_error: "A data é obrigatória.",
  }),
  earnings: z.coerce.number().min(0, {
    message: "Os ganhos devem ser um número positivo.",
  }),
  expenses: z.coerce.number().min(0, {
    message: "As despesas devem ser um número positivo.",
  }),
  distance: z.coerce.number().min(0, {
    message: "Os quilômetros devem ser um número positivo.",
  }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EntryForm = () => {
  const { toast } = useToast();
  const { addEntry } = useReportContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      earnings: undefined,
      expenses: undefined,
      distance: undefined,
      notes: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const earningsPerKm = data.distance > 0 ? data.earnings / data.distance : 0;
      
      const entry = {
        id: uuidv4(),
        date: data.date,
        earnings: data.earnings,
        expenses: data.expenses,
        distance: data.distance,
        notes: data.notes || '',
        earningsPerKm,
      };
      
      addEntry(entry);
      
      toast({
        title: "Entrada registrada com sucesso!",
        description: `Registro para ${format(data.date, 'dd/MM/yyyy')} adicionado.`,
      });
      
      form.reset({
        date: new Date(),
        earnings: undefined,
        expenses: undefined,
        distance: undefined,
        notes: '',
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar os dados",
        description: "Ocorreu um erro ao tentar salvar as informações.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
            
          <FormField
            control={form.control}
            name="earnings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ganhos (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            
          <FormField
            control={form.control}
            name="expenses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Despesas (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            
          <FormField
            control={form.control}
            name="distance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quilômetros rodados</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
            
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações (opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Adicione informações complementares sobre esse dia..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
            
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : "Salvar Entrada"}
        </Button>
      </form>
    </Form>
  );
};

export default EntryForm;
