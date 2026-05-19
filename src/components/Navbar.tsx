import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'RT Renta', href: '/' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Consultoría', href: '/consultoria' },
    { name: 'Oportunidades', href: '/oportunidades' },
    { name: 'Unete', href: '/unete' },
    { name: 'Contacto', href: '/contacto' },
  ];

  const isHome = location.pathname === '/';

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4',
        isScrolled || !isHome ? 'bg-bg-dark/80 backdrop-blur-md border-b border-line py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-brand rounded-sm flex items-center justify-center text-black font-serif font-bold text-xl transition-transform group-hover:scale-110">
            RT
          </div>
          <div className="flex flex-col leading-none text-white transition-colors">
            <span className="font-serif text-xl tracking-[0.2em] uppercase font-light">RENTA REAL STATE</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "text-[10px] uppercase tracking-[0.2em] font-sans font-medium transition-all hover:text-brand",
                isScrolled || !isHome ? "text-text-muted" : "text-white/90",
                location.pathname === link.href && "text-brand"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-brand"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} className="text-white" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full left-4 right-4 bg-card-dark border border-line shadow-2xl p-8 md:hidden flex flex-col gap-6 rounded-sm mt-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-lg font-serif flex items-center justify-between group transition-colors",
                  location.pathname === link.href ? "text-brand" : "text-white"
                )}
              >
                {link.name}
                <ChevronRight size={18} className="text-brand opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
            <Link 
              to="/oportunidades"
              className="w-full py-4 bg-brand text-black uppercase tracking-widest text-[10px] font-bold mt-4 flex items-center justify-center"
            >
              Ver Inmuebles
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

