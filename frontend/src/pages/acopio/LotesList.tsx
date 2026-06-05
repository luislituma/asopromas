import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Package, Search, ExternalLink, ArrowLeft, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LotesList() {
  const [lotes, setLotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLotes() {
      try {
        const { data, error } = await supabase
          .from('lotes')
          .select(`
            *,
            entregas_cacao ( count )
          `)
          .order('fecha_creacion', { ascending: false });

        if (error) throw error;
        setLotes(data || []);
      } catch (error) {
        console.error('Error fetching lotes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLotes();
  }, []);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'abierto': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'cerrado': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'procesado': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'exportado': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default: return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/50';
    }
  };

  const handleCrearLote = async () => {
    const numeroStr = (lotes.length + 1).toString().padStart(4, '0');
    const anio = new Date().getFullYear().toString().slice(-2);
    const codigoSugerido = `LT-${anio}-${numeroStr}`;
    
    const codigoFinal = prompt('Ingresa el código para el nuevo lote:', codigoSugerido);
    
    if (codigoFinal && codigoFinal.trim() !== '') {
      try {
        const { data, error } = await supabase
          .from('lotes')
          .insert([{ codigo_lote: codigoFinal.trim(), peso_total: 0, estado: 'abierto' }])
          .select()
          .single();
          
        if (error) throw error;
        setLotes([data, ...lotes]);
      } catch (error) {
        console.error(error);
        alert('Error al generar lote');
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver al Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Package className="h-8 w-8 text-amber-500" />
              Lotes y Trazabilidad
            </h1>
            <p className="text-neutral-400 mt-1">Gestión de lotes de cacao acopiado.</p>
          </div>
          
          <button
            onClick={handleCrearLote}
            className="px-4 py-2 bg-amber-500 text-black font-medium rounded-md hover:bg-amber-600 transition-colors"
          >
            Generar Nuevo Lote
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-10 text-neutral-400">Cargando lotes...</div>
          ) : lotes.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700">
              <Package className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No hay lotes creados</h3>
              <p className="text-neutral-400">Genera tu primer lote para empezar la trazabilidad.</p>
            </div>
          ) : (
            lotes.map((lote) => (
              <div key={lote.id} className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden hover:border-amber-500/50 transition-colors">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{lote.codigo_lote}</h3>
                      <p className="text-sm text-neutral-400 mt-1">Creado: {new Date(lote.fecha_creacion).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className={`px-2.5 py-1 rounded border text-xs font-medium uppercase tracking-wider ${getStatusColor(lote.estado)}`}>
                        {lote.estado}
                      </span>
                      <Link to={`/lotes/editar/${lote.id}`} className="p-1.5 text-neutral-400 hover:text-amber-500 transition-colors">
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-end">
                    <div>
                      <p className="text-sm text-neutral-400">Peso Total Consolidado</p>
                      <p className="text-2xl font-bold text-amber-500 mt-1">
                        {lote.peso_total} <span className="text-sm text-amber-500/70 font-normal">kg</span>
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-neutral-400">Entregas</p>
                      <p className="font-medium text-white mt-1">
                        {lote.entregas_cacao?.[0]?.count || 0}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-neutral-900/50 px-5 py-3 border-t border-neutral-700 flex justify-between items-center">
                  <span className="text-xs text-neutral-500">
                    {lote.notas || 'Sin observaciones'}
                  </span>
                  <Link to={`/lotes/${lote.id}`} className="text-amber-500 hover:text-amber-400 p-2 rounded-full hover:bg-neutral-800 transition-colors" title="Ver Detalles">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
