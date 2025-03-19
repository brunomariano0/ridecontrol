import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, PlusCircle, LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Nova Entrada', path: '/nova-entrada', icon: <PlusCircle className="w-5 h-5" /> },
    { name: 'Relatórios', path: '/relatorios', icon: <FileText className="w-5 h-5" /> },
    { name: 'Assinatura', path: '/assinatura', icon: <User className="w-5 h-5" /> },  
  ];

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logout realizado',
      description: 'Você saiu da sua conta com sucesso.',
    });
    navigate('/login');
    setIsOpen(false);
  };

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => setIsOpen(false)}
          className={cn(
            "transition-colors flex items-center px-2 py-1 text-sm font-medium rounded-md",
            location.pathname === item.path
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          <span className="mr-2">{item.icon}</span>
          <span>{item.name}</span>
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm bg-background/80 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600">Ride Control</span>
          </Link>
          
          {isAuthenticated && (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
                <NavLinks />
              </nav>

              {/* Mobile Navigation */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden ml-4">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[280px] p-0">
                  <div className="px-6 py-4 border-b">
                    <SheetTitle>Menu</SheetTitle>
                  </div>
                  <div className="px-4 py-2">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{user?.name || user?.email}</span>
                    </div>
                  </div>
                  <Separator />
                  <nav className="flex flex-col space-y-1 p-4">
                    <NavLinks />
                  </nav>
                  <Separator />
                  <div className="p-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleLogout}
                      className="w-full justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Sair</span>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="text-sm text-muted-foreground hidden md:block">
                <span className="font-medium text-foreground">{user?.name || user?.email}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="hidden md:flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Sair</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/cadastro">
                <Button>Cadastre-se</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;