import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Target, Building2, FileText, Landmark, Users } from 'lucide-react';

const services = [
  {
    title: 'Oportunidades de Inversión',
    description: 'Proyectos seleccionados bajo criterios de rentabilidad y riesgo controlado.',
    icon: TrendingUp,
  },
  {
    title: 'Encargos a Medida',
    description: 'Búsqueda personalizada basada en el perfil específico de cada inversor.',
    icon: Target,
  },
  {
    title: 'Venta de Inmuebles',
    description: 'Metodología propia para encontrar al comprador perfecto para su activo.',
    icon: Building2,
  },
  {
    title: 'Informes de Valor',
    description: 'Análisis exhaustivos para optimizar sus decisiones de inversión.',
    icon: FileText,
  },
  {
    title: 'Gestión de Patrimonio',
    description: 'Estudio y optimización de carteras patrimoniales existentes.',
    icon: Landmark,
  }
];

export const Services = () => {
  return (
    <section id="servicios" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
        <div className="max-w-2xl">
          <span className="text-brand-dark uppercase tracking-[0.2em] text-xs font-bold mb-4 block underline underline-offset-8">Nuestra Experiencia</span>
          <h2 className="text-4xl md:text-6xl font-serif text-[#4b382a] leading-tight">
            Servicios Integrales para el <span className="italic text-brand-dark">Inversor Inmobiliario</span>
          </h2>
        </div>
        <p className="text-text-muted font-sans max-w-md text-sm leading-relaxed tracking-wide">
          Ofrecemos un asesoramiento 360º, desde la identificación del activo hasta su gestión o desinversión, garantizando transparencia y profesionalidad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group cursor-default bg-card-dark p-8 border border-line card-hover"
          >
            <div className="w-12 h-12 rounded-sm border border-brand/20 flex items-center justify-center mb-6 group-hover:bg-brand group-hover:text-black transition-all duration-300">
              <service.icon size={20} className="text-brand group-hover:text-black" />
            </div>
            <h3 className="text-xl font-serif text-white mb-3 group-hover:text-brand transition-colors">
              {service.title}
            </h3>
            <p className="text-text-muted text-sm leading-relaxed font-sans mt-4 border-t border-line pt-4">
              {service.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
