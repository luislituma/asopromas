import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Forgot Password State
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session && !isResetMode) {
      navigate('/dashboard');
    }
  }, [session, navigate, isResetMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error logging in:', err);
      setError(err.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      setResetSent(true);
    } catch (err: any) {
      console.error('Error reset password:', err);
      setError(err.message || 'Error enviando el correo de recuperación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: "url('/assets/images/products/Asopromas-socios.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay oscuro para que el texto resalte */}
      <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <img 
          src="/logo-asopromas.svg" 
          alt="ASOPROMAS Logo" 
          className="mx-auto h-24 w-auto drop-shadow-lg"
          onError={(e) => {
            e.currentTarget.src = "/Logo-Asopromas-Completo.jpg";
            e.currentTarget.className = "mx-auto h-32 w-auto rounded-lg shadow-lg";
          }}
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-amber-500 drop-shadow-md">
          {isResetMode ? 'Recuperar Acceso' : 'ASOPROMAS'}
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-300 font-medium">
          {isResetMode ? 'Te enviaremos un enlace para cambiar tu contraseña' : 'Sistema de Gestión Empresarial'}
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900/90 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-neutral-700/50 backdrop-blur-md">
          
          {resetSent ? (
            <div className="text-center py-4">
              <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">¡Correo Enviado!</h3>
              <p className="text-neutral-400 mb-6">
                Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Revisa tu bandeja de entrada (y la de spam).
              </p>
              <button
                onClick={() => {
                  setIsResetMode(false);
                  setResetSent(false);
                }}
                className="w-full flex justify-center py-2 px-4 border border-neutral-600 rounded-md shadow-sm text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-700"
              >
                Volver al Inicio de Sesión
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={isResetMode ? handleResetRequest : handleLogin}>
              {error && (
                <div className="bg-red-900/50 border border-red-500 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-300">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
                  Correo Electrónico
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-neutral-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 bg-neutral-700 border border-neutral-600 rounded-md py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              {!isResetMode && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
                    Contraseña
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-500" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 bg-neutral-700 border border-neutral-600 rounded-md py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  {!isResetMode ? (
                    <button 
                      type="button" 
                      onClick={() => setIsResetMode(true)}
                      className="font-medium text-amber-500 hover:text-amber-400"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => setIsResetMode(false)}
                      className="font-medium text-neutral-400 hover:text-white flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3 w-3" /> Volver atrás
                    </button>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5 text-black" />
                  ) : (
                    isResetMode ? 'Enviar Enlace de Recuperación' : 'Iniciar Sesión'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
