import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Share2, Download, ExternalLink, ChevronRight, ArrowLeft, Play } from 'lucide-react';
import { EDUCATION_MATERIALS, EducationMaterial } from '../data/education';
import { cn } from '../lib/utils';

const EducationLibrary = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<EducationMaterial | null>(null);

  const categories = ['Semua', ...new Set(EDUCATION_MATERIALS.map(m => m.category))];

  const filteredMaterials = EDUCATION_MATERIALS.filter(m => {
    const matchesCategory = selectedCategory === 'Semua' || m.category === selectedCategory;
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         m.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-all shadow-sm group"
            title="Kembali"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Kembali</span>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Perpustakaan Edukasi</h2>
            <p className="text-slate-500">Materi promosi kesehatan gigi dan mulut untuk pasien.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari materi edukasi..." 
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                selectedCategory === cat 
                  ? "bg-pink-500 text-white shadow-md shadow-pink-100" 
                  : "bg-white text-slate-600 border border-slate-200 hover:border-pink-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <div 
            key={material.id} 
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all group cursor-pointer"
            onClick={() => setSelectedMaterial(material)}
          >
            <div className="h-48 overflow-hidden relative">
              <img 
                src={material.imageUrl} 
                alt={material.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              {material.videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-pink-600 shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={24} fill="currentColor" />
                  </div>
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-pink-600 text-xs font-bold rounded-full shadow-sm">
                  {material.category}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-slate-800 mb-2 group-hover:text-pink-600 transition-colors line-clamp-2">
                {material.title}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                {material.content}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-xs font-semibold text-pink-600 flex items-center gap-1">
                  Baca Selengkapnya <ChevronRight size={14} />
                </span>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
                    <Share2 size={16} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMaterial && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedMaterial(null)}
        >
          <div 
            className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-pink-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 shrink-0 bg-slate-900">
              {selectedMaterial.videoUrl ? (
                <iframe 
                  src={selectedMaterial.videoUrl} 
                  title={selectedMaterial.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : (
                <img 
                  src={selectedMaterial.imageUrl} 
                  alt={selectedMaterial.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
              <button 
                onClick={() => setSelectedMaterial(null)}
                className="absolute top-4 left-4 h-10 px-4 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full flex items-center gap-2 transition-all z-10 text-sm font-medium"
              >
                <ArrowLeft size={18} />
                Kembali
              </button>
              <button 
                onClick={() => setSelectedMaterial(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all z-10"
              >
                &times;
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-pink-100 text-pink-600 text-xs font-bold rounded-full">
                  {selectedMaterial.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{selectedMaterial.title}</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">{selectedMaterial.content}</p>
              
              {selectedMaterial.steps && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen size={20} className="text-pink-500" />
                    Langkah-langkah & Instruksi:
                  </h4>
                  <div className="space-y-3">
                    {selectedMaterial.steps.map((step, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-pink-50/50 rounded-2xl border border-pink-100">
                        <div className="w-8 h-8 shrink-0 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md shadow-pink-100">
                          {i + 1}
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-pink-500 text-white py-3 rounded-xl font-bold hover:bg-pink-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-100">
                  <Share2 size={20} />
                  Bagikan ke WhatsApp Pasien
                </button>
                <div className="flex gap-4">
                  <button className="px-6 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all">
                    Cetak Leaflet
                  </button>
                  <button 
                    onClick={() => setSelectedMaterial(null)}
                    className="px-6 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all font-medium"
                  >
                    Kembali
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationLibrary;
