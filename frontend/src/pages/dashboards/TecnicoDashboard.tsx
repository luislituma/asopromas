import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { StatCard } from '../../components/ui/StatCard';
import { Map, CalendarCheck, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TecnicoDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    visitasPendientes: 0,
    visitasCompletadas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;
      try {
        const [pendientesRes, completadasRes] = await Promise.all([
          supabase.from('visitas_campo').select('id', { count: 'exact', head: true })
            .eq('tecnico_id', user.id).eq('estado', 'programada'),
          supabase.from('visitas_campo').select('id', { count: 'exact', head: true })
            .eq('tecnico_id', user.id).eq('estado', 'completada')
        ]);

        setStats({
          visitasPendientes: pendientesRes.count || 0,
          visitasCompletadas: completadasRes.count || 0
        });
      } catch (error) {
        console.error('Error fetching tecnico stats:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Panel de Técnico</h2>
          <p className="text-neutral-400">Tus asignaciones y trabajo de campo</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-amber-500 text-black font-medium rounded-md hover:bg-amber-600 transition-colors opacity-50 cursor-not-allowed" title="Próximamente">
            Registrar Visita
          </button>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="h-32 bg-neutral-800 rounded-xl w-full"></div>
          <div className="h-32 bg-neutral-800 rounded-xl w-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="Visitas Pendientes"
            value={stats.visitasPendientes}
            icon={ClipboardList}
            colorClass="text-amber-400"
          />
          <StatCard
            title="Visitas Completadas (Mes)"
            value={stats.visitasCompletadas}
            icon={CalendarCheck}
            colorClass="text-green-400"
          />
        </div>
      )}

      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 mt-8">
        <div className="flex items-center gap-3 mb-4">
          <Map className="h-6 w-6 text-amber-500" />
          <h3 className="text-lg font-medium text-white">Próximas Visitas Asignadas</h3>
        </div>
        <div className="text-center py-12 text-neutral-500">
          <p>No tienes visitas pendientes asignadas por el momento.</p>
          <p className="text-sm mt-2">En la próxima actualización podrás registrar y gestionar los reportes de calidad de cacao en cada visita.</p>
        </div>
      </div>
    </div>
  );
}
