import React, { useState, useMemo } from 'react';
import { PropertyList, Property } from '../components/PropertyList';
import { Search, MapPin, Filter } from 'lucide-react';

interface OportunidadesPageProps {
  properties: Property[];
}

export const OportunidadesPage: React.FC<OportunidadesPageProps> = ({ properties }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Filter out disabled properties for public view
  const publicProperties = useMemo(() => {
    return properties.filter(p => p.isActive !== false);
  }, [properties]);

  // Extract locations dynamically from active properties
  const locations = useMemo(() => {
    const list = new Set<string>();
    publicProperties.forEach(p => {
      if (p.location) {
        list.add(p.location.trim().toUpperCase());
      }
    });
    return Array.from(list).sort();
  }, [publicProperties]);

  // Handle client-side search and location filtering repeteable quickly
  const filteredProperties = useMemo(() => {
    return publicProperties.filter(p => {
      const matchSearch = 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.assetId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        p.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.assetTypeDetail?.toLowerCase() || '').includes(searchTerm.toLowerCase());

      const matchLocation = 
        selectedLocation === 'all' || 
        p.location?.trim().toUpperCase() === selectedLocation.toUpperCase();

      return matchSearch && matchLocation;
    });
  }, [publicProperties, searchTerm, selectedLocation]);

  return (
    <div className="pt-32 bg-bg-light min-h-screen">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center md:text-left">
        <span className="text-brand-dark uppercase tracking-[0.3em] text-xs font-bold mb-4 block underline underline-offset-8">Mercado Inmobiliario</span>
        <h1 className="text-4xl md:text-6xl font-serif text-text-dark italic mb-8">
          Explora <span className="not-italic text-brand-dark text-luxury">todas nuestras oportunidades de inversión</span>
        </h1>
        
        {/* Simple Search/Filter Bar */}
        <div className="bg-white border border-line-light p-4 md:p-6 shadow-2xl rounded-sm flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 flex gap-4 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                  className="w-full bg-bg-light border border-line-light px-12 py-3 outline-none focus:border-brand transition-colors text-sm text-text-dark" 
                  placeholder="Buscar por referencia, título, palabra clave..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative flex-1 hidden md:block">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <select 
                  className="w-full bg-bg-light border border-line-light px-12 py-3 outline-none focus:border-brand appearance-none text-sm cursor-pointer text-text-dark font-sans"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="all">Ver todas las ubicaciones</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted font-bold text-[10px]">▼</div>
              </div>
            </div>
            
            {(searchTerm !== '' || selectedLocation !== 'all') && (
              <button 
                onClick={() => { setSearchTerm(''); setSelectedLocation('all'); }}
                className="w-full md:w-auto bg-slate-100 text-slate-800 border border-slate-200 px-6 py-3 uppercase tracking-widest text-[10px] font-bold hover:bg-slate-200 transition-all"
              >
                Limpiar filtros
              </button>
            )}
        </div>
      </div>

      <PropertyList properties={filteredProperties} />
      
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
          <a href="/contacto" className="inline-block bg-brand text-black px-12 py-5 uppercase tracking-widest text-xs font-bold rounded-sm transition-transform hover:scale-105">
            Vendemos su Inmueble
          </a>
        </div>
      </section>
    </div>
  );
};
