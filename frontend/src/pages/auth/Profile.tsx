import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { User, Lock, Save, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function Profile() {
  const { session, role } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Profile state
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  
  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Feedback states
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (session?.user?.id) {
      loadProfile();
    }
  }, [session]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', session?.user.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setNombreCompleto(data.nombre_completo);
        setEmail(data.email);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProfileMsg({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('perfiles')
        .update({ nombre_completo: nombreCompleto })
        .eq('id', session?.user.id);

      if (error) throw error;
      
      setProfileMsg({ type: 'success', text: 'Perfil actualizado correctamente.' });
      
      // Limpiar mensaje después de 3 seg
      setTimeout(() => setProfileMsg({ type: '', text: '' }), 3000);
    } catch (error: any) {
      console.error(error);
      setProfileMsg({ type: 'error', text: 'Error al actualizar el perfil.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setPassMsg({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    if (newPassword.length < 6) {
      setPassMsg({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      setPassMsg({ type: 'success', text: 'Contraseña actualizada correctamente.' });
      setNewPassword('');
      setConfirmPassword('');
      
      // Limpiar mensaje después de 3 seg
      setTimeout(() => setPassMsg({ type: '', text: '' }), 3000);
    } catch (error: any) {
      console.error(error);
      setPassMsg({ type: 'error', text: 'Error al actualizar la contraseña.' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center text-white"><Loader2 className="animate-spin h-8 w-8 mx-auto text-amber-500" /></div>;

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <User className="h-8 w-8 text-amber-500" />
            Mi Perfil
          </h1>
          <p className="text-neutral-400 mt-1">
            Administra tu información personal y seguridad de la cuenta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Columna Izquierda: Datos del Perfil */}
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-neutral-700 pb-4">
              Información Personal
            </h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              
              {profileMsg.text && (
                <div className={`p-4 rounded-md flex items-center gap-3 ${profileMsg.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
                  {profileMsg.type === 'error' ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                  <p className="text-sm font-medium">{profileMsg.text}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Rol en el Sistema</label>
                <div className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-neutral-400 capitalize cursor-not-allowed">
                  {role}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Correo Electrónico</label>
                <div className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2.5 text-neutral-400 cursor-not-allowed">
                  {email}
                </div>
                <p className="text-xs text-neutral-500 mt-1">El correo no puede ser modificado.</p>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Nombre Completo</label>
                <input
                  required
                  type="text"
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-neutral-700 text-white font-medium rounded-lg hover:bg-neutral-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  Actualizar Datos
                </button>
              </div>
            </form>
          </div>

          {/* Columna Derecha: Seguridad */}
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 md:p-8 h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-neutral-700 pb-4">
              <Lock className="h-5 w-5 text-neutral-400" />
              Cambiar Contraseña
            </h2>
            
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              
              {passMsg.text && (
                <div className={`p-4 rounded-md flex items-center gap-3 ${passMsg.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
                  {passMsg.type === 'error' ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                  <p className="text-sm font-medium">{passMsg.text}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Nueva Contraseña</label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 pr-12"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-neutral-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-300 block mb-2">Confirmar Nueva Contraseña</label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 pr-12"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-neutral-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
                  Actualizar Contraseña
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
