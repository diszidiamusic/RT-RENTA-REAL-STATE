import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Landmark, Users, CheckCircle2, ChevronRight, BarChart3, ShieldCheck, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

const sections = [
  {
    id: 'informes',
    title: 'Informes',
    icon: FileText,
    subtitle: 'Valor real para decisiones inteligentes',
    description: 'Dar mayor valor a sus activos inmobiliarios y asesorar en la conveniencia de su inversión o desinversión.',
    features: [
      { t: 'Valoración de activos', d: 'Precio correcto de mercado basado en registros reales, no solo tasaciones.' },
      { t: 'Estudio de mercado', d: 'Radiografía del entorno cercano para una toma de decisiones informada.' },
      { t: 'Valoración patrimonial', d: 'Diagnóstico a través del Informe de Valoración Patrimonial (IVP).' },
      { t: 'Liquidación de activos', d: 'Asesoramiento legal experto en procesos de litigio o concursos.' },
      { t: 'Técnicos', d: 'ITEs, Eficiencia Energética, Urbanismo y Levantamiento de planos.' }
    ]
  },
  {
    id: 'patrimonio',
    title: 'Patrimonio',
    icon: Landmark,
    subtitle: 'Maximice sus rentas',
    description: 'RT Renta le conducirá a una estrategia de inversión patrimonial acorde a su perfil.',
    features: [
      { t: 'Optimización de cartera', d: 'Actuaciones programadas por fases para aumentar el rendimiento.' },
      { t: 'Operaciones de desinversión', d: 'Ventas justificadas mediante informes de riesgo y oportunidad.' },
      { t: 'Máxima Rentabilidad', d: 'Especialistas en aumentar las rentas de activos arrendados.' },
      { t: 'Seguimiento Continuo', d: 'Información constante sobre el valor y conveniencia de sus activos.' }
    ]
  },
  {
    id: 'fincas',
    title: 'Admin. Fincas',
    icon: Users,
    subtitle: 'Legado y Confianza desde 1932',
    description: 'Trabajamos directamente con MASIFILL PATRIMONIA, referentes en Barcelona por su honestidad.',
    features: [
      { t: 'Gestión de comunidades', d: 'Trato personalizado y eficiente en la administración diaria.' },
      { t: 'Gestión de alquileres', d: 'Seguridad y rigor en la relación con arrendatarios.' },
      { t: 'Contratación de seguros', d: 'Protección integral de sus activos inmobiliarios.' },
      { t: 'Compra-Venta', d: 'Un ecosistema completo para el ciclo de vida del inmueble.' }
    ]
  }
];

export const Consultoria = () => {
  const [activeTab, setActiveTab] = useState('informes');

  const activeData = sections.find(s => s.id === activeTab)!;

  return (
    <div className="pt-32 pb-24 bg-bg-light min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-20">
          <span className="text-brand-dark uppercase tracking-[0.3em] text-xs font-bold mb-4 block underline underline-offset-8">Servicios Especializados</span>
          <h1 className="text-5xl md:text-7xl font-serif text-text-dark italic leading-none">
            Consultoría <span className="not-italic text-brand-dark">& Estrategia</span>
          </h1>
          <p className="mt-8 text-text-muted max-w-2xl text-lg font-light leading-relaxed">
            Nuestro enfoque combina el análisis técnico avanzado con una visión patrimonial a largo plazo para maximizar el valor de cada activo.
          </p>
        </div>

        {/* Interactive Tabs */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Navigation Sidebar */}
          <div className="lg:w-1/3 flex flex-col gap-2">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                className={cn(
                  "flex items-center gap-6 p-8 rounded-sm border transition-all duration-500 text-left group",
                  activeTab === s.id 
                    ? "bg-slate-900 border-slate-900 shadow-2xl translate-x-4" 
                    : "bg-white border-line-light hover:border-brand/40"
                )}
              >
                <div className={cn(
                  "p-4 rounded-sm transition-colors duration-500",
                  activeTab === s.id ? "bg-brand text-black" : "bg-bg-light text-brand-dark group-hover:bg-brand group-hover:text-black"
                )}>
                  <s.icon size={24} />
                </div>
                <div>
                  <h3 className={cn(
                    "text-xl font-serif tracking-tight",
                    activeTab === s.id ? "text-white" : "text-text-dark"
                  )}>{s.title}</h3>
                  <p className={cn(
                    "text-[10px] uppercase tracking-widest font-bold mt-1",
                    activeTab === s.id ? "text-brand" : "text-text-muted"
                  )}>{s.subtitle}</p>
                </div>
              </button>
            ))}

            <div className="mt-8 p-8 bg-brand/5 border border-brand/20 rounded-sm italic text-sm text-text-dark">
              "En RT Renta, unimos la experiencia técnica con el rigor analítico para ofrecer soluciones inmobiliarias de alto impacto."
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-line-light p-8 md:p-16 shadow-sm min-h-[600px] flex flex-col"
              >
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-[1px] bg-brand"></div>
                   <span className="text-[10px] uppercase tracking-widest font-bold text-brand-dark">{activeData.subtitle}</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-serif text-text-dark mb-6 italic">{activeData.title}</h2>
                <p className="text-text-muted text-lg mb-12 font-light leading-relaxed border-l-2 border-brand/20 pl-6">
                  {activeData.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                  {activeData.features.map((f, i) => (
                    <motion.div 
                      key={f.t}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group p-6 border border-transparent hover:border-line-light transition-all rounded-sm"
                    >
                      <h4 className="font-serif text-xl text-text-dark mb-2 flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-brand opacity-40 group-hover:opacity-100 transition-opacity" />
                        {f.t}
                      </h4>
                      <p className="text-text-muted text-sm leading-relaxed tracking-wide">
                        {f.d}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {activeTab === 'fincas' && (
                  <div className="mt-12 pt-8 border-t border-line-light flex flex-col md:flex-row items-center justify-between gap-8">
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-900 flex items-center justify-center text-white font-serif font-bold text-sm text-center p-2 rounded-sm italic">MASI<br/>FILL</div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-text-dark">Colaborador Estratégico</p>
                          <p className="text-text-muted text-[10px]">Estandar de honestidad en Barcelona desde 1932</p>
                        </div>
                     </div>
                     <button className="bg-slate-900 text-white px-8 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-brand hover:text-black transition-all">Ver Web Masifill</button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
