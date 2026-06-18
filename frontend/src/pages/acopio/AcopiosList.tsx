import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Calendar, Package, ArrowLeft, Search, Droplets, Thermometer, Filter, Sun, Clock } from 'lucide-react';
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

  const filteredAcopios = acopios.filter(a => 
    a.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Grouping by state
  const columnas = [
    { id: 'Abierto', titulo: 'Recibiendo', color: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <Package className="w-5 h-5 text-emerald-600" /> },
    { id: 'Fermentacion', titulo: 'En Fermentación', color: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: <Droplets className="w-5 h-5 text-amber-600" /> },
    { id: 'Secado', titulo: 'En Secado', color: 'bg-orange-50 border-orange-200', text: 'text-orange-700', icon: <Sun className="w-5 h-5 text-orange-600" /> },
    { id: 'Cerrado', titulo: 'Cerrado (Bodega)', color: 'bg-slate-50 border-slate-200', text: 'text-slate-700', icon: <Package className="w-5 h-5 text-slate-600" /> },
  ];

  const getDaysDiff = (startDateString: string) => {
    if (!startDateString) return 0;
    const start = new Date(startDateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link to="/dashboard" className="p-2 bg-white shadow-sm hover:bg-slate-50 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Flujo de Lotes de Acopio</h1>
            </div>
            <p className="text-slate-500 ml-12">Tablero de control: Recepción, Fermentación, Secado y Bodega.</p>
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
              placeholder="Buscar por código de lote..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-black"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors tooltip-trigger" title="Filtros avanzados">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Kanban Board */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="flex overflow-x-auto pb-4 gap-6 items-start">
            {columnas.map((col) => {
              const acopiosInCol = filteredAcopios.filter(a => a.estado === col.id);
              
              return (
                <div key={col.id} className="min-w-[320px] w-[320px] max-w-[320px] flex flex-col gap-4">
                  <div className={`p-4 rounded-2xl border ${col.color} shadow-sm flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      {col.icon}
                      <h2 className={`font-bold ${col.text}`}>{col.titulo}</h2>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full bg-white text-sm font-bold shadow-sm ${col.text}`}>
                      {acopiosInCol.length}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {acopiosInCol.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-2xl">
                        No hay lotes en esta etapa
                      </div>
                    ) : (
                      acopiosInCol.map((acopio) => (
                        <Link
                          key={acopio.id}
                          to={`/acopio/${acopio.id}`}
                          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{acopio.codigo}</h3>
                            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(acopio.fecha_inicio).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>

                          {col.id === 'Abierto' && (
                            <div className="bg-slate-50 p-2.5 rounded-xl flex justify-between items-center mb-3">
                              <span className="text-xs text-slate-500">Peso Baba:</span>
                              <span className="font-bold text-slate-700">{Number(acopio.peso_total_kg || 0).toFixed(2)} KG</span>
                            </div>
                          )}

                          {col.id === 'Fermentacion' && (
                            <div className="bg-amber-50 p-2.5 rounded-xl flex justify-between items-center mb-3 border border-amber-100">
                              <span className="text-xs text-amber-700 flex items-center gap-1"><Clock className="w-3 h-3"/> Días en cajón:</span>
                              <span className="font-bold text-amber-800">{getDaysDiff(acopio.fecha_inicio_fermentacion)} días</span>
                            </div>
                          )}

                          {col.id === 'Secado' && (
                            <div className="bg-orange-50 p-2.5 rounded-xl flex justify-between items-center mb-3 border border-orange-100">
                              <span className="text-xs text-orange-700 flex items-center gap-1"><Sun className="w-3 h-3"/> {acopio.metodo_secado || 'Secando'}:</span>
                              <span className="font-bold text-orange-800">{getDaysDiff(acopio.fecha_inicio_secado)} días</span>
                            </div>
                          )}

                          {col.id === 'Cerrado' && (
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                <div className="text-[10px] text-slate-400">Peso Seco</div>
                                <div className="text-sm font-bold text-slate-700">{Number(acopio.peso_neto_seco_kg || 0).toFixed(2)} KG</div>
                              </div>
                              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                <div className="text-[10px] text-slate-400">Calidad</div>
                                <div className="text-xs font-medium text-slate-600 flex items-center gap-1">
                                  H: {acopio.calidad_humedad_pct}% / F: {acopio.calidad_fermentacion_pct}%
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-2 pt-3 border-t border-slate-100">
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                              {acopio.responsable?.nombre_completo?.charAt(0) || 'U'}
                            </div>
                            <span className="text-xs text-slate-500 truncate">{acopio.responsable?.nombre_completo || 'Sin Encargado'}</span>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
