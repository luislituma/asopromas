// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Map, Search, Plus, Loader2, ArrowLeft, Edit, CheckCircle } from 'lucide-react';

export default function FincasList() {
  const [fincas, setFincas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFincas();
  }, []);

  const fetchFincas = async () => {
    try {
      const { data, error } = await supabase
        .from('fincas')
        .select(`
          *,
          socios (nombres, apellidos, cedula)
        `)
        .neq('estado', 'eliminado')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFincas(data || []);
    } catch (error) {
      console.error('Error fetching fincas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFincas = fincas.filter(f => 
    f.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.socios?.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.socios?.apellidos?.toLowerCase().includes(searchTerm.toLowerCase())
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
              <Map className="h-8 w-8 text-emerald-500" />
              Directorio de Fincas
            </h1>
            <p className="text-neutral-400 mt-1">Gestión de unidades productivas y certificaciones de los socios.</p>
          </div>
          <Link 
            to="/fincas/nuevo"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black font-medium rounded-md hover:bg-emerald-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Nueva Finca
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
                placeholder="Buscar por finca o socio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 bg-neutral-900 border border-neutral-700 rounded-md py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-emerald-500" />
            </div>
          ) : filteredFincas.length === 0 ? (
            <div className="p-12 text-center text-neutral-400">
              <p>No se encontraron fincas registradas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="bg-neutral-900/50 text-neutral-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nombre de Finca</th>
                    <th className="px-6 py-4 font-medium">Propietario (Socio)</th>
                    <th className="px-6 py-4 font-medium">Hectáreas</th>
                    <th className="px-6 py-4 font-medium">Variedades</th>
                    <th className="px-6 py-4 font-medium text-center">Certificada</th>
                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700/50">
                  {filteredFincas.map((finca) => (
                    <tr key={finca.id} className="hover:bg-neutral-700/20">
                      <td className="px-6 py-4 font-medium text-white">{finca.nombre}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{finca.socios?.nombres} {finca.socios?.apellidos}</p>
                        <p className="text-xs text-neutral-500">{finca.socios?.cedula}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-emerald-400 font-bold">{finca.hectareas_cacao || 0} ha</span> cacao <br/>
                        <span className="text-xs text-neutral-500">de {finca.hectareas_totales || 0} ha totales</span>
                      </td>
                      <td className="px-6 py-4">
                        {finca.variedades_cacao && finca.variedades_cacao.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {finca.variedades_cacao.map((v: string) => (
                              <span key={v} className="px-2 py-0.5 bg-neutral-700 rounded text-xs">{v}</span>
                            ))}
                          </div>
                        ) : <span className="text-neutral-500">No especificado</span>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {finca.certificada ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" title="Certificada" />
                        ) : (
                          <span className="text-neutral-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/fincas/editar/${finca.id}`} className="text-neutral-400 hover:text-emerald-500 transition-colors p-2 inline-block">
                          <Edit className="h-4 w-4" />
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
