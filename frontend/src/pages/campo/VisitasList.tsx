import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Map, Search, Plus, Loader2, ArrowLeft, Calendar, User, Sprout, CheckCircle2 } from 'lucide-react';

export default function VisitasList() {
  const [visitas, setVisitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVisitas();
  }, []);

  const fetchVisitas = async () => {
    try {
      const { data, error } = await supabase
        .from('visitas_campo')
        .select(`
          *,
          socios ( nombres, apellidos ),
          fincas ( nombre, ubicacion ),
          perfiles ( nombre_completo )
        `)
        .order('fecha_programada', { ascending: false });

      if (error) throw error;
      setVisitas(data || []);
    } catch (error) {
      console.error('Error fetching visitas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVisitas = visitas.filter(v => 
    v.socios?.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.socios?.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.fincas?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Map className="h-8 w-8 text-amber-500" />
              Asistencia Técnica (Visitas de Campo)
            </h1>
            <p className="text-neutral-400 mt-1">Programación y ejecución de inspecciones a fincas.</p>
          </div>
          <Link 
            to="/campo/visitas/nueva"
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-medium rounded-md hover:bg-amber-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Programar Visita
          </Link>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-neutral-700 flex justify-between items-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-500" />
              </div>
              <input
                type="text"
                placeholder="Buscar por socio o finca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 bg-neutral-900 border border-neutral-700 rounded-md py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-amber-500" />
            </div>
          ) : filteredVisitas.length === 0 ? (
            <div className="p-12 text-center text-neutral-400">
              <p>No se encontraron visitas registradas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="bg-neutral-900/50 text-neutral-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Fecha</th>
                    <th className="px-6 py-4 font-medium">Socio y Finca</th>
                    <th className="px-6 py-4 font-medium">Técnico</th>
                    <th className="px-6 py-4 font-medium">Estado</th>
                    <th className="px-6 py-4 font-medium">Cumple Orgánico</th>
                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700/50">
                  {filteredVisitas.map((v) => (
                    <tr key={v.id} className="hover:bg-neutral-700/20">
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-neutral-500" />
                          {new Date(v.fecha_programada).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white flex items-center gap-1">
                          <User className="h-3 w-3 text-amber-500" /> {v.socios?.nombres} {v.socios?.apellidos}
                        </div>
                        <div className="text-xs text-neutral-400 flex items-center gap-1 mt-1">
                          <Sprout className="h-3 w-3 text-emerald-500" /> {v.fincas?.nombre}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-neutral-400">{v.perfiles?.nombre_completo}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          v.estado === 'completada' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          v.estado === 'cancelada' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}>
                          {v.estado === 'completada' && <CheckCircle2 className="h-3 w-3" />}
                          {v.estado.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {v.estado === 'completada' ? (
                          v.cumple_organico ? (
                            <span className="text-emerald-400 font-bold">SÍ</span>
                          ) : (
                            <span className="text-red-400 font-bold">NO</span>
                          )
                        ) : (
                          <span className="text-neutral-600">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          to={`/campo/visitas/ejecutar/${v.id}`} 
                          className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
                        >
                          {v.estado === 'programada' ? 'Ejecutar Visita' : 'Ver Detalles'}
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
