import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AcopiosList() {
  const [acopios, setAcopios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAcopios() {
      try {
        const { data, error } = await supabase
          .from('acopios')
          .select(`
            *,
            grupos_base (nombre),
            responsable:perfiles (nombre_completo)
          `)
          .order('fecha', { ascending: false });

        if (error) throw error;
        setAcopios(data || []);
      } catch (error) {
        console.error('Error fetching acopios:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAcopios();
  }, []);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'programado': return 'bg-blue-500/20 text-blue-400';
      case 'en_curso': return 'bg-amber-500/20 text-amber-400';
      case 'finalizado': return 'bg-emerald-500/20 text-emerald-400';
      case 'cancelado': return 'bg-red-500/20 text-red-400';
      default: return 'bg-neutral-500/20 text-neutral-400';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver al Dashboard
        </Link>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Jornadas de Acopio</h1>
            <p className="text-neutral-400">Planificación y recepción de cacao</p>
          </div>
          <Link
            to="/acopio/nuevo"
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-medium rounded-md hover:bg-amber-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Programar Jornada
          </Link>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-neutral-400">Cargando jornadas...</div>
          ) : acopios.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No hay jornadas programadas</h3>
              <p className="text-neutral-400 mb-6">Comienza programando el primer día de recolección de cacao.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="text-xs uppercase bg-neutral-900/50 text-neutral-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Fecha</th>
                    <th className="px-6 py-4 font-medium">Grupo Base</th>
                    <th className="px-6 py-4 font-medium">Ubicación</th>
                    <th className="px-6 py-4 font-medium">Responsable</th>
                    <th className="px-6 py-4 font-medium">Precio (kg)</th>
                    <th className="px-6 py-4 font-medium">Estado</th>
                    <th className="px-6 py-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700/50">
                  {acopios.map((acopio) => (
                    <tr key={acopio.id} className="hover:bg-neutral-700/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                        {new Date(acopio.fecha).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {acopio.grupos_base?.nombre || 'Sin grupo'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-neutral-500" />
                          {acopio.ubicacion || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {acopio.responsable?.nombre_completo}
                      </td>
                      <td className="px-6 py-4 font-medium text-emerald-400">
                        ${acopio.precio_dia_kg}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${getStatusColor(acopio.estado)}`}>
                          {acopio.estado.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/acopio/${acopio.id}`} className="text-amber-500 hover:text-amber-400 font-medium">
                          Gestionar Entregas
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
