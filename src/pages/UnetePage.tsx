import React from 'react';
import { motion } from 'motion/react';
import { Users, Building2, Briefcase, Landmark, Gavel, Scale, Globe, UserPlus } from 'lucide-react';
import { ContactForm } from '../components/ContactForm';

const targets = [
  { name: 'Promotoras inmobiliarias', icon: Building2 },
  { name: 'Family Offices', icon: Landmark },
  { name: 'Fondos de inversión', icon: Briefcase },
  { name: 'Entidades financieras', icon: Landmark },
  { name: 'Empresarios e inversores privados', icon: Users },
  { name: 'Inversores institucionales', icon: Building2 },
  { name: 'Socimis', icon: Globe },
  { name: 'Despachos de abogados & EAFI´s', icon: Gavel },
  { name: 'Administradores de fincas', icon: Scale },
  { name: 'Agencias inmobiliarias', icon: UserPlus },
];

export const UnetePage = () => {
  return (
    <div className="pt-32 bg-bg-light min-h-screen">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <span className="text-brand-dark uppercase tracking-[0.3em] text-xs font-bold mb-4 block underline underline-offset-8">Colaboración Estratégica</span>
        <h1 className="text-5xl md:text-8xl font-serif text-text-dark italic leading-none mb-8">
          Únete a <span className="not-italic text-brand-dark text-luxury">RT Renta</span>
        </h1>
        <p className="text-text-muted max-w-3xl mx-auto text-lg md:text-xl font-light leading-relaxed tracking-wide">
          Desde RT Renta, queremos contactar y sumar a todas aquellas personas o empresas que trabajen con nuestra metodología y enfoque dentro del sector inmobiliario, con una amplia experiencia en la intermediación de operaciones.
        </p>
      </div>

      {/* Target Audience Grid */}
      <section className="py-24 bg-card-dark border-y border-line overflow-hidden relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex items-center justify-center">
           <span className="text-[15vw] font-serif font-bold italic leading-none whitespace-nowrap text-white">Networking</span>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-16 italic text-center">¿A quién nos <span className="not-italic text-brand">dirigimos?</span></h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {targets.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="group p-8 border border-line bg-bg-dark rounded-sm flex flex-col items-center text-center hover:border-brand/40 transition-all card-hover"
              >
                <div className="w-12 h-12 rounded-full border border-brand/20 flex items-center justify-center mb-6 text-brand group-hover:bg-brand group-hover:text-black transition-all">
                  <item.icon size={20} />
                </div>
                <h4 className="text-white text-[10px] uppercase tracking-widest font-bold leading-tight min-h-[40px] flex items-center justify-center">
                  {item.name}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Intro */}
      <section className="py-24 bg-bg-light">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-5xl font-serif text-text-dark mb-8 italic">¿Listo para expandir su <span className="not-italic text-brand-dark">alcance?</span></h3>
          <p className="text-text-muted text-lg mb-12 font-light leading-relaxed">
            Buscamos sinergias con profesionales que compartan nuestro rigor y discreción. Si su enfoque está orientado a la excelencia en el sector inmobiliario, queremos conocerle.
          </p>
          <div className="w-24 h-[1px] bg-brand mx-auto"></div>
        </div>
      </section>

      <ContactForm />
    </div>
  );
};
