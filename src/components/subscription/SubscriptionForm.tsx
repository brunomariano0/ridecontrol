
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { addDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const SubscriptionForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, checkSubscription } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const refundDate = addDays(new Date(), 7);
  const formattedRefundDate = format(refundDate, "d 'de' MMMM", { locale: ptBR });
  
  const handleSubscribe = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro ao assinar",
        description: "Você precisa estar logado para assinar o serviço.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Obter o ID do usuário atual
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) throw new Error("Usuário não encontrado");
      
      // Registrar a assinatura no banco de dados
      const { error } = await supabase.from('subscriptions').insert({
        user_id: currentUser.id,
        amount: 20.00,
        refund_window_end: refundDate.toISOString(),
        status: 'active'
      });
      
      if (error) throw error;
      
      // Atualizar o estado de assinatura no contexto
      await checkSubscription();
      
      toast({
        title: "Assinatura realizada com sucesso!",
        description: "Bem-vindo ao RideTracker Premium!",
      });
      
      // Redirecionar para a página inicial
      navigate('/');
    } catch (error: any) {
      console.error("Erro ao processar assinatura:", error);
      toast({
        variant: "destructive",
        title: "Erro ao processar assinatura",
        description: error.message || "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Assinatura Única</CardTitle>
        <CardDescription>
          Tenha acesso completo ao Ride Control por um único pagamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-6">
          <div className="text-center">
            <p className="text-4xl font-bold">R$20</p>
            <p className="text-sm text-muted-foreground">pagamento único</p>
          </div>
        </div>
        
        <ul className="space-y-2 mb-6">
          <li className="flex items-start">
            <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
            <span>Acesso vitalício a todas as funcionalidades</span>
          </li>
          <li className="flex items-start">
            <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
            <span>Acompanhamento detalhado de ganhos e despesas</span>
          </li>
          <li className="flex items-start">
            <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
            <span>Relatórios personalizados</span>
          </li>
          <li className="flex items-start">
            <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
            <span>Garantia de reembolso de 7 dias (até {formattedRefundDate})</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          size="lg"
          onClick={handleSubscribe}
          disabled={isLoading}
        >
          {isLoading ? "Processando..." : "Assinar por R$20"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionForm;
