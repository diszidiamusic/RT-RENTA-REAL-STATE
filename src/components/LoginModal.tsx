import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Lock, User as UserIcon, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Hardcoded credentials for simplicity as requested
    if (email === 'admin@rtrenta.com' && password === 'renta2024') {
      sessionStorage.setItem('rt_admin_session', 'active');
      onLoginSuccess();
    } else {
      setError('Usuario o contraseña incorrectos.');
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-card-dark w-full max-w-md p-8 border border-line rounded-sm shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-brand rounded-sm flex items-center justify-center text-black mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-serif text-white italic">Acceso Restringido</h2>
          <p className="text-text-muted text-[10px] uppercase tracking-widest font-bold mt-2">RT Renta Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Usuario / Email</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input 
                required
                type="email"
                className="w-full bg-bg-dark border border-line px-12 py-4 outline-none focus:border-brand transition-colors font-sans text-sm text-white"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="usuario@rtrenta.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest font-bold text-text-muted">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input 
                required
                type="password"
                className="w-full bg-bg-dark border border-line px-12 py-4 outline-none focus:border-brand transition-colors font-sans text-sm text-white"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-black py-5 uppercase tracking-[0.2em] font-bold text-[10px] hover:bg-brand-light transition-all disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Entrar al Sistema'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-line text-center">
          <p className="text-[9px] text-text-muted uppercase tracking-widest leading-relaxed">
            Este es un sistema privado.<br />El acceso no autorizado está estrictamente prohibido.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
