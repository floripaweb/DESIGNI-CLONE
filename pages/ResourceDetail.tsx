import React from 'react';
import { DesignResource, PageView } from '../types';
import { Download, ArrowLeft, ShieldCheck, Calendar, FileCode, Image as ImageIcon, Crown } from 'lucide-react';

interface ResourceDetailProps {
  resource: DesignResource;
  onBack: () => void;
  setPageView: (view: PageView) => void;
}

const ResourceDetail: React.FC<ResourceDetailProps> = ({ resource, onBack }) => {
  
  const imgSrc = resource.thumbnailData.startsWith('data:') || resource.thumbnailData.startsWith('http') 
    ? resource.thumbnailData 
    : `data:image/jpeg;base64,${resource.thumbnailData}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={onBack} 
        className="flex items-center text-slate-500 hover:text-slate-900 mb-6 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para galeria
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Image Column */}
        <div className="lg:col-span-2">
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <img 
              src={imgSrc} 
              alt={resource.title} 
              className="w-full h-auto rounded-xl" 
            />
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Descrição</h2>
            <p className="text-slate-600 leading-relaxed">{resource.description}</p>
            
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Tags relacionadas</h3>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map(tag => (
                  <a key={tag} href="#" className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-sm transition-colors">
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{resource.title}</h1>
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(resource.uploadDate).toLocaleDateString()}</span>
                <span>•</span>
                <span>ID: #{resource.id.slice(-6)}</span>
              </div>

              {resource.isPremium && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 flex items-start gap-3">
                  <Crown className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-800">Recurso Premium</h4>
                    <p className="text-xs text-amber-700 mt-1">Acesso exclusivo para assinantes do plano PRO.</p>
                  </div>
                </div>
              )}

              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 text-lg">
                <Download className="w-6 h-6" /> 
                {resource.isPremium ? 'Baixar Premium' : 'Download Grátis'}
              </button>

              <div className="mt-4 text-center text-xs text-slate-500">
                Ao baixar, você concorda com nossa licença de uso.
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4">Arquivos Inclusos</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Photoshop (PSD)</p>
                    <p className="text-xs">{resource.psdFileName}</p>
                  </div>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded">Editável</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center text-purple-600">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Imagem (JPG)</p>
                    <p className="text-xs">Alta Resolução</p>
                  </div>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded">Preview</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
              <ShieldCheck className="w-4 h-4" /> Verificado contra vírus
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
