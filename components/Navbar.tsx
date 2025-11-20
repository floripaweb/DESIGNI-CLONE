import React from 'react';
import { User, PageView } from '../types';
import { Search, Upload, LogOut, User as UserIcon, ShoppingBag, Menu } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  setPageView: (view: PageView) => void;
  handleLogout: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, setPageView, handleLogout, searchTerm, setSearchTerm }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          
          {/* Logo area */}
          <div className="flex items-center flex-shrink-0 cursor-pointer" onClick={() => setPageView(PageView.HOME)}>
            <div className="w-8 h-8 bg-gradient-to-tr from-primary to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-2">
              D
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 hidden md:block">
              DesigniClone
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-full leading-5 bg-slate-50 placeholder-slate-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all"
                placeholder="Busque por vetores, fotos, PSDs..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            
            {user?.role === 'ADMIN' && (
              <button
                onClick={() => setPageView(PageView.ADMIN_DASHBOARD)}
                className="hidden md:flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gray-800 hover:bg-gray-900 focus:outline-none"
              >
                <Upload className="h-4 w-4 mr-2" />
                Painel Admin
              </button>
            )}

            {!user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPageView(PageView.LOGIN)}
                  className="text-slate-600 hover:text-primary font-medium px-3 py-2 text-sm"
                >
                  Entrar
                </button>
                <button
                  onClick={() => setPageView(PageView.REGISTER)}
                  className="bg-primary hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full transition-colors"
                >
                  Criar conta
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                  <span className="text-xs text-slate-500 uppercase">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-600"
                  title="Sair"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
            
            <button className="md:hidden p-2 rounded text-slate-500 hover:bg-slate-100">
                <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
