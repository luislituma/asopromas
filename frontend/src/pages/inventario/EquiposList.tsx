import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Plus, Search, Loader2, Monitor, Wrench, Settings, Trash2 } from 'lucide-react';

export default function EquiposList() {
  const [equipos, setEquipos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  useEffect(() => {
    fetchEquipos();
  }, []);

  const fetchEquipos = async () => {
    try {
      const { data, error } = await supabase
        .from('inventario_equipos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEquipos(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoriaIcon = (cat: string) => {
    switch (cat) {
      case 'computacion': return <Monitor className="h-5 w-5 text-blue-400" />;
      case 'herramientas': return <Wrench className="h-5 w-5 text-orange-400" />;
      case 'maquinaria': return <Settings className="h-5 w-5 text-amber-500" />;
      default: return <Monitor className="h-5 w-5 text-neutral-400" />;
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'operativo': return <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/30">Operativo</span>;
      case 'mantenimiento': return <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold border border-amber-500/30">Mantenimiento</span>;
      case 'dado_de_baja': return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold border border-red-500/30">Dado de Baja</span>;
      default: return null;
    }
  };

  const eliminarEquipo = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el activo: ${nombre}?`)) return;
    
    try {
      const { error } = await supabase.from('inventario_equipos').delete().eq('id', id);
      if (error) throw error;
      await fetchEquipos();
    } catch (error) {
      console.error(error);
      alert('Error eliminando el equipo.');
    }
  };

  const filteredEquipos = equipos.filter(e => {
    const matchName = e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || e.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filtroCategoria ? e.categoria === filtroCategoria : true;
    return matchName && matchCat;
  });

  if (loading) {
    return <div className="p-10 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-amber-500" /></div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Inventario de Activos Fijos</h1>
          <p className="text-neutral-400">Control de equipos, maquinaria y mobiliario de la asociación.</p>
        </div>
        <Link 
          to="/inventario/equipos/nuevo" 
          className="px-4 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Registrar Activo
        </Link>
      </div>

      <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-4 mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[250px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="w-48">
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
          >
            <option value="">Todas las Categorías</option>
            <option value="maquinaria">Maquinaria</option>
            <option value="computacion">Computación</option>
            <option value="mobiliario">Mobiliario</option>
            <option value="herramientas">Herramientas</option>
            <option value="vehiculos">Vehículos</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEquipos.map(eq => (
          <div key={eq.id} className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 hover:border-amber-500/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-neutral-900 rounded-lg">
                {getCategoriaIcon(eq.categoria)}
              </div>
              {getEstadoBadge(eq.estado)}
            </div>
            
            <h3 className="font-bold text-lg text-white mb-1 truncate" title={eq.nombre}>{eq.nombre}</h3>
            <p className="text-sm font-mono text-neutral-400 mb-4">{eq.codigo}</p>
            
            <div className="space-y-2 text-sm text-neutral-300">
              <div className="flex justify-between">
                <span className="text-neutral-500">Marca:</span>
                <span>{eq.marca || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Modelo:</span>
                <span>{eq.modelo || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Ubicación:</span>
                <span>{eq.ubicacion || '-'}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-700 flex justify-between">
              <Link 
                to={`/inventario/equipos/editar/${eq.id}`}
                className="text-amber-500 hover:text-amber-400 text-sm font-medium"
              >
                Editar / Detalles
              </Link>
              <button 
                onClick={() => eliminarEquipo(eq.id, eq.nombre)}
                className="text-red-500 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredEquipos.length === 0 && (
          <div className="col-span-full py-12 text-center text-neutral-500 bg-neutral-800/50 rounded-xl border border-neutral-700 border-dashed">
            No se encontraron equipos o activos fijos.
          </div>
        )}
      </div>
    </div>
  );
}
