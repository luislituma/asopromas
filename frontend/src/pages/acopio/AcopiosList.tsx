import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Calendar, Package, ArrowLeft, Search, Droplets, Thermometer, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AcopiosList() {
  const [acopios, setAcopios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAcopios();
  }, []);

  async function fetchAcopios() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lotes_acopio')
        .select(`
          *,
          responsable:perfiles(nombre_completo)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAcopios(data || []);
    } catch (error) {
      console.error('Error fetching acopios:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'Abierto':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">Activo / Abierto</span>;
      case 'Cerrado':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">Cerrado en Bodega</span>;
      case 'Enviado a Planta':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Enviado a Planta</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">{estado}</span>;
    }
  };

  const filteredAcopios = acopios.filter(a => 
    a.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link to="/dashboard" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-500" />
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Acopio y Entregas</h1>
            </div>
            <p className="text-slate-500 ml-12">Gestiona los lotes de recolección de cacao diarios.</p>
          </div>
          <Link
            to="/acopio/nuevo"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-emerald-200"
          >
            <Plus className="w-5 h-5" />
            <span>Abrir Nuevo Lote</span>
          </Link>
        </div>

        {/* Buscador */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por código de acopio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-black"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : filteredAcopios.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No hay lotes de acopio</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Aún no se ha abierto ningún lote de recolección o no coincide con tu búsqueda.
            </p>
            <Link
              to="/acopio/nuevo"
              className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-6 py-3 rounded-xl font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Abrir el Primer Lote
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAcopios.map((acopio) => (
              <Link
                key={acopio.id}
                to={`/acopio/${acopio.id}`}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all hover:-translate-y-1 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-50 rounded-2xl group-hover:bg-emerald-100 transition-colors">
                    <Package className="w-6 h-6 text-emerald-600" />
                  </div>
                  {getStatusBadge(acopio.estado)}
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-1">{acopio.codigo}</h3>
                
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                  <Calendar className="w-4 h-4" />
                  <span>Abierto el: {new Date(acopio.fecha_inicio).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{acopio.responsable?.nombre_completo || 'Sin Encargado'}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-xs font-medium text-slate-500 mb-1">Total (KG)</div>
                    <div className="text-lg font-bold text-slate-700">{Number(acopio.peso_total_kg || 0).toFixed(2)}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-xs font-medium text-slate-500 mb-1">Total (LBS)</div>
                    <div className="text-lg font-bold text-slate-700">{Number(acopio.peso_total_lbs || 0).toFixed(2)}</div>
                  </div>
                </div>

                {acopio.estado !== 'Abierto' && (
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-xs text-slate-500" title="Humedad Final">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      {acopio.calidad_humedad_pct ? `${acopio.calidad_humedad_pct}%` : 'N/A'}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500" title="Fermentación">
                      <Thermometer className="w-4 h-4 text-orange-500" />
                      {acopio.calidad_fermentacion_pct ? `${acopio.calidad_fermentacion_pct}%` : 'N/A'}
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
