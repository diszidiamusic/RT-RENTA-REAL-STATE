import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-bg-dark">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Real Estate"
          className="w-full h-full object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/40 via-transparent to-bg-dark"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <span className="text-brand uppercase tracking-[0.3em] text-[10px] md:text-xs font-sans font-semibold">
            Excelencia en cada detalle
          </span>
          <h1 className="text-6xl md:text-9xl text-white font-serif leading-[0.95] tracking-tight max-w-5xl italic">
            RT <span className="not-italic text-brand text-luxury">Renta</span>
          </h1>
          <p className="text-text-muted font-sans max-w-2xl text-sm md:text-base leading-relaxed tracking-wide">
            Su socio estratégico en inmobiliaria de lujo. Elevando el estándar de la gestión de activos con un enfoque personalizado y discreto.
          </p>
          
          <div className="flex flex-col md:flex-row items-center gap-4 mt-8">
            <Link 
              to="/oportunidades" 
              className="bg-brand hover:bg-brand-dark text-black px-10 py-4 uppercase tracking-[0.2em] text-[10px] font-bold transition-all transform hover:scale-105 rounded-sm"
            >
              Explorar Oportunidades
            </Link>
            <Link 
              to="/contacto" 
              className="bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/10 px-10 py-4 uppercase tracking-[0.2em] text-[10px] font-bold transition-all rounded-sm"
            >
              Asesoramiento
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Hero Footer */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce opacity-30">
        <ArrowDown className="text-brand" size={32} strokeWidth={1} />
      </div>
    </section>
  );
};
