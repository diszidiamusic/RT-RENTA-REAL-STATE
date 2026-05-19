import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowRight, LayoutGrid, Building, Hotel, Factory, LandPlot } from 'lucide-react';
import { cn } from '../lib/utils';

export interface Property {
  id: string;
  title: string;
  type: string;
  location: string;
  image: string;
  category: 'edificios' | 'hoteles' | 'industrial' | 'solar' | 'local' | 'oficinas' | 'singulares';
  // New fields from the reference image
  assetId?: string;
  situation?: string;
  assetTypeDetail?: string;
  surface?: {
    solar?: string;
    built?: string;
    year?: string;
  };
  observations?: {
    status?: string;
    annualExpenses?: string;
    annualRent?: string;
  };
  salePrice?: string;
  repercussion?: string;
  yield?: string;
  fees?: string;
  mapImage?: string;
}

interface PropertyListProps {
  properties: Property[];
}

const PropertyDetailModal: React.FC<{ property: Property; onClose: () => void }> = ({ property, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
  >
    <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-sm relative shadow-2xl">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-2 bg-slate-900 text-white hover:bg-brand hover:text-black transition-colors rounded-sm"
      >
        <ArrowRight className="rotate-180" size={24} />
      </button>

      <div className="p-8 md:p-16">
        {/* Header from image */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-slate-100 pb-8">
          <div>
            <span className="text-brand-dark font-bold text-xl uppercase tracking-widest mb-2 block">{property.assetId || 'ID PENDIENTE'}</span>
            <h2 className="text-3xl md:text-5xl font-serif text-slate-800 italic leading-tight">{property.title}</h2>
          </div>
          <div className="text-right">
             <div className="w-24 h-24 bg-slate-100 flex items-center justify-center text-slate-300 mb-2 rounded-sm border border-slate-200">
                <Building size={48} />
             </div>
             <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">RT Renta Real Estate</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Details */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Situación */}
            <div className="flex gap-8">
               <div className="w-12 flex justify-center shrink-0">
                  <MapPin className="text-slate-300" size={24} />
               </div>
               <div className="flex-1">
                  <h4 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-3 flex items-center gap-4">
                    Situación <div className="h-[1px] bg-slate-100 flex-1"></div>
                  </h4>
                  <p className="text-slate-600 leading-relaxed font-light text-lg">
                    {property.situation || 'Información pendiente de actualización.'}
                  </p>
               </div>
            </div>

            {/* Tipo Activo */}
            <div className="flex gap-8">
               <div className="w-12 flex justify-center shrink-0">
                  <Building className="text-slate-300" size={24} />
               </div>
               <div className="flex-1">
                  <h4 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-3 flex items-center gap-4">
                    Tipo Activo <div className="h-[1px] bg-slate-100 flex-1"></div>
                  </h4>
                  <p className="text-slate-600 leading-relaxed font-light whitespace-pre-line">
                    {property.assetTypeDetail || property.type}
                  </p>
               </div>
            </div>

            {/* Superficie */}
            <div className="flex gap-8">
               <div className="w-12 flex justify-center shrink-0">
                  <LayoutGrid className="text-slate-300" size={24} />
               </div>
               <div className="flex-1">
                  <h4 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-3 flex items-center gap-4">
                    Superficie <div className="h-[1px] bg-slate-100 flex-1"></div>
                  </h4>
                  <div className="space-y-1 text-slate-600 font-light text-lg">
                    {property.surface?.solar && <p>Superficie solar: {property.surface.solar}</p>}
                    {property.surface?.built && <p>Superficie construida: {property.surface.built}</p>}
                    {property.surface?.year && <p>Año de construcción: {property.surface.year}</p>}
                    {!property.surface && <p>Pendiente de medición técnica.</p>}
                  </div>
               </div>
            </div>

            {/* Observaciones */}
            <div className="flex gap-8">
               <div className="w-12 flex justify-center shrink-0">
                  <div className="w-6 h-6 border-2 border-slate-200 rounded-sm"></div>
               </div>
               <div className="flex-1">
                  <h4 className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-3 flex items-center gap-4">
                    Observaciones <div className="h-[1px] bg-slate-100 flex-1"></div>
                  </h4>
                  <div className="space-y-1 text-slate-600 font-light text-lg">
                    {property.observations?.status && <p>{property.observations.status}</p>}
                    {property.observations?.annualExpenses && <p>Gastos anuales: {property.observations.annualExpenses}</p>}
                    {property.observations?.annualRent && <p>Renta Anual Actual: {property.observations.annualRent}</p>}
                    {!property.observations && <p>Información confidencial bajo demanda.</p>}
                  </div>
               </div>
            </div>

            {/* Financials (Price, Yield, Fees) */}
            <div className="pt-8 space-y-8 border-t border-slate-100">
               {/* Precio */}
               <div className="flex gap-8">
                  <div className="w-12 flex justify-center shrink-0">
                     <span className="text-slate-300 text-2xl">€</span>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-8">
                     <div>
                        <h4 className="text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-2">Precio de venta</h4>
                        <p className="text-2xl font-bold text-slate-800">{property.salePrice || 'Consultar'}</p>
                     </div>
                     <div>
                        <h4 className="text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-2">Repercusión</h4>
                        <p className="text-xl font-light text-slate-600">{property.repercussion || '-'}</p>
                     </div>
                  </div>
               </div>

               {/* Rentabilidad */}
               <div className="flex gap-8">
                  <div className="w-12 shrink-0"></div>
                  <div className="flex-1">
                     <h4 className="text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-2">Rentabilidad</h4>
                     <p className="text-xl font-light text-slate-600">{property.yield || 'A estudio'}</p>
                  </div>
               </div>

               {/* Honorarios */}
               <div className="flex gap-8">
                  <div className="w-12 shrink-0 flex justify-center">
                     <LandPlot className="text-slate-300" size={24} />
                  </div>
                  <div className="flex-1">
                     <h4 className="text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-2">Honorarios</h4>
                     <p className="text-xl font-light text-slate-600">{property.fees || '3% (No incluidos en el precio)'}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Visuals */}
          <div className="lg:col-span-5 space-y-12">
             <div>
                <h4 className="text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-4 text-center">Entorno y vista representativa</h4>
                <div className="aspect-square bg-slate-50 border border-slate-100 rounded-sm overflow-hidden mb-8">
                   <img 
                    src={property.mapImage || "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000"} 
                    className="w-full h-full object-cover grayscale opacity-60" 
                    alt="Map environment"
                   />
                </div>
                <div className="aspect-[4/3] bg-slate-50 border border-slate-100 rounded-sm overflow-hidden">
                   <img 
                    src={property.image} 
                    className="w-full h-full object-cover" 
                    alt="Active property"
                   />
                </div>
             </div>

             <div className="p-8 bg-slate-50 border border-slate-100 italic text-slate-400 text-xs text-center leading-relaxed">
                Documento estrictamente confidencial, exclusivo para su destinatario. Propiedad de RT Renta Real Estate.
             </div>
             
             <button className="w-full py-5 bg-brand text-black uppercase tracking-[0.2em] font-bold text-xs hover:bg-slate-900 hover:text-white transition-all shadow-xl">
                Solicitar Dossier Completo
             </button>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export const PropertyCard: React.FC<{ property: Property; onClick: (p: Property) => void }> = ({ property, onClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -10 }}
    onClick={() => onClick(property)}
    className="group relative bg-card-light overflow-hidden shadow-xl transition-all duration-500 border border-line-light rounded-sm cursor-pointer"
  >
    <div className="aspect-[4/5] overflow-hidden bg-bg-light relative">
      <img
        src={property.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'}
        alt={property.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
      
      {/* Category Tag */}
      <div className="absolute top-6 left-6 px-3 py-1 bg-brand text-[9px] font-bold uppercase tracking-widest text-black">
        {property.category}
      </div>

      {property.assetId && (
        <div className="absolute top-6 right-6 px-3 py-1 bg-black/80 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest text-white border border-white/20">
          {property.assetId}
        </div>
      )}
    </div>

    <div className="p-8 bg-card-light">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-medium text-brand-dark mb-2">
        <MapPin size={12} />
        {property.location}
      </div>
      <h3 className="text-2xl font-serif mb-4 leading-tight italic text-text-dark line-clamp-2 min-h-[4rem]">
        {property.title}
      </h3>
      <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-text-muted border-t border-line-light pt-4 group-hover:text-brand transition-colors">
        Ver Ficha Técnica <ArrowRight size={14} className="text-brand transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  </motion.div>
);

export const PropertyList: React.FC<PropertyListProps> = ({ properties }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | Property['category']>('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const filters: { id: typeof activeFilter; label: string; icon: any }[] = [
    { id: 'all', label: 'Todos', icon: LayoutGrid },
    { id: 'edificios', label: 'Edificios', icon: Building },
    { id: 'hoteles', label: 'Hoteles', icon: Hotel },
    { id: 'industrial', label: 'Industrial', icon: Factory },
    { id: 'solar', label: 'Suelo', icon: LandPlot },
  ];

  const filteredProperties = activeFilter === 'all' 
    ? properties 
    : properties.filter(p => p.category === activeFilter);

  return (
    <section id="oportunidades" className="py-24 bg-bg-light border-y border-line-light min-h-[600px]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-12">
          <div className="text-center md:text-left">
            <span className="text-brand-dark uppercase tracking-[0.2em] text-xs font-bold mb-4 block underline underline-offset-8">Inversión</span>
            <h2 className="text-4xl md:text-5xl font-serif text-text-dark mt-4 leading-tight italic">Proyectos <span className="not-italic">& Oportunidades</span></h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 text-[10px] uppercase tracking-widest font-bold transition-all border rounded-sm",
                  activeFilter === f.id 
                    ? "bg-brand text-black border-brand shadow-lg" 
                    : "bg-card-light text-text-muted border-line-light hover:border-brand hover:text-brand"
                )}
              >
                <f.icon size={14} />
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredProperties.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProperties.map((p) => (
                <PropertyCard key={p.id} property={p} onClick={setSelectedProperty} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 text-slate-300 mb-6">
                <LayoutGrid size={32} />
              </div>
              <h3 className="text-2xl font-serif text-slate-400">No hay proyectos en esta categoría</h3>
              <p className="text-slate-400 font-sans mt-2">Estamos trabajando en nuevas oportunidades exclusivas.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedProperty && (
            <PropertyDetailModal 
              property={selectedProperty} 
              onClose={() => setSelectedProperty(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
