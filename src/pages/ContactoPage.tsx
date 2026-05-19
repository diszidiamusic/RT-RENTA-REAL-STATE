import React from 'react';
import { ContactForm } from '../components/ContactForm';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const ContactoPage = () => {
  return (
    <div className="pt-32 bg-bg-light min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <span className="text-brand-dark uppercase tracking-[0.3em] text-xs font-bold mb-4 block underline underline-offset-8">Conectemos</span>
        <h1 className="text-5xl md:text-7xl font-serif text-text-dark italic leading-none mb-8">
          Contacto <span className="not-italic text-brand-dark">& Asesoramiento</span>
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
        {/* Contact Info Cards */}
        <div className="bg-white border border-line-light p-8 shadow-sm rounded-sm">
          <div className="w-12 h-12 bg-brand/10 text-brand-dark flex items-center justify-center rounded-sm mb-6">
            <MapPin size={24} />
          </div>
          <h3 className="text-xl font-serif text-text-dark mb-2">Visítenos</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            Vía Augusta, 118, 08006 Barcelona<br />
            España
          </p>
        </div>

        <div className="bg-white border border-line-light p-8 shadow-sm rounded-sm">
          <div className="w-12 h-12 bg-brand/10 text-brand-dark flex items-center justify-center rounded-sm mb-6">
            <Mail size={24} />
          </div>
          <h3 className="text-xl font-serif text-text-dark mb-2">Escríbanos</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            info@rtrenta.com<br />
            consultoria@rtrenta.com
          </p>
        </div>

        <div className="bg-white border border-line-light p-8 shadow-sm rounded-sm">
          <div className="w-12 h-12 bg-brand/10 text-brand-dark flex items-center justify-center rounded-sm mb-6">
            <Phone size={24} />
          </div>
          <h3 className="text-xl font-serif text-text-dark mb-2">Llámenos</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            +34 931 234 567<br />
            Horario: L-V 09:00 - 18:00
          </p>
        </div>
      </div>

      <ContactForm />

      {/* Map Placeholder or Extra Info */}
      <section className="py-24 bg-card-dark text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h2 className="text-4xl font-serif italic mb-6">Presencia Estratégica en <span className="text-brand not-italic">Barcelona</span></h2>
            <p className="text-text-muted mb-8 leading-relaxed">
              Nuestra oficina principal se encuentra en el corazón de Barcelona, permitiéndonos una gestión ágil y directa de los activos en las zonas más exclusivas de la ciudad.
            </p>
            <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-brand">
              <Clock size={18} />
              Respuesta garantizada en menos de 24h
            </div>
          </div>
          <div className="w-full md:w-1/2 aspect-video bg-bg-dark border border-line relative overflow-hidden group">
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Interactive Map Integration</span>
             </div>
             {/* Map visual placeholder */}
             <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1544257750-572358f5da22?auto=format&fit=crop&q=80&w=1000')] bg-cover grayscale"></div>
          </div>
        </div>
      </section>
    </div>
  );
};
