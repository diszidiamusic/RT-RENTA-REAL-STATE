import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowRight, LayoutGrid, Building, Hotel, Factory, LandPlot, List } from 'lucide-react';
import { cn, openPdf } from '../lib/utils';
import customLogo from '../img/ChatGPT Image 7 de juny del 2026, 22_29_31.png';

// ALL INDIVIDUAL PROPERTY IMAGE IMPORTS
import edA141 from '../img/ED-A141.png';
import edA257_1 from '../img/ED-A257-1.png';
import edA257 from '../img/ED-A257.png';
import edA259 from '../img/ED-A259.png';
import edA265 from '../img/ED-A265.png';
import edA266 from '../img/ED-A266.png';
import edA267 from '../img/ED-A267.png';
import edA269 from '../img/ED-A269.png';
import edA270 from '../img/ED-A270.png';
import edA271 from '../img/ED-A271.png';
import edA273 from '../img/ED-A273.png';
import edA274 from '../img/ED-A274.png';
import slA203 from '../img/SL-A203.png';
import slA220 from '../img/SL-A220.png';
import slA222 from '../img/SL-A222.png';
import slA225 from '../img/SL-A225.png';
import slA254 from '../img/SL-A254.png';
import slA257 from '../img/SL-A257.png';
import slA264 from '../img/SL-A264.png';
import slA267 from '../img/SL-A267.png';
import slA269 from '../img/SL-A269.png';
import slA275 from '../img/SL-A275.png';
import slA276 from '../img/SL-A276.png';
import slA277 from '../img/SL-A277.png';
import slA278 from '../img/SL-A278.png';
import slA279 from '../img/SL-A279.png';
import slA280 from '../img/SL-A280.png';
import slA281 from '../img/SL-A281.png';
import slA282 from '../img/SL-A282.png';
import slA283 from '../img/SL-A283.png';
import slA284 from '../img/SL-A284.png';
import slA285 from '../img/SL-A285.png';
import slA288 from '../img/SL-A288.png';
import slA289 from '../img/SL-A289.png';
import slA290 from '../img/SL-A290.png';
import slA291 from '../img/SL-A291.png';
import slA294 from '../img/SL-A294.png';
import slA295 from '../img/SL.-A295.png';
import sla271 from '../img/SLA-271.png';
import sla274 from '../img/SLA-274.png';
import sNImg from '../img/SÑ.png';

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
  pdfUrl?: string;
  isActive?: boolean;
}

interface PropertyListProps {
  properties: Property[];
}

const defaultCategoryImages: Record<Property['category'], string> = {
  edificios: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
  hoteles: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
  industrial: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
  solar: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
  local: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
  oficinas: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
  singulares: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
};

const assetImageMap: Record<string, string> = {
  // EDIFICIOS
  'ED-A141': edA141,
  'ED-A257': edA257,
  'ED-A257-1': edA257_1,
  'ED-A259': edA259,
  'ED-A265': edA265,
  'ED-A266': edA266,
  'ED-A267': edA267,
  'ED-A269': edA269,
  'ED-A270': edA270,
  'ED-A271': edA271,
  'ED-A273': edA273,
  'ED-A274': edA274,

  // SUELOS / SOLARES (and support potential variations)
  'SL-A203': slA203,
  'ED-A203': slA203, 
  'SL-A220': slA220,
  'SL-A222': slA222,
  'SL-A225': slA225,
  'SL-A225A': slA225,
  'SL-A225B': slA225,
  'SL-A254': slA254,
  'SL-A257': slA257,
  'SL-A264': slA264,
  'SL-A267': slA267,
  'SL-A269': slA269,
  'SL-A275': slA275,
  'SL-A276': slA276,
  'SL-A277': slA277,
  'SL-A278': slA278,
  'SL-A279': slA279,
  'SL-A280': slA280,
  'SL-A281': slA281,
  'SL-A282': slA282,
  'SL-A283': slA283,
  'SL-A284': slA284,
  'SL-A285': slA285,
  'SL-A288': slA288,
  'SL-A289': slA289,
  'SL-A290': slA290,
  'SL-A291': slA291,
  'SL-A294': slA294,
  'SL-A295': slA295,
  'SL.-A295': slA295,
  'SLA-271': sla271,
  'SL-A271': sla271,
  'SLA-274': sla274,
  'SL-A274': sla274,
  'SÑ': sNImg,
  'SN': sNImg,

  // FALLBACKS / OTHER CLASSIC
  'ED-A229': customLogo,
  'ED-A231': customLogo,
  'ED-A220': customLogo,
  'ED-A022': customLogo,
  'SL-A229': customLogo
};

export const getAssetImage = (assetId?: string): string | null => {
  if (!assetId) return null;
  const idClean = assetId.trim().toUpperCase();
  return assetImageMap[idClean] || null;
};

export const getPropertyImage = (property: Property): string => {
  if (property.assetId) {
    const customImg = getAssetImage(property.assetId);
    if (customImg) return customImg;
  }
  return property.image || defaultCategoryImages[property.category] || defaultCategoryImages.edificios;
};

const PropertyDetailModal: React.FC<{ property: Property; onClose: () => void }> = ({ property, onClose }) => {
  const hasImage = property.image && property.image.trim() !== '';
  const hasMapImage = property.mapImage && property.mapImage.trim() !== '';

  return (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8"
  >
    <div className="bg-white w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-sm relative shadow-2xl">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2 bg-slate-900 text-white hover:bg-brand hover:text-black transition-colors rounded-sm"
      >
        <ArrowRight className="rotate-180" size={20} />
      </button>

      <div className="p-5 sm:p-10 md:p-16">
        {/* Header from image */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-slate-100 pb-8">
          <div className="pr-12 md:pr-0">
            <span className="text-brand-dark font-bold text-lg sm:text-xl uppercase tracking-widest mb-2 block">{property.assetId || 'ID PENDIENTE'}</span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif text-slate-800 italic leading-tight">{property.title}</h2>
          </div>
          <div className="text-left md:text-right flex items-center md:flex-col gap-4 md:gap-2">
             <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white flex items-center justify-center rounded-sm border border-slate-200 overflow-hidden shadow-sm p-1">
                <img 
                  src={customLogo} 
                  alt="RT Renta Real Estate" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
             </div>
             <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">RT Renta Real Estate</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
          {/* Left Column: Details */}
          <div className="lg:col-span-7 space-y-10 sm:space-y-12">
            
            {/* Situación */}
            <div className="flex gap-4 sm:gap-8">
               <div className="w-10 sm:w-12 flex justify-center shrink-0">
                  <MapPin className="text-slate-300" size={24} />
               </div>
               <div className="flex-1">
                  <h4 className="text-slate-400 uppercase tracking-widest text-[#a8a29e] text-[10px] sm:text-xs font-bold mb-3 flex items-center gap-4">
                    Situación <div className="h-[1px] bg-slate-100 flex-1"></div>
                  </h4>
                  <p className="text-slate-600 leading-relaxed font-light text-base sm:text-lg">
                    {property.situation || 'Información pendiente de actualización.'}
                  </p>
               </div>
            </div>

            {/* Tipo Activo */}
            <div className="flex gap-4 sm:gap-8">
               <div className="w-10 sm:w-12 flex justify-center shrink-0">
                  <Building className="text-slate-300" size={24} />
               </div>
               <div className="flex-1">
                  <h4 className="text-slate-400 uppercase tracking-widest text-[#a8a29e] text-[10px] sm:text-xs font-bold mb-3 flex items-center gap-4">
                    Tipo Activo <div className="h-[1px] bg-slate-100 flex-1"></div>
                  </h4>
                  <p className="text-slate-600 leading-relaxed font-light text-base sm:text-lg whitespace-pre-line">
                    {property.assetTypeDetail || property.type}
                  </p>
               </div>
            </div>

            {/* Superficie */}
            <div className="flex gap-4 sm:gap-8">
               <div className="w-10 sm:w-12 flex justify-center shrink-0">
                  <LayoutGrid className="text-slate-300" size={24} />
               </div>
               <div className="flex-1">
                  <h4 className="text-slate-400 uppercase tracking-widest text-[#a8a29e] text-[10px] sm:text-xs font-bold mb-3 flex items-center gap-4">
                    Superficie <div className="h-[1px] bg-slate-100 flex-1"></div>
                  </h4>
                  <div className="space-y-1 text-slate-600 font-light text-base sm:text-lg">
                    {property.surface?.solar && <p>Superficie solar: {property.surface.solar}</p>}
                    {property.surface?.built && <p>Superficie construida: {property.surface.built}</p>}
                    {property.surface?.year && <p>Año de construcción: {property.surface.year}</p>}
                    {!property.surface && <p>Pendiente de medición técnica.</p>}
                  </div>
               </div>
            </div>

            {/* Observaciones */}
            <div className="flex gap-4 sm:gap-8">
               <div className="w-10 sm:w-12 flex justify-center shrink-0">
                  <div className="w-6 h-6 border-2 border-slate-200 rounded-sm"></div>
               </div>
               <div className="flex-1">
                  <h4 className="text-slate-400 uppercase tracking-widest text-[#a8a29e] text-[10px] sm:text-xs font-bold mb-3 flex items-center gap-4">
                    Observaciones <div className="h-[1px] bg-slate-100 flex-1"></div>
                  </h4>
                  <div className="space-y-1 text-slate-600 font-light text-base sm:text-lg">
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
               <div className="flex gap-4 sm:gap-8">
                  <div className="w-10 sm:w-12 flex justify-center shrink-0">
                     <span className="text-slate-300 text-2xl">€</span>
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                     <div>
                        <h4 className="text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-2">Precio de venta</h4>
                        <p className="text-xl sm:text-2xl font-bold text-slate-800">{property.salePrice || 'Consultar'}</p>
                     </div>
                     <div>
                        <h4 className="text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-2">Repercusión</h4>
                        <p className="text-lg sm:text-xl font-light text-slate-600">{property.repercussion || '-'}</p>
                     </div>
                  </div>
               </div>

               {/* Rentabilidad */}
               <div className="flex gap-4 sm:gap-8">
                  <div className="w-10 sm:w-12 shrink-0"></div>
                  <div className="flex-1">
                     <h4 className="text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-2">Rentabilidad</h4>
                     <p className="text-lg sm:text-xl font-light text-slate-600">{property.yield || 'A estudio'}</p>
                  </div>
               </div>

               {/* Honorarios */}
               <div className="flex gap-4 sm:gap-8">
                  <div className="w-10 sm:w-12 shrink-0 flex justify-center">
                     <LandPlot className="text-slate-300" size={24} />
                  </div>
                  <div className="flex-1">
                     <h4 className="text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-2">Honorarios</h4>
                     <p className="text-lg sm:text-xl font-light text-slate-600">{property.fees || '3% (No incluidos en el precio)'}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Visuals */}
          <div className="lg:col-span-5 space-y-12">
             {(hasImage || hasMapImage) && (
                <div>
                   <h4 className="text-slate-400 uppercase tracking-widest text-[10px] font-bold mb-4 text-center">
                      {(hasImage && hasMapImage) ? "Entorno y vista representativa" : hasMapImage ? "Entorno representativo" : "Vista representativa"}
                   </h4>
                   {hasMapImage && (
                      <div className="aspect-square bg-slate-50 border border-slate-100 rounded-sm overflow-hidden mb-8">
                         <img 
                          src={property.mapImage} 
                          className="w-full h-full object-cover grayscale opacity-60" 
                          alt="Map environment"
                          referrerPolicy="no-referrer"
                         />
                      </div>
                   )}
                   {hasImage && (
                      <div className="aspect-[4/3] bg-slate-50 border border-slate-100 rounded-sm overflow-hidden">
                         <img 
                          src={getPropertyImage(property)} 
                          className="w-full h-full object-cover" 
                          alt="Active property"
                          referrerPolicy="no-referrer"
                         />
                      </div>
                   )}
                </div>
             )}

             <div className="p-8 bg-slate-50 border border-slate-100 italic text-slate-400 text-xs text-center leading-relaxed">
                Documento estrictamente confidencial, exclusivo para su destinatario. Propiedad de RT Renta Real Estate.
             </div>
             
             {property.pdfUrl ? (
               <button 
                 onClick={() => openPdf(property.pdfUrl!)}
                 className="w-full block text-center py-5 bg-black text-brand border border-brand uppercase tracking-[0.2em] font-bold text-xs hover:bg-brand hover:text-black transition-all shadow-xl font-sans cursor-pointer"
               >
                 Abrir portfolio
               </button>
             ) : (
               <button className="w-full py-5 bg-brand text-black uppercase tracking-[0.2em] font-bold text-xs hover:bg-slate-900 hover:text-white transition-all shadow-xl">
                  Solicitar Dossier Completo
               </button>
             )}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);
};

export const PropertyCard: React.FC<{ property: Property; onClick: (p: Property) => void }> = ({ property, onClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -5 }}
    onClick={() => onClick(property)}
    className="group relative bg-card-light overflow-hidden shadow-xl transition-all duration-500 border border-line-light rounded-sm cursor-pointer"
  >
    <div className="aspect-[4/5] overflow-hidden bg-bg-light relative">
      <img
        src={getPropertyImage(property)}
        alt={property.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-line-light pt-4 mt-2">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-text-muted group-hover:text-brand transition-colors">
          Ver Ficha Técnica <ArrowRight size={14} className="text-brand transition-transform group-hover:translate-x-1" />
        </div>
        
        {property.pdfUrl && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openPdf(property.pdfUrl!);
            }}
            className="w-full sm:w-auto px-4 py-2 text-center bg-slate-900 border border-slate-900 text-brand hover:bg-brand hover:text-black hover:border-brand uppercase tracking-widest font-bold text-[9px] transition-colors rounded-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Abrir portfolio
          </button>
        )}
      </div>
    </div>
  </motion.div>
);

export const PropertyListItem: React.FC<{ property: Property; onClick: (p: Property) => void }> = ({ property, onClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    onClick={() => onClick(property)}
    className="group bg-white hover:bg-neutral-50 px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer transition-colors duration-300"
  >
    <div className="flex items-center gap-4 flex-1 min-w-0">
      {/* Thumbnail */}
      <div className="w-16 h-16 shrink-0 bg-neutral-100 overflow-hidden relative border border-slate-100 rounded-sm">
        <img
          src={getPropertyImage(property)}
          alt={property.title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          referrerPolicy="no-referrer"
        />
      </div>
      
      {/* Title, Category & ID */}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          {property.assetId && (
            <span className="text-[9px] uppercase tracking-widest font-mono font-bold bg-slate-900 border border-slate-800 text-brand px-1.5 py-0.5 rounded-sm">
              {property.assetId}
            </span>
          )}
          <span className="text-[9px] uppercase tracking-widest font-bold text-brand-dark bg-brand/10 border border-brand/20 px-1.5 py-0.5 rounded-sm">
            {property.category}
          </span>
        </div>
        <h3 className="text-base sm:text-lg font-serif text-slate-800 font-medium leading-tight truncate group-hover:text-brand-dark transition-colors">
          {property.title}
        </h3>
      </div>
    </div>

    {/* Location, Type/Surface, Price and Action Button */}
    <div className="flex flex-wrap md:flex-nowrap items-center gap-6 md:gap-10 shrink-0 justify-between md:justify-end">
      {/* Location */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <MapPin size={14} className="text-brand-dark shrink-0" />
        <span className="truncate max-w-[140px] font-medium">{property.location}</span>
      </div>

      {/* Surface Built / Detail Info */}
      <div className="text-xs text-slate-400 font-mono hidden sm:block">
        {property.surface?.built ? (
          <span>Construido: {property.surface.built}</span>
        ) : (
          <span className="capitalize">{property.type}</span>
        )}
      </div>

      {/* Price */}
      <div className="text-left md:text-right min-w-[100px]">
        <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Precio de venta</p>
        <p className="text-base font-bold text-slate-800 font-mono">
          {property.salePrice || 'Consultar'}
        </p>
      </div>

      {/* Detail Button */}
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-slate-900 group-hover:text-brand bg-slate-50 group-hover:bg-slate-950 px-4 py-2.5 rounded-sm border border-slate-100 group-hover:border-slate-950 transition-all font-sans">
        Ver Ficha <ArrowRight size={12} className="text-slate-400 group-hover:text-brand transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  </motion.div>
);

export const PropertyList: React.FC<PropertyListProps> = ({ properties }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | Property['category']>('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-16 gap-8 border-b border-line pb-8">
          <div className="text-center lg:text-left">
            <span className="text-brand-dark uppercase tracking-[0.2em] text-xs font-bold mb-4 block underline underline-offset-8">Inversión</span>
            <h2 className="text-4xl md:text-5xl font-serif text-text-dark mt-4 leading-tight italic">Proyectos <span className="not-italic">& Oportunidades</span></h2>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-4 w-full lg:w-auto">
            {/* Category Filter Buttons */}
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

            {/* Separator */}
            <div className="hidden sm:block w-[1px] h-8 bg-line-light"></div>

            {/* Grid / List View Switcher */}
            <div className="flex border border-line-light p-1 bg-card-light rounded-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2.5 text-xs uppercase tracking-wider font-bold rounded-sm transition-all flex items-center gap-1.5",
                  viewMode === 'grid' 
                    ? "bg-brand text-black font-semibold shadow-sm" 
                    : "text-text-muted hover:text-text-dark hover:bg-neutral-50"
                )}
                title="Vista cuadrícula"
              >
                <LayoutGrid size={14} />
                <span className="hidden sm:inline text-[9px] tracking-widest">Cuadrícula</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2.5 text-xs uppercase tracking-wider font-bold rounded-sm transition-all flex items-center gap-1.5",
                  viewMode === 'list' 
                    ? "bg-brand text-black font-semibold shadow-sm" 
                    : "text-text-muted hover:text-text-dark hover:bg-neutral-50"
                )}
                title="Vista lista"
              >
                <List size={14} />
                <span className="hidden sm:inline text-[9px] tracking-widest">Lista</span>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="popLayout pb-6">
          {filteredProperties.length > 0 ? (
            viewMode === 'grid' ? (
              <motion.div 
                layout
                key="grid-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredProperties.map((p) => (
                  <PropertyCard key={p.id} property={p} onClick={setSelectedProperty} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                layout
                key="list-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col border border-line-light bg-white rounded-sm overflow-hidden shadow-xl divide-y divide-line-light"
              >
                {filteredProperties.map((p) => (
                  <PropertyListItem key={p.id} property={p} onClick={setSelectedProperty} />
                ))}
              </motion.div>
            )
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
