import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { StatCard } from '../../components/ui/StatCard';
import { MapPin, Sprout, HandCoins, AlertCircle } from 'lucide-react';

export function SocioDashboard() {
  const { user } = useAuth();
  const [fincas, setFincas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFincas() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('fincas')
          .select('*')
          .eq('socio_id', user.id);

        if (error) throw error;
        setFincas(data || []);
      } catch (error) {
        console.error('Error fetching fincas:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFincas();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Mi Panel de Productor</h2>
          <p className="text-neutral-400">Resumen de tu producción e información</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Fincas Registradas"
          value={loading ? '-' : fincas.length}
          icon={MapPin}
          colorClass="text-emerald-400"
        />
        <StatCard
          title="Total Entregado"
          value="-- kg"
          description="Temporada actual"
          icon={Sprout}
          colorClass="text-amber-400"
        />
        <StatCard
          title="Liquidaciones"
          value="$ --"
          description="Pagos pendientes"
          icon={HandCoins}
          colorClass="text-green-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Información de mis Fincas</h3>
          
          {loading ? (
            <div className="animate-pulse h-20 bg-neutral-700 rounded-md"></div>
          ) : fincas.length > 0 ? (
            <div className="space-y-3">
              {fincas.map(finca => (
                <div key={finca.id} className="p-4 bg-neutral-900 border border-neutral-700 rounded-lg">
                  <p className="font-medium text-white">{finca.nombre}</p>
                  <div className="flex justify-between text-sm text-neutral-400 mt-2">
                    <span>{finca.hectareas} hectáreas</span>
                    <span>{finca.ubicacion}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 bg-amber-900/30 border border-amber-500/50 rounded-lg text-amber-200">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">No tienes fincas registradas</p>
                <p className="text-sm mt-1 text-amber-300">Un técnico o administrador debe registrar tu información de campo en el sistema.</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Próximas Visitas Técnicas</h3>
          <div className="text-center py-8 text-neutral-500">
            <p>No tienes visitas programadas.</p>
            <p className="text-sm mt-2">Aquí verás cuando un técnico agende una revisión de calidad o certificación.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
