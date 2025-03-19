
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  email: string;
  name?: string;
  isLoggedIn: boolean;
}

interface Subscription {
  id: string;
  status: 'active' | 'cancelled' | 'refunded';
  amount: number;
  payment_date: string;
  refund_window_end: string;
}

interface AuthContextType {
  user: User | null;
  subscription: Subscription | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  checkSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se o usuário já está logado ao carregar a página
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser({
            email: session.user.email || '',
            isLoggedIn: true
          });
          
          // Verificar assinatura
          await checkSubscriptionStatus(session.user.id);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();
    
    // Listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser({
          email: session.user.email || '',
          isLoggedIn: true
        });
        
        await checkSubscriptionStatus(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSubscription(null);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkSubscriptionStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setSubscription(data as Subscription);
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
    }
  };

  const checkSubscription = async () => {
    if (!user) return;
    
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        await checkSubscriptionStatus(authUser.id);
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        setUser({
          email: data.user.email || '',
          isLoggedIn: true
        });
        
        await checkSubscriptionStatus(data.user.id);
      }
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        setUser({
          email: data.user.email || '',
          name,
          isLoggedIn: true
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSubscription(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const value = {
    user,
    subscription,
    login,
    signup,
    logout,
    isAuthenticated: !!user?.isLoggedIn,
    checkSubscription
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
