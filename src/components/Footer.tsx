import React from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer id="contacto" className="bg-bg-dark text-white pt-24 pb-12 px-6 border-t border-line">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-brand rounded-sm flex items-center justify-center text-black font-serif font-bold text-2xl">
              RT
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-lg sm:text-xl tracking-[0.15em] sm:tracking-[0.2em] uppercase font-light truncate">RENTA REAL ESTATE</span>
            </div>
          </div>
          <p className="text-text-muted text-sm leading-relaxed mb-8 max-w-xs">
            Su socio estratégico en inmobiliaria de lujo. Elevando el estándar de la gestión de activos con una visión global y discreta.
          </p>
          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-line flex items-center justify-center hover:bg-brand hover:text-black hover:border-brand transition-all">
              <Instagram size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-line flex items-center justify-center hover:bg-brand hover:text-black hover:border-brand transition-all">
              <Linkedin size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-line flex items-center justify-center hover:bg-brand hover:text-black hover:border-brand transition-all">
              <Facebook size={18} />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-serif text-xl mb-8 text-brand">Navegación</h4>
          <ul className="space-y-4 text-[10px] uppercase tracking-widest text-text-muted font-bold">
            <li><Link to="/" className="hover:text-brand transition-colors">Inicio</Link></li>
            <li><Link to="/oportunidades" className="hover:text-brand transition-colors">Propiedades</Link></li>
            <li><Link to="/servicios" className="hover:text-brand transition-colors">Nuestros Servicios</Link></li>
            <li><Link to="/unete" className="hover:text-brand transition-colors">Red de Colaboradores</Link></li>
            <li><Link to="/contacto" className="hover:text-brand transition-colors">Contacto Directo</Link></li>
          </ul>
        </div>

        {/* Consultancy */}
        <div>
          <h4 className="font-serif text-xl mb-8 text-brand">Estrategia</h4>
          <ul className="space-y-4 text-[10px] uppercase tracking-widest text-text-muted font-bold">
            <li><Link to="/consultoria" className="hover:text-brand transition-colors">Consultoría Senior</Link></li>
            <li><Link to="/oportunidades" className="hover:text-brand transition-colors">Inversiones Off-Market</Link></li>
            <li><Link to="/servicios" className="hover:text-brand transition-colors">Gestión de Patrimonio</Link></li>
            <li><a href="#" className="hover:text-brand transition-colors">Aviso Legal</a></li>
            <li><a href="#" className="hover:text-brand transition-colors">Privacidad</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-serif text-xl mb-8 text-brand">Contacto</h4>
          <ul className="space-y-6 text-sm text-text-muted font-sans font-extralight">
            <li className="flex items-center gap-4">
              <Phone size={20} className="text-brand shrink-0" />
              <span>+34 609 788 835</span>
            </li>
            <li className="flex items-center gap-4">
              <Mail size={20} className="text-brand shrink-0" />
              <span>info@rtrenta.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-12 border-t border-line flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] tracking-[0.1em] text-text-muted font-sans font-light">
        <p>© 2026 RT Renta Real Estate. Todos los derechos reservados.</p>
        <p className="italic">Garantía de Rentabilidad, Rigor y Confidencialidad desde 2004</p>
      </div>
    </footer>
  );
};
