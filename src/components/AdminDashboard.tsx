import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Plus, Trash2, Edit3, Save, Image as ImageIcon, 
  Search, Filter, Upload, FileText, CheckCircle, 
  Eye, EyeOff, Sparkles, RefreshCw, AlertTriangle, ChevronDown
} from 'lucide-react';
import { Property, getPropertyImage } from './PropertyList';
import { addProperty, updateProperty, removeProperty } from '../services/firebaseService';
import { parseCSVToProperties, OFFICIAL_CSV_DATA } from '../lib/csvParser';

interface AdminDashboardProps {
  properties: Property[];
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ properties, onClose }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Search and Filters States
  const [adminSearch, setAdminSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterActive, setFilterActive] = useState<string>('all');

  // Loading States for Excel import
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importTotal, setImportTotal] = useState(0);
  
  // Form State
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
    observations: { status: 'ACTIVO', annualExpenses: '', annualRent: '' },
    salePrice: '',
    repercussion: '',
    yield: '',
    fees: '3% (No incluidos en el precio)',
    mapImage: '',
    pdfUrl: '',
    isActive: true
  });

  // Extract unique locations and statuses dynamically from the list
  const uniqueLocations = useMemo(() => {
    const set = new Set<string>();
    properties.forEach(p => {
      if (p.location) set.add(p.location.trim().toUpperCase());
    });
    return Array.from(set).sort();
  }, [properties]);

  const uniqueStatuses = useMemo(() => {
    const set = new Set<string>();
    properties.forEach(p => {
      if (p.observations?.status) set.add(p.observations.status.trim());
    });
    return Array.from(set).sort();
  }, [properties]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorState(null);
    setSaveLoading(true);

    // Safeguard for heavy base64 strings to prevent Firestore 1MB document size limit failures
    if (formData.pdfUrl && formData.pdfUrl.startsWith('data:') && formData.pdfUrl.length > 950 * 1024) {
      setErrorState("El archivo PDF del dossier es demasiado pesado (mayor de ~700 KB) para guardarse directamente en Firestore. Por favor, comprímalo antes de subirlo, o copie y pegue un enlace PDF estándar (por ejemplo, subiendo el archivo a Google Drive o Dropbox y pegando el enlace aquí).");
      setSaveLoading(false);
      return;
    }

    if (formData.image && formData.image.startsWith('data:') && formData.image.length > 950 * 1024) {
      setErrorState("La imagen de portada tiene un peso excesivo para guardarse como base64. Por favor, intente con una imagen más pequeña (menor de 700 KB) o use un enlace a una imagen en la web.");
      setSaveLoading(false);
      return;
    }

    try {
      if (editingId) {
        await updateProperty(editingId, formData);
        setEditingId(null);
      } else {
        await addProperty(formData);
      }
      setIsAdding(false);
      resetForm();
    } catch (err: any) {
      console.error("Error al guardar inmueble:", err);
      let errMsg = "Ocurrió un error inesperado al intentar guardar los cambios.";
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed && parsed.error) {
            errMsg = parsed.error;
          } else {
            errMsg = err.message;
          }
        } catch (jErr) {
          errMsg = err.message;
        }
      }
      setErrorState(errMsg);
    } finally {
      setSaveLoading(false);
    }
  };

  const resetForm = () => {
    setErrorState(null);
    setFormData({ 
      title: '', type: '', location: '', category: 'edificios', image: '',
      assetId: '', situation: '', assetTypeDetail: '',
      surface: { solar: '', built: '', year: '' },
      observations: { status: 'ACTIVO', annualExpenses: '', annualRent: '' },
      salePrice: '', repercussion: '', yield: '', fees: '3% (No incluidos en el precio)',
      mapImage: '', pdfUrl: '', isActive: true
    });
  };

  const handleEdit = (p: Property) => {
    setEditingId(p.id);
    setErrorState(null);
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
      observations: p.observations || { status: 'ACTIVO', annualExpenses: '', annualRent: '' },
      salePrice: p.salePrice || '',
      repercussion: p.repercussion || '',
      yield: p.yield || '',
      fees: p.fees || '3% (No incluidos en el precio)',
      mapImage: p.mapImage || '',
      pdfUrl: p.pdfUrl || '',
      isActive: p.isActive !== false
    });
    setIsAdding(true);
  };

  // Quick visibility toggle directly on the list row
  const toggleVisibility = async (p: Property) => {
    try {
      const nextActive = p.isActive === false ? true : false;
      await updateProperty(p.id, { isActive: nextActive });
    } catch (err) {
      console.error("Error al cambiar visibilidad:", err);
      alert("Error al intentar actualizar la visibilidad en tiempo real en la base de datos.");
    }
  };

  // Convert File uploads to local Base64/DataURLs instantly with file size protections!
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'pdfUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reject files that are over 750 KB to keep total payload safely below 1 MB of Firestore
    const maxBytes = 750 * 1024;
    if (file.size > maxBytes) {
      alert(`El archivo seleccionado es demasiado grande (${(file.size / 1024).toFixed(0)} KB).\n\nPara no saturar la base de datos de Firestore (límite estricto de 1MB por documento), el límite de subida directa es de 750 KB.\n\nPor favor, use un archivo PDF más comprimido o pegue un enlace público (Google Drive, Dropbox, etc.) abajo.`);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prev => ({
        ...prev,
        [field]: base64String
      }));
    };
    reader.readAsDataURL(file);
  };

  // One-click massive spreadsheet loader
  const handleBulkImport = async (csvData: string) => {
    if (importing) return;
    try {
      const parsed = parseCSVToProperties(csvData);
      if (parsed.length === 0) {
        alert("No se encontraron registros válidos en el archivo Excel/CSV.");
        return;
      }

      setImporting(true);
      setImportTotal(parsed.length);
      setImportProgress(0);

      // To prevent duplicate additions, we map the current properties to check existing reference codes
      const existingRefCodes = new Set(properties.map(p => p.assetId?.trim().toUpperCase()).filter(Boolean));

      let count = 0;
      for (const prop of parsed) {
        // Only insert if it doesn't already exist to avoid spamming duplicates
        if (prop.assetId && existingRefCodes.has(prop.assetId.trim().toUpperCase())) {
          count++;
          setImportProgress(count);
          continue; // Skip
        }

        await addProperty(prop);
        count++;
        setImportProgress(count);
        // Small brief timeout to let firestore rules process peacefully without exhausting connections
        await new Promise(resolve => setTimeout(resolve, 60));
      }

      setImporting(false);
      alert(`¡Carga inicial completada con éxito! Se cargaron los inmuebles nuevos del Excel.`);
    } catch (err) {
      console.error(err);
      setImporting(false);
      alert("Error en la importación masiva del excel/csv.");
    }
  };

  // Custom user CSV file selector handler
  const handleCustomCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const csvContent = reader.result as string;
      handleBulkImport(csvContent);
    };
    reader.readAsText(file);
  };

  // Filter properties according to admin filters
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      // Search term checks code (assetId) or title
      const matchSearch = adminSearch === '' || 
        p.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
        (p.assetId || '').toLowerCase().includes(adminSearch.toLowerCase()) ||
        (p.location || '').toLowerCase().includes(adminSearch.toLowerCase()) ||
        (p.type || '').toLowerCase().includes(adminSearch.toLowerCase());

      const matchCategory = filterCategory === 'all' || p.category === filterCategory;
      const matchLocation = filterLocation === 'all' || p.location?.trim().toUpperCase() === filterLocation;
      const matchStatus = filterStatus === 'all' || p.observations?.status?.trim() === filterStatus;
      
      let matchActive = true;
      if (filterActive === 'active') matchActive = p.isActive !== false;
      if (filterActive === 'inactive') matchActive = p.isActive === false;

      return matchSearch && matchCategory && matchLocation && matchStatus && matchActive;
    });
  }, [properties, adminSearch, filterCategory, filterLocation, filterStatus, filterActive]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-bg-dark/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-6"
    >
      <div className="bg-card-dark w-full max-w-5xl h-[90vh] rounded-sm shadow-2xl flex flex-col overflow-hidden border border-line">
        
        {/* Header */}
        <div className="p-6 border-b border-line flex flex-col md:flex-row md:items-center justify-between gap-4 bg-bg-dark">
          <div className="flex flex-col">
            <h2 className="text-2xl font-serif text-white tracking-tight italic flex items-center gap-2">
              <Sparkles className="text-brand size-6" />
              Gestión Privada de Inmuebles
            </h2>
            <span className="text-[9px] uppercase tracking-widest text-text-muted font-bold mt-1">
              Panel Administrativo de RT Renta • Control en Tiempo Real
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Progress bar overlay during bulk upload */}
        {importing && (
          <div className="bg-brand/10 border-b border-brand/30 px-6 py-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px] font-mono text-brand uppercase font-bold tracking-wider">
              <span>Sincronizando Excel con Base de Datos...</span>
              <span>{importProgress} / {importTotal} Activos</span>
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-brand h-full transition-all duration-300" 
                style={{ width: `${(importProgress / importTotal) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Scrollable View */}
        <div className="flex-1 overflow-y-auto p-6 bg-card-dark">
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-bg-dark p-6 md:p-8 rounded-sm border border-line shadow-xl"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorState && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 font-sans text-xs flex items-center gap-3">
                      <AlertTriangle size={16} className="shrink-0" />
                      <div>
                        <p className="font-bold">Error al guardar los cambios</p>
                        <p className="text-[11px] mt-0.5">{errorState}</p>
                      </div>
                    </div>
                  )}

                  {/* Header indicators */}
                  <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
                    <span className="text-xs font-serif text-brand font-bold italic uppercase tracking-wider">
                      {editingId ? 'Editando Inmueble Existente' : 'Crear Ficha de Nuevo Activo'}
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={formData.isActive !== false}
                          onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                          className="h-4 w-4 accent-brand border-line rounded bg-card-dark text-black focus:ring-0"
                        />
                        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-white">
                          Visible en la Web (Activo)
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">ID Activo / Referencia</label>
                      <input 
                        className="w-full bg-card-dark border border-line px-4 py-3 outline-none focus:border-brand transition-colors font-sans text-sm text-white"
                        value={formData.assetId || ''}
                        onChange={e => setFormData({ ...formData, assetId: e.target.value })}
                        placeholder="Ej: SL-A141"
                      />
                    </div>
                    <div className="space-y-2 lg:col-span-2">
                       <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Nombre del Activo / Dirección</label>
                       <input 
                        required
                        className="w-full bg-card-dark border border-line px-4 py-3 outline-none focus:border-brand transition-colors font-sans text-sm text-white"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ej: Suelos Canet de Mar"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Situación y Descripción del Activo</label>
                    <textarea 
                      className="w-full bg-card-dark border border-line px-4 py-3 outline-none focus:border-brand transition-colors font-sans text-sm text-white h-24 resize-none"
                      value={formData.situation || ''}
                      onChange={e => setFormData({ ...formData, situation: e.target.value })}
                      placeholder="Ubicación estratégica, comunicaciones, oportunidades comerciales, etc."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Tipo Activo (Uso y Detalles Técnicos)</label>
                      <textarea 
                        className="w-full bg-card-dark border border-line px-4 py-3 outline-none focus:border-brand transition-colors font-sans text-sm text-white h-24 resize-none"
                        value={formData.assetTypeDetail || ''}
                        onChange={e => setFormData({ ...formData, assetTypeDetail: e.target.value })}
                        placeholder="Uso residencial, número de viviendas, clave urbanística, etc."
                      />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Superficie Terreno / Construcción</label>
                       <div className="grid grid-cols-2 gap-4">
                          <input 
                            className="bg-card-dark border border-line px-4 py-3 text-sm text-white outline-none focus:border-brand"
                            value={formData.surface?.solar || ''}
                            onChange={e => setFormData({ ...formData, surface: { ...formData.surface, solar: e.target.value } })}
                            placeholder="Solar / Parcela (m2)"
                          />
                          <input 
                            className="bg-card-dark border border-line px-4 py-3 text-sm text-white outline-none focus:border-brand"
                            value={formData.surface?.built || ''}
                            onChange={e => setFormData({ ...formData, surface: { ...formData.surface, built: e.target.value } })}
                            placeholder="Edificabilidad / Built (m2)"
                          />
                          <input 
                            className="bg-card-dark border border-line px-4 py-3 text-sm text-white outline-none focus:border-brand col-span-2"
                            value={formData.surface?.year || ''}
                            onChange={e => setFormData({ ...formData, surface: { ...formData.surface, year: e.target.value } })}
                            placeholder="Año o Fase de Gestión (Ej: 1985 / Solar Finalista)"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Ubicación (Provincia / Población)</label>
                       <input 
                        required
                        className="w-full bg-card-dark border border-line px-4 py-3 outline-none focus:border-brand transition-colors font-sans text-sm text-white"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Ej: BARCELONA"
                      />
                    </div>
                    <div className="space-y-2 text-white">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Categoría Sectorial</label>
                      <div className="relative">
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
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Uso Específico</label>
                      <input 
                        required
                        className="w-full bg-card-dark border border-line px-4 py-3 outline-none focus:border-brand transition-colors font-sans text-sm text-white"
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                        placeholder="Ej: RESIDENCIAL / HOTELERO"
                      />
                    </div>
                  </div>

                  {/* Pricing and Observations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/40 p-6 rounded-sm border border-line">
                     <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-brand">Venta e Inversión</label>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <span className="text-[9px] text-text-muted uppercase">Precio Total (€)</span>
                              <input 
                                className="w-full bg-card-dark border border-line px-4 py-2 text-sm text-white"
                                value={formData.salePrice || ''}
                                onChange={e => setFormData({ ...formData, salePrice: e.target.value })}
                                placeholder="Ej: 6.500.000 €"
                              />
                           </div>
                           <div className="space-y-1">
                              <span className="text-[9px] text-text-muted uppercase">Repercusión por m2</span>
                              <input 
                                className="w-full bg-card-dark border border-line px-4 py-2 text-sm text-white"
                                value={formData.repercussion || ''}
                                onChange={e => setFormData({ ...formData, repercussion: e.target.value })}
                                placeholder="Ej: 757,18 €"
                              />
                           </div>
                           <div className="space-y-1">
                              <span className="text-[9px] text-text-muted uppercase">Rentabilidad Esperada</span>
                              <input 
                                className="w-full bg-card-dark border border-line px-4 py-2 text-sm text-white"
                                value={formData.yield || ''}
                                onChange={e => setFormData({ ...formData, yield: e.target.value })}
                                placeholder="Ej: 4.5% Bruta"
                              />
                           </div>
                           <div className="space-y-1">
                              <span className="text-[9px] text-text-muted uppercase">Honorarios Profesionales</span>
                              <input 
                                className="w-full bg-card-dark border border-line px-4 py-2 text-sm text-white"
                                value={formData.fees || ''}
                                onChange={e => setFormData({ ...formData, fees: e.target.value })}
                              />
                           </div>
                        </div>
                     </div>
                     
                     <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-brand">Estado de Operación y Observación</label>
                        <div className="space-y-3">
                           <div>
                              <span className="text-[9px] text-text-muted uppercase block mb-1">Estado (Ej: ACTIVO / VENDIDO / PENDIENTE)</span>
                              <input 
                                className="w-full bg-card-dark border border-line px-4 py-2 text-sm text-white"
                                value={formData.observations?.status || ''}
                                onChange={e => setFormData({ ...formData, observations: { ...formData.observations, status: e.target.value } })}
                                placeholder="Estado de venta (Ej: ACTIVO)"
                              />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                 <span className="text-[9px] text-text-muted uppercase">Otros Datos</span>
                                 <input 
                                   className="w-full bg-card-dark border border-line px-4 py-2 text-sm text-white"
                                   value={formData.observations?.annualExpenses || ''}
                                   onChange={e => setFormData({ ...formData, observations: { ...formData.observations, annualExpenses: e.target.value } })}
                                   placeholder="Gastos / Detalle adicional"
                                 />
                              </div>
                              <div className="space-y-1">
                                 <span className="text-[9px] text-text-muted uppercase">Tipo Inversión</span>
                                 <input 
                                   className="w-full bg-card-dark border border-line px-4 py-2 text-sm text-white"
                                   value={formData.observations?.annualRent || ''}
                                   onChange={e => setFormData({ ...formData, observations: { ...formData.observations, annualRent: e.target.value } })}
                                   placeholder="Tipo inversión / Notas"
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Portfolio PDF and Images Link Block */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-sm border border-line">
                     <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-white flex items-center gap-2">
                           <ImageIcon size={14} className="text-brand"/>
                           Dirección de Imagen de Portada (URL)
                        </label>
                        <div className="flex flex-col gap-4">
                           <input 
                              className="w-full bg-card-dark border border-line px-4 py-3 text-xs text-white"
                              value={formData.image || ''}
                              onChange={e => setFormData({ ...formData, image: e.target.value })}
                              placeholder="Pegue la dirección URL de la imagen de portada"
                           />
                           {getPropertyImage(formData as Property) && (
                              <div className="h-20 w-32 relative border border-line rounded-sm overflow-hidden bg-black/40">
                                 <img src={getPropertyImage(formData as Property)} className="w-full h-full object-cover" alt="Vista previa" />
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-white flex items-center gap-2">
                           <FileText size={14} className="text-brand" />
                           Enlace al Dossier PDF (URL)
                        </label>
                        <div className="flex flex-col gap-4">
                           <input 
                              className="w-full bg-card-dark border border-line px-4 py-3 text-xs text-white"
                              value={formData.pdfUrl || ''}
                              onChange={e => setFormData({ ...formData, pdfUrl: e.target.value })}
                              placeholder="Pegue el enlace público al archivo PDF (Google Drive/Dropbox etc.)"
                           />
                           {formData.pdfUrl && (
                              <div className="text-[9px] text-[#22c55e] font-mono flex items-center gap-2">
                                 <CheckCircle size={12} /> Enlace de dossier PDF configurado.
                              </div>
                           )}
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-line">
                    <button 
                      type="submit" 
                      disabled={saveLoading}
                      className="flex-1 bg-brand disabled:bg-stone-700 disabled:text-stone-400 text-black flex items-center justify-center gap-2 py-4 uppercase tracking-widest text-[10px] font-bold hover:bg-brand-light transition-all rounded-sm shadow-xl shadow-brand/10 disabled:cursor-not-allowed"
                    >
                      {saveLoading ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      {editingId ? 'Guardar Cambios Registrados' : 'Añadir Inmueble a Firestore'}
                    </button>
                    <button 
                      type="button" 
                      disabled={saveLoading}
                      onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}
                      className="px-8 bg-white/5 text-text-muted uppercase tracking-widest text-[10px] font-bold hover:bg-white/10 transition-all font-sans border border-line rounded-sm disabled:opacity-50"
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
                className="space-y-6"
              >
                {/* Search and Filters Hub */}
                <div className="p-4 bg-bg-dark border border-line rounded-sm space-y-4">
                  <div className="flex items-center gap-2 text-white font-serif italic text-sm border-b border-line pb-3">
                     <Filter size={14} className="text-brand shrink-0" />
                     <span>Buscador Avanzado y Criterios de Selección</span>
                  </div>
                  
                  {/* Quick Text Search */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input 
                      type="text"
                      className="w-full bg-card-dark border border-line px-12 py-3 outline-none focus:border-brand transition-colors text-xs text-white font-sans"
                      placeholder="Buscar por referencia, nombre del inmueble, ubicación..."
                      value={adminSearch}
                      onChange={e => setAdminSearch(e.target.value)}
                    />
                  </div>

                  {/* Multi-variable selectors */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {/* Category Selector */}
                     <div className="space-y-1">
                        <span className="text-[8px] uppercase font-bold text-text-muted block">Categoría</span>
                        <div className="relative">
                           <select 
                             className="w-full bg-card-dark border border-line p-2 text-[10px] text-white outline-none rounded-sm cursor-pointer appearance-none"
                             value={filterCategory}
                             onChange={e => setFilterCategory(e.target.value)}
                           >
                              <option value="all">Sectores (Todos)</option>
                              <option value="edificios">Edificios</option>
                              <option value="hoteles">Hoteles</option>
                              <option value="industrial">Industrial</option>
                              <option value="solar">Suelo</option>
                              <option value="local">Local</option>
                              <option value="oficinas">Oficinas</option>
                              <option value="singulares">Singulares</option>
                           </select>
                           <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        </div>
                     </div>

                     {/* Location Selector */}
                     <div className="space-y-1">
                        <span className="text-[8px] uppercase font-bold text-text-muted block">Ubicación</span>
                        <div className="relative">
                           <select 
                             className="w-full bg-card-dark border border-line p-2 text-[10px] text-white outline-none rounded-sm cursor-pointer appearance-none"
                             value={filterLocation}
                             onChange={e => setFilterLocation(e.target.value)}
                           >
                              <option value="all">Ubicación (Todas)</option>
                              {uniqueLocations.map(loc => (
                                 <option key={loc} value={loc}>{loc}</option>
                              ))}
                           </select>
                           <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        </div>
                     </div>

                     {/* Status Selector */}
                     <div className="space-y-1">
                        <span className="text-[8px] uppercase font-bold text-text-muted block">Estado Operativo</span>
                        <div className="relative">
                           <select 
                             className="w-full bg-card-dark border border-line p-2 text-[10px] text-white outline-none rounded-sm cursor-pointer appearance-none"
                             value={filterStatus}
                             onChange={e => setFilterStatus(e.target.value)}
                           >
                              <option value="all">Fase / Exclusiva (Todos)</option>
                              {uniqueStatuses.map(st => (
                                 <option key={st} value={st}>{st}</option>
                              ))}
                           </select>
                           <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        </div>
                     </div>

                     {/* Visibility selector */}
                     <div className="space-y-1">
                        <span className="text-[8px] uppercase font-bold text-text-muted block">Visibilidad Web</span>
                        <div className="relative">
                           <select 
                             className="w-full bg-card-dark border border-line p-2 text-[10px] text-white outline-none rounded-sm cursor-pointer appearance-none"
                             value={filterActive}
                             onChange={e => setFilterActive(e.target.value)}
                           >
                              <option value="all">Mostrar (Todos)</option>
                              <option value="active">Solo Activos (Visibles)</option>
                              <option value="inactive">Solo Inactivos (Bajas / Desactivados)</option>
                           </select>
                           <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        </div>
                     </div>
                  </div>

                  {/* Reset filters button */}
                  {(adminSearch !== '' || filterCategory !== 'all' || filterLocation !== 'all' || filterStatus !== 'all' || filterActive !== 'all') && (
                     <div className="flex justify-end pt-2">
                        <button 
                          onClick={() => {
                             setAdminSearch('');
                             setFilterCategory('all');
                             setFilterLocation('all');
                             setFilterStatus('all');
                             setFilterActive('all');
                          }}
                          className="text-[9px] uppercase tracking-widest text-[#a8a29e] hover:text-brand font-bold underline transition-colors"
                        >
                           Restablecer Filtros
                        </button>
                     </div>
                  )}
                </div>

                {/* Listing Action Bar */}
                <div className="flex justify-between items-center bg-bg-dark border border-line p-4 rounded-sm">
                  <p className="text-text-muted text-[10px] font-sans uppercase tracking-[0.2em] font-bold">
                    {filteredProperties.length} de {properties.length} Inmues registrados
                  </p>
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-brand text-black px-6 py-2.5 uppercase tracking-widest text-[10px] font-bold hover:bg-brand-light transition-all rounded-sm shadow-xl shadow-brand/10"
                  >
                    <Plus size={14} /> Añadir Activo Manualmente
                  </button>
                </div>

                {/* Dashboard Property Cards List */}
                <div className="grid gap-3">
                  {filteredProperties.map((p) => {
                    const isActive = p.isActive !== false;
                    return (
                      <div 
                        key={p.id} 
                        className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-4 border border-line bg-bg-dark hover:border-brand/40 transition-colors group rounded-sm"
                      >
                        {/* Image Preview */}
                        <div className="w-16 h-16 bg-card-dark rounded-sm overflow-hidden shrink-0 border border-line relative">
                          <img src={getPropertyImage(p)} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" alt="" />
                          {!isActive && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-[7px] text-red-500 border border-red-500/55 px-1 py-0.2 rounded font-sans uppercase font-bold tracking-widest">
                                Inactivo
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Text Fields */}
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            {p.assetId && (
                              <span className="text-brand font-bold font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 border border-brand/20 rounded-sm bg-brand/5">
                                {p.assetId}
                              </span>
                            )}
                            <span className="text-text-muted text-[9px] uppercase tracking-widest font-bold">
                              {p.type} • {p.location}
                            </span>
                          </div>
                          <h4 className="font-serif text-base text-white line-clamp-1 italic mt-1.5">{p.title}</h4>
                          <div className="flex items-center gap-4 text-[9px] text-[#a8a29e] mt-1 italic font-sans flex-wrap">
                             {p.salePrice && <span>Inversión: <strong className="text-white not-italic">{p.salePrice}</strong></span>}
                             {p.yield && <span>Rentabilidad: <strong className="text-white not-italic">{p.yield}</strong></span>}
                             {p.observations?.status && <span>Fase: <strong className="text-brand not-italic">{p.observations.status}</strong></span>}
                             {p.pdfUrl ? (
                                <span className="text-[#22c55e] flex items-center gap-1 font-sans font-bold">
                                   <FileText size={10} /> PDF Vinculado
                                </span>
                             ) : (
                                <span className="text-red-400 flex items-center gap-1 font-sans">
                                   Sin Dossier PDF
                                </span>
                             )}
                          </div>
                        </div>

                        {/* Inline Actions (Toggle visibility, Edit, Delete) */}
                        <div className="flex items-center gap-2 justify-end pt-2 md:pt-0 border-t border-line/50 md:border-t-0 shrink-0">
                          {/* Visibility toggle icon button */}
                          <button 
                            onClick={() => toggleVisibility(p)}
                            title={isActive ? "Hacer Inactivo / Ocultar de la web" : "Hacer Activo / Mostrar en la web"}
                            className={`p-2.5 rounded-sm border transition-colors ${isActive ? 'text-[#22c55e] hover:bg-white/5 border-[#22c55e]/20' : 'text-text-muted hover:bg-white/5 border-line'}`}
                          >
                             {isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                          
                          <button 
                            onClick={() => handleEdit(p)} 
                            title="Editar parámetros"
                            className="p-2.5 text-text-muted hover:text-brand border border-line hover:border-brand/40 bg-white/50 bg-opacity-0 hover:bg-opacity-5 transition-all rounded-sm"
                          >
                            <Edit3 size={16} />
                          </button>
                          
                          <button 
                            onClick={() => {
                              if (confirm(`¿Está seguro de que desea eliminar permanentemente el activo ${p.assetId || p.title}?`)) {
                                removeProperty(p.id);
                              }
                            }} 
                            title="Eliminar activo de Firestore"
                            className="p-2.5 text-[#ef4444] hover:text-red-400 border border-line hover:border-[#ef4444]/40 bg-[#ef4444] bg-opacity-0 hover:bg-opacity-5 transition-all rounded-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  
                  {filteredProperties.length === 0 && (
                     <div className="py-24 border-2 border-dashed border-line rounded-sm flex flex-col items-center justify-center text-center p-6 bg-black/20">
                        <AlertTriangle className="text-text-muted size-10 mb-4" />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold">
                           Ningún inmueble coincide con sus criterios de búsqueda
                        </span>
                        <p className="text-text-muted text-[10px] mt-2 max-w-sm">
                           Intente cambiar los filtros o añadir un nuevo activo manualmente.
                        </p>
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
