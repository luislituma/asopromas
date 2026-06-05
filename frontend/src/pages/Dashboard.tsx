import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { TecnicoDashboard } from './dashboards/TecnicoDashboard';
import { SocioDashboard } from './dashboards/SocioDashboard';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user, role, loading } = useAuth();
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    if (user) {
      supabase.from('perfiles').select('nombre_completo').eq('id', user.id).single()
        .then(({ data }) => {
          if (data) setNombre(data.nombre_completo);
        });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin h-8 w-8 text-amber-500" />
      </div>
    );
  }

  const getRoleDescription = () => {
    switch (role) {
      case 'admin': return 'Administrador del sistema. Tienes acceso total a todos los módulos.';
      case 'tecnico': return 'Técnico de campo. Puedes registrar visitas, evaluar fincas y gestionar información técnica.';
      case 'socio': return 'Socio productor. Puedes ver la información de tus fincas, capacitaciones y entregas de acopio.';
      default: return 'Usuario invitado.';
    }
  };

  const renderDashboard = () => {
    switch (role) {
      case 'admin':
        return <AdminDashboard />;
      case 'tecnico':
        return <TecnicoDashboard />;
      case 'socio':
        return <SocioDashboard />;
      default:
        return (
          <div className="text-center py-20 bg-neutral-800 rounded-xl border border-neutral-700">
            <h2 className="text-2xl font-bold text-white mb-2">Rol no reconocido</h2>
            <p className="text-neutral-400">Por favor, contacta a un administrador para que te asigne permisos.</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6 text-white max-w-7xl mx-auto">
      <div className="mb-8 bg-neutral-800 rounded-xl p-6 border border-neutral-700 shadow-lg">
        <h1 className="text-3xl font-extrabold text-white">
          ¡Bienvenido, <span className="text-amber-500">{nombre || 'Usuario'}</span>!
        </h1>
        <div className="mt-2 flex items-center gap-2">
          <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-md text-xs font-bold uppercase tracking-wider">
            {role || 'sin rol'}
          </span>
          <p className="text-neutral-400 text-sm font-medium">
            {getRoleDescription()}
          </p>
        </div>
      </div>

      <main>
        {renderDashboard()}
      </main>
    </div>
  );
}
