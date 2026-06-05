import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Users, Search, Plus, Loader2, ArrowLeft, Edit } from 'lucide-react';

export default function GruposList() {
  const [grupos, setGrupos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGrupos();
  }, []);

  const fetchGrupos = async () => {
    try {
      // Obtener grupos y la info del presidente
      const { data, error } = await supabase
        .from('grupos_base')
        .select(`
          *,
          presidente:presidente_id(nombres, apellidos)
        `)
        .neq('estado', 'eliminado')
        .order('nombre');

      if (error) throw error;
      
      // Obtener el conteo de socios por grupo
      const { data: sociosData } = await supabase
        .from('socios')
        .select('id, grupo_id')
        .not('grupo_id', 'is', null);

      const conteos: Record<string, number> = {};
      sociosData?.forEach(s => {
        conteos[s.grupo_id] = (conteos[s.grupo_id] || 0) + 1;
      });

      const gruposConConteo = data?.map(g => ({
        ...g,
        total_socios: conteos[g.id] || 0
      }));

      setGrupos(gruposConConteo || []);
    } catch (error) {
      console.error('Error fetching grupos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGrupos = grupos.filter(g => 
    g.nombre.toLowerCase().includes(searchTerm.toLowerCase())
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
              <Users className="h-8 w-8 text-amber-500" />
              Grupos Base
            </h1>
            <p className="text-neutral-400 mt-1">Administra las comunidades y sectores de la asociación.</p>
          </div>
          <Link 
            to="/grupos/nuevo"
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-medium rounded-md hover:bg-amber-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Nuevo Grupo
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
                placeholder="Buscar grupo..."
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
          ) : filteredGrupos.length === 0 ? (
            <div className="p-12 text-center text-neutral-400">
              <p>No se encontraron grupos base.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="bg-neutral-900/50 text-neutral-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nombre del Grupo</th>
                    <th className="px-6 py-4 font-medium">Presidente / Líder</th>
                    <th className="px-6 py-4 font-medium">Socios Activos</th>
                    <th className="px-6 py-4 font-medium">Estado</th>
                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700/50">
                  {filteredGrupos.map((grupo) => (
                    <tr key={grupo.id} className="hover:bg-neutral-700/20">
                      <td className="px-6 py-4 font-medium text-white">{grupo.nombre}</td>
                      <td className="px-6 py-4 text-neutral-400">
                        {grupo.presidente ? `${grupo.presidente.nombres} ${grupo.presidente.apellidos}` : 'No asignado'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-full font-medium">
                          {grupo.total_socios} socios
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                          grupo.estado === 'activo' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {grupo.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/grupos/editar/${grupo.id}`} className="text-neutral-400 hover:text-amber-500 transition-colors p-2">
                          <Edit className="h-4 w-4 inline" />
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
