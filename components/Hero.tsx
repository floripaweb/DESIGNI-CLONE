import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 py-16 sm:py-24">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Background"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
          Recursos Criativos para <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            Designers Exigentes
          </span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-300 mb-8">
          Milhares de arquivos PSD e Imagens JPG gratuitos e premium para impulsionar seus projetos.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {['Social Media', 'Flyers', 'Cartões', 'Logos', 'Mockups'].map((cat) => (
            <button 
              key={cat}
              className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all text-sm font-medium"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
