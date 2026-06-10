// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  // Esta página debería cargarse automáticamente cuando el usuario hace clic en el enlace del correo.
  // Supabase automáticamente lee el hash de la URL y autentica al usuario temporalmente.

  useEffect(() => {
    // Escuchamos cambios de auth para verificar que estamos en una sesión de recuperación
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        console.log('Recovery flow active');
      }
    });
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      setSuccess(true);
      
      // Redirigir al dashboard después de unos segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
    } catch (err: any) {
      console.error('Error actualizando contraseña:', err);
      setError(err.message || 'Error al actualizar la contraseña.');
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
          Restablecer Contraseña
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-300 font-medium">
          Ingresa tu nueva contraseña para ASOPROMAS
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900/90 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-neutral-700/50 backdrop-blur-md">
          {success ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">¡Contraseña Actualizada!</h3>
              <p className="text-neutral-400">Te estamos redirigiendo al sistema...</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleResetPassword}>
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
                <label className="block text-sm font-medium text-neutral-300">
                  Nueva Contraseña
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-500" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 bg-neutral-700 border border-neutral-600 rounded-md py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300">
                  Confirmar Contraseña
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-500" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 bg-neutral-700 border border-neutral-600 rounded-md py-2 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    placeholder="••••••••"
                  />
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
                    'Actualizar Contraseña'
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
