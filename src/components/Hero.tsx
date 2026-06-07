import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="relative h-[95vh] flex items-center justify-center overflow-hidden bg-bg-dark border-b border-line">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Real Estate"
          className="w-full h-full object-cover opacity-35 scale-100 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/60 via-bg-dark/20 to-bg-dark"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="flex flex-col items-center gap-8 py-12"
        >
          <span className="text-brand uppercase tracking-[0.35em] text-[9px] md:text-[10px] font-sans font-semibold">
            Excelencia Inmobiliaria • Desde 2004
          </span>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] text-white font-serif font-bold leading-[0.9] tracking-[-0.03em] max-w-6xl">
            RT <span className="text-brand italic font-light tracking-[-0.01em]">Renta</span>
          </h1>
          
          <p className="text-text-muted font-sans font-light max-w-2xl text-xs sm:text-sm md:text-lg leading-relaxed tracking-wide pt-2">
            Su socio estratégico en consultoría y gestión patrimonial. Elevando el estándar del Real Estate con un enfoque personalizado, profesional y discreto.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-5 mt-10">
            <Link 
              to="/oportunidades" 
              className="w-full sm:w-auto bg-brand hover:bg-white border border-brand hover:border-white text-black font-semibold px-12 py-4 uppercase tracking-[0.25em] text-[10px] transition-all duration-300 hover:shadow-lg"
            >
              Explorar Oportunidades
            </Link>
            <Link 
              to="/contacto" 
              className="w-full sm:w-auto bg-white/5 hover:bg-white hover:text-black hover:border-white backdrop-blur-md text-white border border-white/20 px-12 py-4 uppercase tracking-[0.25em] text-[10px] font-semibold transition-all duration-300"
            >
              Asesoramiento
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Hero Footer */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center animate-bounce opacity-40">
        <ArrowDown className="text-brand" size={24} strokeWidth={1.5} />
      </div>
    </section>
  );
};
