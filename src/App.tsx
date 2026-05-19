import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Property } from './components/PropertyList';
import { getProperties } from './services/firebaseService';
import { Home } from './pages/Home';
import { Consultoria } from './pages/Consultoria';
import { OportunidadesPage } from './pages/OportunidadesPage';
import { ServiciosPage } from './pages/ServiciosPage';
import { ContactoPage } from './pages/ContactoPage';
import { UnetePage } from './pages/UnetePage';
import { AdminDashboard } from './components/AdminDashboard';
import { AnimatePresence } from 'motion/react';
import { Settings, LogOut, User as UserIcon } from 'lucide-react';
import { LoginModal } from './components/LoginModal';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local session
    const session = sessionStorage.getItem('rt_admin_session');
    if (session === 'active') {
      setIsAuthorized(true);
    }

    const unsubscribeProperties = getProperties((props) => {
      setProperties(props);
      setLoading(false);
    });

    return () => {
      unsubscribeProperties();
    };
  }, []);

  const handleLogin = () => {
    setIsLoginOpen(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('rt_admin_session');
    setIsAuthorized(false);
    setIsAdminOpen(false);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-bg-dark selection:bg-brand/30 selection:text-brand-dark border-8 border-card-dark">
        <Navbar />
        
        {/* Admin Floating Controls */}
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
          {isAuthorized ? (
            <div className="flex flex-col gap-4 items-end">
               <button 
                onClick={() => setIsAdminOpen(true)}
                className="w-14 h-14 luxury-gradient rounded-full shadow-xl flex items-center justify-center text-black hover:scale-110 transition-transform group"
               >
                 <Settings className="group-hover:rotate-90 transition-transform text-black" />
               </button>
               <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-card-dark/80 backdrop-blur-md rounded-full border border-line shadow-lg flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-text-muted hover:text-brand transition-colors"
               >
                 <LogOut size={14} /> Salir
               </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="w-14 h-14 bg-card-dark/80 backdrop-blur-md border border-line rounded-full shadow-xl flex items-center justify-center text-text-muted hover:text-brand transition-all"
              title="Admin Login"
            >
              <UserIcon size={24} />
            </button>
          )}
        </div>

        <AnimatePresence>
          {isLoginOpen && (
            <LoginModal onClose={() => setIsLoginOpen(false)} />
          )}
          {isAdminOpen && isAuthorized && (
            <AdminDashboard properties={properties} onClose={() => setIsAdminOpen(false)} />
          )}
        </AnimatePresence>
        
        <main>
          <Routes>
            <Route path="/" element={<Home properties={properties} />} />
            <Route path="/servicios" element={<ServiciosPage />} />
            <Route path="/consultoria" element={<Consultoria />} />
            <Route path="/oportunidades" element={<OportunidadesPage properties={properties} />} />
            <Route path="/unete" element={<UnetePage />} />
            <Route path="/contacto" element={<ContactoPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

