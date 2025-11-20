import React, { useState, useEffect } from 'react';
import { PageView, User, DesignResource } from './types';
import { getCurrentUser, setCurrentUser, getResources } from './services/storageService';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ResourceCard from './components/ResourceCard';
import AuthPage from './pages/AuthPage';
import AdminPanel from './pages/AdminPanel';
import ResourceDetail from './pages/ResourceDetail';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [pageView, setPageView] = useState<PageView>(PageView.HOME);
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState<DesignResource[]>([]);
  const [selectedResource, setSelectedResource] = useState<DesignResource | null>(null);

  useEffect(() => {
    // Load user session
    const sessionUser = getCurrentUser();
    if (sessionUser) {
      setUser(sessionUser);
    }
    // Load resources
    setResources(getResources());
  }, [pageView]); // Reload resources when view changes (e.g. after upload)

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentUser(loggedInUser);
    setPageView(PageView.HOME);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentUser(null);
    setPageView(PageView.LOGIN);
  };

  const handleResourceClick = (resource: DesignResource) => {
    setSelectedResource(resource);
    setPageView(PageView.RESOURCE_DETAIL);
  };

  const filteredResources = resources.filter(res => 
    res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderContent = () => {
    switch (pageView) {
      case PageView.LOGIN:
        return <AuthPage view={PageView.LOGIN} setPageView={setPageView} onLoginSuccess={handleLoginSuccess} />;
      
      case PageView.REGISTER:
        return <AuthPage view={PageView.REGISTER} setPageView={setPageView} onLoginSuccess={handleLoginSuccess} />;
      
      case PageView.ADMIN_DASHBOARD:
        if (!user || user.role !== 'ADMIN') {
          return (
             <div className="text-center py-20">
               <h2 className="text-2xl font-bold">Acesso Negado</h2>
               <p className="mt-2">Você precisa ser um administrador para ver esta página.</p>
               <button onClick={() => setPageView(PageView.HOME)} className="mt-4 text-primary underline">Voltar</button>
             </div>
          )
        }
        return <AdminPanel currentUser={user} setPageView={setPageView} />;

      case PageView.RESOURCE_DETAIL:
        if (!selectedResource) return null;
        return <ResourceDetail resource={selectedResource} onBack={() => setPageView(PageView.HOME)} setPageView={setPageView} />;

      case PageView.HOME:
      default:
        return (
          <>
            <Hero />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Recursos Recentes</h2>
                <div className="text-sm text-slate-500">Exibindo {filteredResources.length} resultados</div>
              </div>

              {filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredResources.map(res => (
                    <ResourceCard key={res.id} resource={res} onClick={handleResourceClick} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                  <p className="text-slate-500 text-lg">Nenhum recurso encontrado para "{searchTerm}".</p>
                </div>
              )}
            </main>
            
            <footer className="bg-white border-t border-slate-200 mt-12">
              <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-tr from-primary to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">D</div>
                        <span className="text-xl font-bold text-slate-900">DesigniClone</span>
                    </div>
                    <p className="text-slate-500 text-sm max-w-xs">
                      Sua fonte diária de inspiração e recursos gráficos profissionais. Junte-se a milhares de designers hoje mesmo.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Legal</h3>
                    <ul className="space-y-3">
                      <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900">Termos de Uso</a></li>
                      <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900">Privacidade</a></li>
                      <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900">Licenças</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Suporte</h3>
                    <ul className="space-y-3">
                      <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900">FAQ</a></li>
                      <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900">Contato</a></li>
                      <li><a href="#" className="text-sm text-slate-500 hover:text-slate-900">Seja um Contribuidor</a></li>
                    </ul>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm">
                  &copy; 2023 DesigniClone. Todos os direitos reservados.
                </div>
              </div>
            </footer>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar 
        user={user} 
        setPageView={setPageView} 
        handleLogout={handleLogout} 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      {renderContent()}
    </div>
  );
}

export default App;
