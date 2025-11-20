import React from 'react';
import { DesignResource } from '../types';
import { Download, Crown, Image as ImageIcon, FileCode } from 'lucide-react';

interface ResourceCardProps {
  resource: DesignResource;
  onClick: (resource: DesignResource) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick }) => {
  // Handle base64 or external URL for image
  const imgSrc = resource.thumbnailData.startsWith('data:') || resource.thumbnailData.startsWith('http') 
    ? resource.thumbnailData 
    : `data:image/jpeg;base64,${resource.thumbnailData}`;

  return (
    <div 
      className="group relative bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => onClick(resource)}
    >
      {resource.isPremium && (
        <div className="absolute top-3 left-3 z-10 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm">
          <Crown className="w-3 h-3" /> PREMIUM
        </div>
      )}
      
      <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
        <img 
          src={imgSrc} 
          alt={resource.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
           <div className="bg-white text-slate-900 px-4 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
             Ver Detalhes
           </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-slate-900 font-semibold text-lg truncate mb-1">{resource.title}</h3>
        <div className="flex flex-wrap gap-1 mb-3">
          {resource.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">#{tag}</span>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-slate-500 text-xs mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1" title="Imagem JPG inclusa">
              <ImageIcon className="w-3 h-3" /> JPG
            </span>
            <span className="flex items-center gap-1" title="Arquivo PSD incluso">
              <FileCode className="w-3 h-3 text-blue-600" /> PSD
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3" /> {resource.downloads}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
