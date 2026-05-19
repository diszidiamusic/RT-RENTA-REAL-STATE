import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Edit3, Save, Image as ImageIcon } from 'lucide-react';
import { Property } from './PropertyList';
import { addProperty, updateProperty, removeProperty } from '../services/firebaseService';

interface AdminDashboardProps {
  properties: Property[];
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ properties, onClose }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Property, 'id'>>({
    title: '',
    type: '',
    location: '',
    category: 'edificios',
    image: '',
    assetId: '',
    situation: '',
    assetTypeDetail: '',
    surface: { solar: '', built: '', year: '' },
    observations: { status: '', annualExpenses: '', annualRent: '' },
    salePrice: '',
    repercussion: '',
    yield: '',
    fees: '3% (No incluidos en el precio)',
    mapImage: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateProperty(editingId, formData);
      setEditingId(null);
    } else {
      await addProperty(formData);
      setIsAdding(false);
    }
    setFormData({ 
      title: '', type: '', location: '', category: 'edificios', image: '',
      assetId: '', situation: '', assetTypeDetail: '',
      surface: { solar: '', built: '', year: '' },
      observations: { status: '', annualExpenses: '', annualRent: '' },
      salePrice: '', repercussion: '', yield: '', fees: '3% (No incluidos en el precio)',
      mapImage: ''
    });
  };

  const handleEdit = (p: Property) => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      type: p.type,
      location: p.location,
      category: p.category,
      image: p.image,
      assetId: p.assetId || '',
      situation: p.situation || '',
      assetTypeDetail: p.assetTypeDetail || '',
      surface: p.surface || { solar: '', built: '', year: '' },
      observations: p.observations || { status: '', annualExpenses: '', annualRent: '' },
      salePrice: p.salePrice || '',
      repercussion: p.repercussion || '',
      yield: p.yield || '',
      fees: p.fees || '3% (No incluidos en el precio)',
      mapImage: p.mapImage || ''
    });
    setIsAdding(true);
  };

  const seedInitialData = async () => {
    const initialProperties: Omit<Property, 'id'>[] = [
      {
        assetId: 'ED-A130',
        title: 'Edif. Residencial en C/ Gomis, 08023 Barcelona',
        type: 'Edificio Residencial',
        location: 'Barcelona (Gracia)',
        category: 'edificios',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
        situation: 'Edificio Residencial situado en la C/ Gomis, en el barrio de Vallcarca, del Distrito de Gracia, Barcelona. Perfectamente comunicado entre la zona alta de la ciudad y el centro de Barcelona.',
        assetTypeDetail: 'Edificio entre medianeras con clave urbanística 13a.\nLa finca requiere de una actualización, dispone de ascensor y el ITE es favorable.\nEntidades: 21 entidades: 3 locales, antigua vivienda del portero y 17 viviendas.\nOcupación: 3 libres, 11 a término y 7 indefinidos.',
        surface: { solar: '279 m2', built: '1.658 m2 (s/ catastro)', year: '1960' },
        observations: { status: 'Finca en Rentabilidad', annualExpenses: '25.306, 68 €', annualRent: '136.492 €' },
        salePrice: '4.500.000,00 €',
        repercussion: '2.714,11 €/m2',
        yield: '3% bruta actual – 5% potencial',
        fees: '3% (No incluidos en el precio)',
        mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000'
      },
      {
        title: 'Nave Industrial Sale & Leaseback',
        type: 'Industrial',
        location: 'Sant Adrià de Besòs',
        category: 'industrial',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
      },
      {
        title: 'Suelo Terciario en Avda. Aragón',
        type: 'Suelo Terciario',
        location: 'Madrid',
        category: 'solar',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
      },
    ];

    for (const p of initialProperties) {
      await addProperty(p);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-bg-dark/95 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <div className="bg-card-dark w-full max-w-4xl h-[80vh] rounded-sm shadow-2xl flex flex-col overflow-hidden border border-line">
        <div className="p-6 border-b border-line flex items-center justify-between bg-bg-dark">
          <div className="flex flex-col">
            <h2 className="text-2xl font-serif text-white tracking-tight italic">Gestión de Proyectos</h2>
            <span className="text-[9px] uppercase tracking-widest text-text-muted font-bold">Panel de Gestión de Inmuebles</span>
          </div>
          <div className="flex items-center gap-4">
            {properties.length === 0 && (
              <button 
                onClick={seedInitialData}
                className="text-[10px] uppercase tracking-widest font-bold text-brand hover:underline"
              >
                Cargar Datos Iniciales
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-card-dark">
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-bg-dark p-8 rounded-sm border border-line shadow-xl"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">ID Activo</label>
                      <input 
                        className="w-full bg-card-dark border border-line px-4 py-3 outline-none focus:border-brand transition-colors font-sans text-sm text-white"
                        value={formData.assetId}
                        onChange={e => setFormData({ ...formData, assetId: e.target.value })}
                        placeholder="Ej: ED-A130"
                      />
                    </div>
                    <div className="space-y-2 lg:col-span-2">
                       <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Título / Dirección</label>
                       <input 
                        required
                        className="w-full bg-card-dark border border-line px-4 py-3 outline-none focus:border-brand transition-colors font-sans text-sm text-white"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ej: Edif. Residencial en C/ Gomis, Barcelona"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Situación (Descripción larga)</label>
                    <textarea 
                      className="w-full bg-card-dark border border-line px-4 py-3 outline-none focus:border-brand transition-colors font-sans text-sm text-white h-24 resize-none"
                      value={formData.situation}
                      onChange={e => setFormData({ ...formData, situation: e.target.value })}
                      placeholder="Ubicación detallada, comunicaciones, barrio..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Tipo Activo (Detalle Técnico)</label>
                      <textarea 
                        className="w-full bg-card-dark border border-line px-4 py-3 outline-none focus:border-brand transition-colors font-sans text-sm text-white h-24 resize-none"
                        value={formData.assetTypeDetail}
                        onChange={e => setFormData({ ...formData, assetTypeDetail: e.target.value })}
                        placeholder="Uso, clave urbanística, estado ITE, número de entidades..."
                      />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Superficie</label>
                       <div className="grid grid-cols-2 gap-4">
                          <input 
                            className="bg-card-dark border border-line px-4 py-2 text-sm text-white outline-none focus:border-brand"
                            value={formData.surface?.solar}
                            onChange={e => setFormData({ ...formData, surface: { ...formData.surface, solar: e.target.value } })}
                            placeholder="Solar (m2)"
                          />
                          <input 
                            className="bg-card-dark border border-line px-4 py-2 text-sm text-white outline-none focus:border-brand"
                            value={formData.surface?.built}
                            onChange={e => setFormData({ ...formData, surface: { ...formData.surface, built: e.target.value } })}
                            placeholder="Construida (m2)"
                          />
                          <input 
                            className="bg-card-dark border border-line px-4 py-2 text-sm text-white outline-none focus:border-brand col-span-2"
                            value={formData.surface?.year}
                            onChange={e => setFormData({ ...formData, surface: { ...formData.surface, year: e.target.value } })}
                            placeholder="Año de Construcción"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Localización (Barrio/Ciudad)</label>
                       <input 
                        required
                        className="w-full bg-card-dark border border-line px-4 py-3 outline-none focus:border-brand transition-colors font-sans text-sm text-white"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Ej: Barcelona"
                      />
                    </div>
                    <div className="space-y-2 text-white">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Categoría</label>
                      <select 
                        className="w-full bg-card-dark border border-line px-4 py-3 outline-none focus:border-brand transition-colors font-sans text-sm text-white appearance-none"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                      >
                        <option value="edificios">Edificios</option>
                        <option value="hoteles">Hoteles</option>
                        <option value="industrial">Industrial</option>
                        <option value="solar">Suelo</option>
                        <option value="local">Local</option>
                        <option value="oficinas">Oficinas</option>
                        <option value="singulares">Singulares</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Tipo Simplificado</label>
                      <input 
                        required
                        className="w-full bg-card-dark border border-line px-4 py-3 outline-none focus:border-brand transition-colors font-sans text-sm text-white"
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                        placeholder="Ej: Vertical / Residencial"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 p-6 rounded-sm border border-line">
                     <div className="space-y-4">
                        <label className="text-[9px] uppercase tracking-widest font-bold text-brand">Datos Financieros</label>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <span className="text-[9px] text-text-muted uppercase">Precio Venta (con €)</span>
                              <input 
                                className="w-full bg-card-dark border border-line px-4 py-2 text-sm text-white"
                                value={formData.salePrice}
                                onChange={e => setFormData({ ...formData, salePrice: e.target.value })}
                                placeholder="Ej: 4.500.000 €"
                              />
                           </div>
                           <div className="space-y-1">
                              <span className="text-[9px] text-text-muted uppercase">Repercusión</span>
                              <input 
                                className="w-full bg-card-dark border border-line px-4 py-2 text-sm text-white"
                                value={formData.repercussion}
                                onChange={e => setFormData({ ...formData, repercussion: e.target.value })}
                                placeholder="Ej: 2.714 €/m2"
                              />
                           </div>
                           <div className="space-y-1">
                              <span className="text-[9px] text-text-muted uppercase">Rentabilidad</span>
                              <input 
                                className="w-full bg-card-dark border border-line px-4 py-2 text-sm text-white"
                                value={formData.yield}
                                onChange={e => setFormData({ ...formData, yield: e.target.value })}
                                placeholder="3% bruta - 5% pot."
                              />
                           </div>
                           <div className="space-y-1">
                              <span className="text-[9px] text-text-muted uppercase">Honorarios</span>
                              <input 
                                className="w-full bg-card-dark border border-line px-4 py-2 text-sm text-white"
                                value={formData.fees}
                                onChange={e => setFormData({ ...formData, fees: e.target.value })}
                              />
                           </div>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[9px] uppercase tracking-widest font-bold text-brand">Observaciones de Renta</label>
                        <div className="space-y-3">
                           <input 
                             className="w-full bg-card-dark border border-line px-4 py-2 text-sm text-white"
                             value={formData.observations?.status}
                             onChange={e => setFormData({ ...formData, observations: { ...formData.observations, status: e.target.value } })}
                             placeholder="Estado (Ej: En Rentabilidad)"
                           />
                           <input 
                             className="w-full bg-card-dark border border-line px-4 py-2 text-sm text-white"
                             value={formData.observations?.annualExpenses}
                             onChange={e => setFormData({ ...formData, observations: { ...formData.observations, annualExpenses: e.target.value } })}
                             placeholder="Gastos anuales"
                           />
                           <input 
                             className="w-full bg-card-dark border border-line px-4 py-2 text-sm text-white"
                             value={formData.observations?.annualRent}
                             onChange={e => setFormData({ ...formData, observations: { ...formData.observations, annualRent: e.target.value } })}
                             placeholder="Renta Anual Actual"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">URL Imagen Principal</label>
                       <input 
                        required
                        className="w-full bg-card-dark border border-line px-4 py-3 outline-none focus:border-brand transition-colors font-sans text-sm text-white"
                        value={formData.image}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">URL Imagen Mapa/Entorno</label>
                       <input 
                        className="w-full bg-card-dark border border-line px-4 py-3 outline-none focus:border-brand transition-colors font-sans text-sm text-white"
                        value={formData.mapImage}
                        onChange={e => setFormData({ ...formData, mapImage: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 bg-brand text-black flex items-center justify-center gap-2 py-4 uppercase tracking-widest text-[10px] font-bold hover:bg-brand-light transition-all rounded-sm">
                      <Save size={16} /> {editingId ? 'Actualizar' : 'Guardar Proyecto'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { setIsAdding(false); setEditingId(null); }}
                      className="px-8 bg-white/5 text-text-muted uppercase tracking-widest text-[10px] font-bold hover:bg-white/10 transition-all font-sans border border-line rounded-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center mb-8">
                  <p className="text-text-muted text-[10px] font-sans uppercase tracking-[0.2em] font-bold">{properties.length} Inmuebles Indexados</p>
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-brand text-black px-6 py-2 uppercase tracking-widest text-[10px] font-bold hover:bg-brand-light transition-all rounded-sm shadow-lg shadow-brand/10"
                  >
                    <Plus size={16} /> Añadir Inmueble
                  </button>
                </div>

                <div className="grid gap-4">
                  {properties.map((p) => (
                    <div key={p.id} className="flex items-center gap-6 p-4 border border-line bg-bg-dark hover:border-brand/40 transition-colors group rounded-sm">
                      <div className="w-20 h-20 bg-card-dark rounded-sm overflow-hidden shrink-0 border border-line">
                        <img src={p.image} className="w-full h-full object-cover opacity-70 group-hover:opacity-100" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-lg text-white line-clamp-1 italic">{p.title}</h4>
                        <p className="text-text-muted text-[9px] uppercase tracking-widest font-bold mt-1">{p.type} • {p.location}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(p)} className="p-2 text-text-muted hover:text-brand transition-colors"><Edit3 size={18} /></button>
                        <button onClick={() => removeProperty(p.id)} className="p-2 text-text-muted hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                  
                  {properties.length === 0 && (
                     <div className="py-20 border-2 border-dashed border-line rounded-sm flex flex-col items-center justify-center opacity-50">
                        <div className="w-16 h-16 rounded-full border border-dashed border-text-muted flex items-center justify-center text-3xl font-light text-text-muted mb-4 cursor-pointer hover:border-brand hover:text-brand transition-colors" onClick={() => setIsAdding(true)}>+</div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold">No hay inmuebles registrados</span>
                     </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
