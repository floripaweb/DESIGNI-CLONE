import React, { useState, useRef } from 'react';
import { DesignResource, PageView, User } from '../types';
import { saveResource } from '../services/storageService';
import { analyzeImage } from '../services/geminiService';
import { Upload, Image as ImageIcon, FileCode, X, Loader2, Sparkles, CheckCircle } from 'lucide-react';

interface AdminPanelProps {
  currentUser: User;
  setPageView: (view: PageView) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, setPageView }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [jpgFile, setJpgFile] = useState<File | null>(null);
  const [psdFile, setPsdFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const psdInputRef = useRef<HTMLInputElement>(null);

  const handleJpgSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setJpgFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setPreviewUrl(result);
        // Auto-analyze with Gemini
        triggerAiAnalysis(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePsdSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPsdFile(e.target.files[0]);
    }
  };

  const triggerAiAnalysis = async (base64Data: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(base64Data);
      setTitle(result.title);
      setDescription(result.description);
      setTags(result.tags);
    } catch (err) {
      console.error("AI failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !jpgFile || !psdFile || !previewUrl) return;

    setIsSaving(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newResource: DesignResource = {
      id: Date.now().toString(),
      title,
      description,
      thumbnailData: previewUrl, // In real app, upload to bucket and get URL
      psdFileName: psdFile.name, // In real app, upload to bucket
      uploadDate: new Date().toISOString(),
      authorId: currentUser.id,
      tags,
      downloads: 0,
      isPremium
    };

    saveResource(newResource);
    setIsSaving(false);
    setPageView(PageView.HOME);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Painel Administrativo</h1>
          <p className="text-slate-500">Upload de novos recursos (JPG + PSD)</p>
        </div>
        <button onClick={() => setPageView(PageView.HOME)} className="text-slate-600 hover:text-slate-900">
          Voltar ao site
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Image Upload & Preview */}
        <div className="lg:col-span-1 space-y-6">
          <div 
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors ${
              previewUrl ? 'border-slate-200 bg-slate-50' : 'border-slate-300 hover:border-primary hover:bg-blue-50'
            }`}
          >
            {previewUrl ? (
              <div className="relative w-full group">
                <img src={previewUrl} alt="Preview" className="w-full rounded-lg shadow-md" />
                <button 
                  onClick={() => { setPreviewUrl(null); setJpgFile(null); }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer w-full h-full flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <h3 className="font-medium text-slate-900">Upload da Imagem</h3>
                <p className="text-sm text-slate-500 mt-1">JPG, JPEG (Max 5MB)</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleJpgSelect} 
                  accept=".jpg,.jpeg" 
                  className="hidden" 
                />
              </div>
            )}
          </div>

          <div className={`border border-slate-200 rounded-xl p-4 flex items-center gap-3 ${psdFile ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
             <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${psdFile ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
               <FileCode className="w-5 h-5" />
             </div>
             <div className="flex-1 overflow-hidden">
                {psdFile ? (
                  <div className="text-sm">
                    <p className="font-medium text-green-800 truncate">{psdFile.name}</p>
                    <p className="text-green-600 text-xs">{(psdFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="text-sm">
                     <p className="font-medium text-slate-700">Arquivo Fonte</p>
                     <p className="text-slate-500 text-xs">Requer arquivo .PSD</p>
                  </div>
                )}
             </div>
             {psdFile ? (
               <button onClick={() => setPsdFile(null)} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
             ) : (
               <button 
                 onClick={() => psdInputRef.current?.click()} 
                 className="px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded hover:bg-slate-800"
               >
                 Selecionar
               </button>
             )}
             <input type="file" ref={psdInputRef} onChange={handlePsdSelect} accept=".psd" className="hidden" />
          </div>
          
          {isAnalyzing && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3 animate-pulse">
              <Sparkles className="w-5 h-5 text-primary animate-spin" />
              <span className="text-sm text-blue-800 font-medium">A IA está analisando sua imagem...</span>
            </div>
          )}
        </div>

        {/* Right Column: Metadata Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Título do Recurso</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Ex: Banner Promocional Black Friday"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Descreva o recurso..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tags (Pressione Enter)</label>
              <div className="flex flex-wrap gap-2 mb-2 min-h-[38px] p-2 border border-slate-300 rounded-lg bg-white focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
                {tags.map(tag => (
                  <span key={tag} className="bg-slate-100 text-slate-700 text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="flex-1 bg-transparent focus:outline-none text-sm min-w-[100px]"
                  placeholder={tags.length === 0 ? "Adicionar tags..." : ""}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center h-5">
                <input
                  id="premium"
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="focus:ring-primary h-4 w-4 text-primary border-slate-300 rounded"
                />
              </div>
              <label htmlFor="premium" className="text-sm text-slate-700 select-none">
                Marcar como Recurso Premium
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPageView(PageView.HOME)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!title || !jpgFile || !psdFile || isSaving}
                className={`flex items-center px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white shadow-sm 
                  ${(!title || !jpgFile || !psdFile) ? 'bg-slate-300 cursor-not-allowed' : 'bg-primary hover:bg-blue-700'}`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publicando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" /> Publicar Recurso
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
