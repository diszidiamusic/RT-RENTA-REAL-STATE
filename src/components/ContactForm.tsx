import React from 'react';
import { motion } from 'motion/react';
import { Send } from 'lucide-react';

export const ContactForm = () => {
  return (
    <section id="contacto-form" className="py-24 px-6 bg-bg-light">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
        <div className="flex-1">
          <span className="text-brand uppercase tracking-[0.2em] text-xs font-bold mb-4 block underline underline-offset-8">Hablemos</span>
          <h2 className="text-4xl md:text-6xl font-serif text-text-dark leading-tight mb-8 italic">
            ¿Listo para su próxima <span className="text-brand not-italic">Inversión?</span>
          </h2>
          <p className="text-text-muted font-sans max-w-md text-sm leading-relaxed mb-12 tracking-wide">
            Póngase en contacto con nuestro equipo de expertos para un asesoramiento personalizado y discreto.
          </p>
          
          <div className="space-y-4">
            <div className="p-8 border border-line-light bg-card-light rounded-sm shadow-sm cursor-default">
              <h4 className="font-serif text-xl text-text-dark mb-2">Asesoramiento Directo</h4>
              <p className="text-text-muted text-sm">Nuestro equipo analizará su perfil para ofrecerle las mejores opciones.</p>
            </div>
            <div className="p-8 border border-line-light bg-card-light rounded-sm shadow-sm cursor-default">
              <h4 className="font-serif text-xl text-text-dark mb-2">Discreción Garantizada</h4>
              <p className="text-text-muted text-sm">Tratamos toda la información con la máxima confidencialidad.</p>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-card-light p-8 md:p-12 rounded-sm border border-line-light shadow-2xl">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Nombre</label>
                <input type="text" className="w-full bg-bg-light border border-line-light px-4 py-3 outline-none focus:border-brand transition-colors font-sans text-sm text-text-dark" placeholder="Su nombre completo" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Email</label>
                <input type="email" className="w-full bg-bg-light border border-line-light px-4 py-3 outline-none focus:border-brand transition-colors font-sans text-sm text-text-dark" placeholder="su@email.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Tipo de Inversión</label>
              <select className="w-full bg-bg-light border border-line-light px-4 py-3 outline-none focus:border-brand transition-colors font-sans text-sm text-text-dark appearance-none">
                <option>Edificios Residenciales</option>
                <option>Hoteles & Resorts</option>
                <option>Suelo / Solar</option>
                <option>Retail / Local</option>
                <option>Otros</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Mensaje</label>
              <textarea rows={4} className="w-full bg-bg-light border border-line-light px-4 py-3 outline-none focus:border-brand transition-colors font-sans text-sm text-text-dark resize-none" placeholder="Cuéntenos sobre su proyecto o interés..."></textarea>
            </div>
            <button className="w-full bg-brand text-black flex items-center justify-center gap-3 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-brand-light transition-all group rounded-sm">
              Enviar Consulta <Send size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
