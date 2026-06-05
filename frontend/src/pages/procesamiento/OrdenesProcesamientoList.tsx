import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Factory, Search, Plus, Loader2, ArrowLeft, Eye, Clock, CheckCircle2 } from 'lucide-react';

export default function OrdenesProcesamientoList() {
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrdenes();
  }, []);

  const fetchOrdenes = async () => {
    try {
      const { data, error } = await supabase
        .from('ordenes_procesamiento')
        .select(`
          *,
          recetas ( nombre_receta, productos_catalogo ( nombre, unidad_medida ) ),
          lotes ( codigo_lote ),
          perfiles ( nombre_completo )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrdenes(data || []);
    } catch (error) {
      console.error('Error fetching ordenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const finalizarOrden = async (id: string, codigo: string) => {
    if (!window.confirm(`¿Estás seguro que deseas FINALIZAR la orden ${codigo}? Esto descontará inventario y no se puede deshacer.`)) return;
    
    try {
      const { error } = await supabase.from('ordenes_procesamiento').update({ estado: 'finalizado' }).eq('id', id);
      if (error) throw error;
      
      const orden = ordenes.find(o => o.id === id);
      if (orden) {
        import('../../lib/email').then(({ sendOperationNotification }) => {
          sendOperationNotification({
            tipo_operacion: 'Orden de Producción Finalizada',
            codigo,
            detalles: `Se han producido ${orden.cantidad_a_producir} ${orden.recetas?.productos_catalogo?.unidad_medida} de ${orden.recetas?.productos_catalogo?.nombre}.`,
            responsable: orden.perfiles?.nombre_completo || 'Operador',
            fecha: new Date().toLocaleString(),
            destinatarios_extra: 'ventas@asopromas.com'
          });
        });
      }
      
      fetchOrdenes();
    } catch (error: any) {
      console.error(error);
      if (error?.code === '23514' && error?.message?.includes('insumos_stock_disponible_check')) {
        alert('❌ No se puede finalizar la orden: No hay suficiente stock de los ingredientes/insumos requeridos en bodega para esta receta.');
      } else {
        alert('Error al finalizar la orden.');
      }
    }
  };

  const filteredOrdenes = ordenes.filter(o => 
    o.codigo_orden.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.recetas?.productos_catalogo?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
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
              <Factory className="h-8 w-8 text-amber-500" />
              Órdenes de Procesamiento
            </h1>
            <p className="text-neutral-400 mt-1">Elaboración de derivados y control de trazabilidad por lote.</p>
          </div>
          <div className="flex gap-3">
            <Link 
              to="/procesamiento/productos"
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white font-medium rounded-md hover:bg-neutral-700 transition-colors border border-neutral-700"
            >
              Catálogo y Recetas
            </Link>
            <Link 
              to="/procesamiento/ordenes/nueva"
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-medium rounded-md hover:bg-amber-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Nueva Orden
            </Link>
          </div>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-neutral-700 flex justify-between items-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-500" />
              </div>
              <input
                type="text"
                placeholder="Buscar por código u orden..."
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
          ) : filteredOrdenes.length === 0 ? (
            <div className="p-12 text-center text-neutral-400">
              <p>No se encontraron órdenes de procesamiento.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="bg-neutral-900/50 text-neutral-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Código</th>
                    <th className="px-6 py-4 font-medium">Producto a Elaborar</th>
                    <th className="px-6 py-4 font-medium">Lote Base</th>
                    <th className="px-6 py-4 font-medium">Cantidad Producida</th>
                    <th className="px-6 py-4 font-medium">Estado</th>
                    <th className="px-6 py-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700/50">
                  {filteredOrdenes.map((orden) => (
                    <tr key={orden.id} className="hover:bg-neutral-700/20">
                      <td className="px-6 py-4 font-medium text-white">{orden.codigo_orden}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-white">{orden.recetas?.productos_catalogo?.nombre}</p>
                        <p className="text-xs text-neutral-400">Receta: {orden.recetas?.nombre_receta}</p>
                      </td>
                      <td className="px-6 py-4 text-emerald-400 font-medium">
                        {orden.lotes?.codigo_lote}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-white">{orden.cantidad_a_producir}</span> {orden.recetas?.productos_catalogo?.unidad_medida}
                      </td>
                      <td className="px-6 py-4">
                        {orden.estado === 'en_proceso' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium border border-amber-500/30">
                            <Clock className="h-3 w-3" /> En Proceso
                          </span>
                        ) : orden.estado === 'finalizado' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/30">
                            <CheckCircle2 className="h-3 w-3" /> Finalizado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-500/20 text-neutral-400 rounded-full text-xs font-medium border border-neutral-500/30">
                            {orden.estado}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {orden.estado === 'en_proceso' && (
                          <button 
                            onClick={() => finalizarOrden(orden.id, orden.codigo_orden)}
                            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors text-xs border border-emerald-400/30 px-2 py-1 rounded"
                          >
                            Finalizar
                          </button>
                        )}
                        <Link to={`/procesamiento/ordenes/${orden.id}`} className="text-neutral-400 hover:text-white transition-colors p-2 inline-block">
                          <Eye className="h-4 w-4" />
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
