
import React from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { motion } from 'framer-motion';
import SubscriptionForm from '@/components/subscription/SubscriptionForm';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';

const Subscription = () => {
  const { subscription } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <PageTransition>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Assine o Ride Control</h1>
              <p className="text-muted-foreground mt-2">
                Desbloqueie todas as funcionalidades com um único pagamento
              </p>
            </div>
            
            {subscription && subscription.status === 'active' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto text-center">
                <h2 className="text-xl font-semibold text-green-800 mb-3">Você já possui uma assinatura ativa!</h2>
                <p className="text-green-700">
                  Sua assinatura foi realizada em {new Date(subscription.payment_date).toLocaleDateString('pt-BR')}
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Você já tem acesso a todas as funcionalidades premium do Ride Control.
                </p>
              </div>
            ) : (
              <>
                <SubscriptionForm />
                
                <div className="mt-8 text-center text-sm text-muted-foreground">
                  <p>Ao assinar, você concorda com nossos Termos de Serviço e Política de Privacidade.</p>
                  <p className="mt-2">
                    Se tiver alguma dúvida, entre em contato com nosso suporte em suporte@ridecontrol.com.br
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </PageTransition>
      </div>
    </div>
  );
};

export default Subscription;
