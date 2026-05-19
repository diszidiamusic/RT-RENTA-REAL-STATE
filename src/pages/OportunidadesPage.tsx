import React, { useState } from 'react';
import { PropertyList, Property } from '../components/PropertyList';
import { Search, MapPin, Filter } from 'lucide-react';

interface OportunidadesPageProps {
  properties: Property[];
}

export const OportunidadesPage: React.FC<OportunidadesPageProps> = ({ properties }) => {
  return (
    <div className="pt-32 bg-bg-light min-h-screen">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center md:text-left">
        <span className="text-brand-dark uppercase tracking-[0.3em] text-xs font-bold mb-4 block underline underline-offset-8">Mercado Inmobiliario</span>
        <h1 className="text-5xl md:text-7xl font-serif text-text-dark italic mb-8">
          Explora <span className="not-italic text-brand-dark text-luxury">Activos Exclusivos</span>
        </h1>
        
        {/* Simple Search/Filter Bar */}
        <div className="bg-card-light border border-line-light p-4 md:p-6 shadow-2xl rounded-sm flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 flex gap-4 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input className="w-full bg-bg-light border border-line-light px-12 py-3 outline-none focus:border-brand transition-colors text-sm" placeholder="Buscar por zona, edificio, tipo..." />
              </div>
              <div className="relative flex-1 hidden md:block">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <select className="w-full bg-bg-light border border-line-light px-12 py-3 outline-none focus:border-brand appearance-none text-sm cursor-pointer">
                  <option>Barcelona (Todos)</option>
                  <option>Eixample</option>
                  <option>Costa Brava</option>
                  <option>Madrid</option>
                </select>
              </div>
            </div>
            <button className="w-full md:w-auto bg-slate-900 text-white px-10 py-3 uppercase tracking-widest text-[10px] font-bold hover:bg-brand hover:text-black transition-all flex items-center justify-center gap-2">
              <Filter size={14} /> Aplicar Filtros
            </button>
        </div>
      </div>

      <PropertyList properties={properties} />
      
      <section className="py-24 bg-card-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <div className="grid grid-cols-12 h-full gap-4">
              {Array.from({length: 12}).map((_, i) => (
                <div key={i} className="border-r border-white h-full"></div>
              ))}
           </div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-8 italic">¿Eres Propietario?</h2>
          <p className="text-text-muted text-lg mb-10 font-light">Tenemos el comprador perfecto para tu activo. Nuestra metodología directa garantiza los mejores resultados.</p>
          <button className="bg-brand text-black px-12 py-5 uppercase tracking-widest text-xs font-bold rounded-sm transition-transform hover:scale-105">
            Vendemos su Inmueble
          </button>
        </div>
      </section>
    </div>
  );
};
