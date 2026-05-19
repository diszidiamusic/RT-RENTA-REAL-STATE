import React from 'react';
import { Services } from '../components/Services';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ContactForm } from '../components/ContactForm';

export const ServiciosPage = () => {
  return (
    <div className="pt-32 bg-bg-light min-h-screen">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <span className="text-brand-dark uppercase tracking-[0.3em] text-xs font-bold mb-4 block underline underline-offset-8">Nuestras Capacidades</span>
        <h1 className="text-5xl md:text-7xl font-serif text-text-dark italic leading-none mb-8">
          Servicios <span className="not-italic text-brand-dark">360º</span>
        </h1>
        <p className="text-text-muted max-w-2xl text-lg font-light leading-relaxed tracking-wide">
          Acompañamos al inversor en todo el ciclo de vida del activo inmobiliario, aportando rigor técnico, visión estratégica y una gestión honesta.
        </p>
      </div>

      <Services />

      {/* Why Choose Us Section */}
      <section className="py-24 bg-card-dark border-y border-line overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-serif text-white italic mb-6">¿Por qué confiar en <span className="not-italic text-brand">RT Renta?</span></h2>
            <div className="space-y-6 mt-10">
              {[
                { t: "Independencia Total", d: "No dependemos de entidades bancarias ni fondos, solo de los intereses de nuestros clientes." },
                { t: "Visión Patrimonialista", d: "Entendemos el inmueble como una reserva de valor a largo plazo." },
                { t: "Ecosistema Directo", d: "Acceso a activos 'Off-Market' gracias a nuestra red de contactos histórica en Barcelona." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="shrink-0 w-6 h-6 rounded-full border border-brand/40 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-black transition-colors">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <h4 className="text-white font-serif text-lg mb-1">{item.t}</h4>
                    <p className="text-text-muted text-sm">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
             <div className="aspect-square bg-bg-dark border border-line p-8 relative overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000" 
                  className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700" 
                  alt="Office interior"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark to-transparent"></div>
                <div className="absolute bottom-12 left-12 right-12">
                   <p className="text-2xl font-serif text-white italic mb-4">"La transparencia no es un servicio, es nuestra forma de ser."</p>
                   <div className="w-12 h-[1px] bg-brand"></div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <ContactForm />
    </div>
  );
};
