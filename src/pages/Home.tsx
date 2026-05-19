import React from 'react';
import { Hero } from '../components/Hero';
import { PropertyList, Property } from '../components/PropertyList';
import { ContactForm } from '../components/ContactForm';
import { motion } from 'motion/react';

interface HomeProps {
  properties: Property[];
}

export const Home: React.FC<HomeProps> = ({ properties }) => {
  return (
    <>
      <Hero />
      
      {/* Introduction Section */}
      <section className="py-24 bg-bg-light relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <span className="text-brand uppercase tracking-[0.3em] text-xs font-bold mb-6 block">Desde 2004</span>
              <h2 className="text-4xl md:text-6xl font-serif text-text-dark leading-none mb-8 italic">
                Estrategia <span className="not-italic text-brand">"A la Medida"</span>
              </h2>
              <p className="text-text-muted text-lg leading-relaxed font-light mb-8">
                RT Renta es una inmobiliaria especializada en la compra-venta de bienes inmuebles urbanos, con un enfoque de trabajo diseñado específicamente para las necesidades de propietarios e inversores.
              </p>
              <div className="grid grid-cols-2 gap-8 border-t border-line-light pt-8">
                <div>
                  <h4 className="font-serif text-xl text-text-dark mb-2">Alcance Global</h4>
                  <p className="text-text-muted text-sm">Respuesta individualizada a peticiones nacionales e internacionales desde nuestra sede en Barcelona.</p>
                </div>
                <div>
                  <h4 className="font-serif text-xl text-text-dark mb-2">Consultoría Senior</h4>
                  <p className="text-text-muted text-sm">Equipo directivo con raíces en consultoría empresarial, industrial y financiera.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-card-dark p-12 relative border border-line"
            >
              <div className="absolute -top-6 -right-6 w-32 h-32 border-r border-t border-brand/40"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border-l border-b border-brand/40"></div>
              <h3 className="text-2xl font-serif text-white mb-6 italic">Diversificación & Rigor</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-8">
                Ofrecemos una alternativa real en la diversificación del riesgo, identificando oportunidades atractivas basadas en tres variables críticas: rentabilidad, perfil de riesgo y horizonte temporal.
              </p>
              <ul className="space-y-4">
                {['Fondos de Inversión', 'Family Offices', 'Clientes Privados'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white text-[10px] uppercase tracking-widest font-bold">
                    <span className="w-6 h-[1px] bg-brand"></span> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Off-Market / Expertise Section */}
      <section className="py-24 bg-bg-dark border-y border-line">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-brand text-6xl font-serif leading-none mb-8 block font-light">“</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white/90 leading-tight italic font-light max-w-4xl mx-auto mb-12">
            La mayoría de nuestros activos los gestionamos en posición <span className="text-brand not-italic">Off-Market</span> o de exclusividad, garantizando total discreción.
          </h2>
          <div className="flex flex-wrap justify-center gap-4 text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold">
            <span>Hoteles</span>
            <span className="text-brand">•</span>
            <span>Edificios Residenciales</span>
            <span className="text-brand">•</span>
            <span>Oficinas</span>
            <span className="text-brand">•</span>
            <span>Suelo Finalista</span>
            <span className="text-brand">•</span>
            <span>Inmuebles Singulares</span>
          </div>
        </div>
      </section>

      <section className="py-12 bg-bg-light border-b border-line-light overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="font-serif text-2xl italic tracking-tight text-text-dark">Estrategia</span>
          <span className="font-serif text-2xl italic tracking-tight text-text-dark">Rigor</span>
          <span className="font-serif text-2xl italic tracking-tight text-text-dark">Confidencialidad</span>
          <span className="font-serif text-2xl italic tracking-tight text-text-dark">Excelencia</span>
          <span className="font-serif text-2xl italic tracking-tight text-text-dark">Asesoramiento</span>
        </div>
      </section>
      
      <section className="py-32 bg-card-dark text-center border-y border-line overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none select-none overflow-hidden flex items-center justify-center">
             <span className="text-[20vw] font-serif font-bold italic leading-none whitespace-nowrap text-white">Excelencia Inmobiliaria</span>
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
           <h3 className="text-3xl md:text-6xl font-serif text-white mb-8 italic">Compromiso con la Rentabilidad</h3>
           <p className="text-text-muted text-lg mb-12 font-light leading-relaxed max-w-2xl mx-auto">
             Optimizamos cada operación para alcanzar el máximo retorno del mercado, respaldados por acuerdos directos con propietarios y partners estratégicos.
           </p>
           <div className="flex flex-wrap justify-center gap-6">
              <div className="flex flex-col items-center">
                 <span className="text-brand text-4xl font-serif">2004</span>
                 <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold mt-2">Fundación</span>
              </div>
              <div className="w-[1px] h-12 bg-line mx-4 hidden md:block"></div>
              <div className="flex flex-col items-center">
                 <span className="text-brand text-4xl font-serif">Off-Market</span>
                 <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold mt-2">Acceso Exclusivo</span>
              </div>
           </div>
        </div>
      </section>
    </>
  );
};
